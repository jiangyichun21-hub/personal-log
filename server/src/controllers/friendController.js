const { userDb, friendshipDb, friendRequestDb } = require('../db');

function formatUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    username: row.username,
    avatar: row.avatar || '',
    bio: row.bio || '',
    createdAt: row.created_at,
    friendIds: userDb.getFriendIds(row.id),
  };
}

function getFriends(req, res) {
  const friends = friendshipDb.getFriends(req.userId);
  return res.json(friends.map(formatUser));
}

function getPendingRequests(req, res) {
  const requests = friendRequestDb.getPendingForUser(req.userId);
  const result = requests.map((r) => {
    const fromUser = userDb.findById(r.from_user_id);
    return {
      id: r.id,
      fromUserId: r.from_user_id,
      toUserId: r.to_user_id,
      status: r.status,
      createdAt: r.created_at,
      fromUser: fromUser
        ? { id: fromUser.id, username: fromUser.username, avatar: fromUser.avatar, bio: fromUser.bio }
        : null,
    };
  });
  return res.json(result);
}

function getSentRequests(req, res) {
  const requests = friendRequestDb.getSentByUser(req.userId);
  const result = requests.map((r) => {
    const toUser = userDb.findById(r.to_user_id);
    return {
      id: r.id,
      fromUserId: r.from_user_id,
      toUserId: r.to_user_id,
      status: r.status,
      createdAt: r.created_at,
      toUser: toUser
        ? { id: toUser.id, username: toUser.username, avatar: toUser.avatar }
        : null,
    };
  });
  return res.json(result);
}

function sendFriendRequest(req, res) {
  const { toUserId } = req.body;
  const fromUserId = req.userId;

  if (toUserId === fromUserId) {
    return res.status(400).json({ error: '不能添加自己为好友' });
  }
  const targetUser = userDb.findById(toUserId);
  if (!targetUser) return res.status(404).json({ error: '用户不存在' });

  if (friendshipDb.areFriends(fromUserId, toUserId)) {
    return res.status(409).json({ error: '已经是好友了' });
  }

  const existingRequest = friendRequestDb.findPendingBetween(fromUserId, toUserId);
  if (existingRequest) return res.status(409).json({ error: '已发送过好友申请' });

  const request = friendRequestDb.create(fromUserId, toUserId);
  return res.status(201).json({
    id: request.id,
    fromUserId: request.from_user_id,
    toUserId: request.to_user_id,
    status: request.status,
    createdAt: request.created_at,
  });
}

function respondToRequest(req, res) {
  const { id } = req.params;
  const { action } = req.body;

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'action 必须是 accept 或 reject' });
  }

  const request = friendRequestDb.findById(id);
  if (!request) return res.status(404).json({ error: '申请不存在' });
  if (request.to_user_id !== req.userId) return res.status(403).json({ error: '无权操作此申请' });
  if (request.status !== 'pending') return res.status(400).json({ error: '申请已处理' });

  const status = action === 'accept' ? 'accepted' : 'rejected';
  friendRequestDb.updateStatus(id, status);

  if (action === 'accept') {
    friendshipDb.addFriendship(request.from_user_id, request.to_user_id);
  }

  return res.json({ success: true, status });
}

function removeFriend(req, res) {
  const { friendId } = req.params;
  friendshipDb.removeFriendship(req.userId, friendId);
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
