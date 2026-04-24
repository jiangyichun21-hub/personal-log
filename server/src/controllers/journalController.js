const { journalDb, friendshipDb } = require('../db');

function formatJournal(row) {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    visibility: row.visibility,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getMyJournals(req, res) {
  const rows = journalDb.findByUserId(req.userId);
  return res.json(rows.map(formatJournal));
}

function getUserJournals(req, res) {
  const { userId } = req.params;
  const requesterId = req.userId;
  const allJournals = journalDb.findByUserId(userId);

  let filtered;
  if (requesterId === userId) {
    filtered = allJournals;
  } else if (friendshipDb.areFriends(requesterId, userId)) {
    filtered = allJournals.filter((j) => j.visibility === 'friends' || j.visibility === 'public');
  } else {
    filtered = allJournals.filter((j) => j.visibility === 'public');
  }
  return res.json(filtered.map(formatJournal));
}

function getJournalById(req, res) {
  const { id } = req.params;
  const row = journalDb.findById(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });

  const requesterId = req.userId;
  if (row.user_id !== requesterId) {
    if (row.visibility === 'private') {
      return res.status(403).json({ error: '无权查看此日记' });
    }
    if (row.visibility === 'friends' && !friendshipDb.areFriends(requesterId, row.user_id)) {
      return res.status(403).json({ error: '无权查看此日记' });
    }
  }
  return res.json(formatJournal(row));
}

function createJournal(req, res) {
  const { title, content, visibility } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: '标题和内容不能为空' });
  }
  const journal = journalDb.create({
    userId: req.userId,
    title,
    content,
    visibility: visibility || 'private',
  });
  return res.status(201).json(formatJournal(journal));
}

function updateJournal(req, res) {
  const { id } = req.params;
  const row = journalDb.findById(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });
  if (row.user_id !== req.userId) return res.status(403).json({ error: '无权修改此日记' });

  const { title, content, visibility } = req.body;
  const updated = journalDb.update(id, {
    title: title ?? row.title,
    content: content ?? row.content,
    visibility: visibility ?? row.visibility,
  });
  return res.json(formatJournal(updated));
}

function deleteJournal(req, res) {
  const { id } = req.params;
  const row = journalDb.findById(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });
  if (row.user_id !== req.userId) return res.status(403).json({ error: '无权删除此日记' });
  journalDb.delete(id);
  return res.json({ success: true });
}

module.exports = {
  getMyJournals,
  getUserJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
};
