const { v4: uuidv4 } = require('uuid');
const db = require('../db');

function formatUser(row) {
  if (!row) return null;
  const friendIds = db
    .prepare('SELECT friend_id FROM friendships WHERE user_id = ?')
    .all(row.id)
    .map((r) => r.friend_id);
  return {
    id: row.id,
    username: row.username,
    avatar: row.avatar || '',
    bio: row.bio || '',
    createdAt: row.created_at,
    friendIds,
  };
}

function getFriends(req, res) {
  const rows = db
    .prepare(
      'SELECT u.* FROM users u INNER JOIN friendships f ON u.id = f.friend_id WHERE f.user_id = ?'
    )
    .all(req.userId);
  return res.json(rows.map(formatUser));
}

function getPendingRequests(req, res) {
  const rows = db
    .prepare(
      "SELECT fr.*, u.username, u.avatar, u.bio FROM friend_requests fr INNER JOIN users u ON u.id = fr.from_user_id WHERE fr.to_user_id = ? AND fr.status = 'pending'"
    )
    .all(req.userId);
  const requests = rows.map((r) => ({
    id: r.id,
    fromUserId: r.from_user_id,
    toUserId: r.to_user_id,
    status: r.status,
    createdAt: r.created_at,
    fromUser: { id: r.from_user_id, username: r.username, avatar: r.avatar, bio: r.bio },
  }));
  return res.json(requests);
}

function getSentRequests(req, res) {
  const rows = db
    .prepare(
      "SELECT fr.*, u.username, u.avatar FROM friend_requests fr INNER JOIN users u ON u.id = fr.to_user_id WHERE fr.from_user_id = ? AND fr.status = 'pending'"
    )
    .all(req.userId);
  const requests = rows.map((r) => ({
    id: r.id,
    fromUserId: r.from_user_id,
    toUserId: r.to_user_id,
    status: r.status,
    createdAt: r.created_at,
    toUser: { id: r.to_user_id, username: r.username, avatar: r.avatar },
  }));
  return res.json(requests);
}

function sendFriendRequest(req, res) {
  const { toUserId } = req.body;
  const fromUserId = req.userId;

  if (toUserId === fromUserId) {
    return res.status(400).json({ error: '不能添加自己为好友' });
  }
  const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(toUserId);
  if (!targetUser) return res.status(404).json({ error: '用户不存在' });

  const alreadyFriends = db
    .prepare('SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ?')
    .get(fromUserId, toUserId);
  if (alreadyFriends) return res.status(409).json({ error: '已经是好友了' });

  const existingRequest = db
    .prepare(
      "SELECT id FROM friend_requests WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'"
    )
    .get(fromUserId, toUserId);
  if (existingRequest) return res.status(409).json({ error: '已发送过好友申请' });

  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO friend_requests (id, from_user_id, to_user_id, status, created_at) VALUES (?, ?, ?, ?, ?)'
  ).run(id, fromUserId, toUserId, 'pending', now);

  return res.status(201).json({ id, fromUserId, toUserId, status: 'pending', createdAt: now });
}

function respondToRequest(req, res) {
  const { id } = req.params;
  const { action } = req.body;

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'action 必须是 accept 或 reject' });
  }

  const request = db.prepare('SELECT * FROM friend_requests WHERE id = ?').get(id);
  if (!request) return res.status(404).json({ error: '申请不存在' });
  if (request.to_user_id !== req.userId) return res.status(403).json({ error: '无权操作此申请' });
  if (request.status !== 'pending') return res.status(400).json({ error: '申请已处理' });

  const status = action === 'accept' ? 'accepted' : 'rejected';
  db.prepare('UPDATE friend_requests SET status = ? WHERE id = ?').run(status, id);

  if (action === 'accept') {
    const now = new Date().toISOString();
    db.prepare('INSERT OR IGNORE INTO friendships (user_id, friend_id, created_at) VALUES (?, ?, ?)').run(
      request.from_user_id,
      request.to_user_id,
      now
    );
    db.prepare('INSERT OR IGNORE INTO friendships (user_id, friend_id, created_at) VALUES (?, ?, ?)').run(
      request.to_user_id,
      request.from_user_id,
      now
    );
  }

  return res.json({ success: true, status });
}

function removeFriend(req, res) {
  const { friendId } = req.params;
  db.prepare('DELETE FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)').run(
    req.userId,
    friendId,
    friendId,
    req.userId
  );
  return res.json({ success: true });
}

module.exports = {
  getFriends,
  getPendingRequests,
  getSentRequests,
  sendFriendRequest,
  respondToRequest,
  removeFriend,
};
