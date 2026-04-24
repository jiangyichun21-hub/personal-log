const { v4: uuidv4 } = require('uuid');
const db = require('../db');

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

function isFriend(userId, targetId) {
  const row = db
    .prepare('SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ?')
    .get(userId, targetId);
  return !!row;
}

function getMyJournals(req, res) {
  const rows = db
    .prepare('SELECT * FROM journals WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.userId);
  return res.json(rows.map(formatJournal));
}

function getUserJournals(req, res) {
  const { userId } = req.params;
  const requesterId = req.userId;
  const friendRelation = isFriend(requesterId, userId);

  let rows;
  if (requesterId === userId) {
    rows = db
      .prepare('SELECT * FROM journals WHERE user_id = ? ORDER BY created_at DESC')
      .all(userId);
  } else if (friendRelation) {
    rows = db
      .prepare(
        "SELECT * FROM journals WHERE user_id = ? AND visibility IN ('friends', 'public') ORDER BY created_at DESC"
      )
      .all(userId);
  } else {
    rows = db
      .prepare(
        "SELECT * FROM journals WHERE user_id = ? AND visibility = 'public' ORDER BY created_at DESC"
      )
      .all(userId);
  }
  return res.json(rows.map(formatJournal));
}

function getJournalById(req, res) {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM journals WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });

  const requesterId = req.userId;
  if (row.user_id !== requesterId) {
    if (row.visibility === 'private') {
      return res.status(403).json({ error: '无权查看此日记' });
    }
    if (row.visibility === 'friends' && !isFriend(requesterId, row.user_id)) {
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
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO journals (id, user_id, title, content, visibility, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(id, req.userId, title, content, visibility || 'private', now, now);
  const row = db.prepare('SELECT * FROM journals WHERE id = ?').get(id);
  return res.status(201).json(formatJournal(row));
}

function updateJournal(req, res) {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM journals WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });
  if (row.user_id !== req.userId) return res.status(403).json({ error: '无权修改此日记' });

  const { title, content, visibility } = req.body;
  const now = new Date().toISOString();
  db.prepare(
    'UPDATE journals SET title = ?, content = ?, visibility = ?, updated_at = ? WHERE id = ?'
  ).run(
    title ?? row.title,
    content ?? row.content,
    visibility ?? row.visibility,
    now,
    id
  );
  const updated = db.prepare('SELECT * FROM journals WHERE id = ?').get(id);
  return res.json(formatJournal(updated));
}

function deleteJournal(req, res) {
  const { id } = req.params;
  const row = db.prepare('SELECT * FROM journals WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: '日记不存在' });
  if (row.user_id !== req.userId) return res.status(403).json({ error: '无权删除此日记' });
  db.prepare('DELETE FROM journals WHERE id = ?').run(id);
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
