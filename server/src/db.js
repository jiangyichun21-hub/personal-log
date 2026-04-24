const { v4: uuidv4 } = require('uuid');

const store = {
  users: new Map(),
  journals: new Map(),
  friendRequests: new Map(),
  friendships: new Map(),
};

function generateId() {
  return uuidv4();
}

const userDb = {
  findById(id) {
    return store.users.get(id) || null;
  },

  findByUsername(username) {
    for (const user of store.users.values()) {
      if (user.username === username) return user;
    }
    return null;
  },

  create(data) {
    const user = {
      id: generateId(),
      username: data.username,
      password: data.password,
      avatar: data.avatar || '',
      bio: data.bio || '',
      created_at: new Date().toISOString(),
    };
    store.users.set(user.id, user);
    return user;
  },

  update(id, fields) {
    const user = store.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...fields };
    store.users.set(id, updated);
    return updated;
  },

  getFriendIds(userId) {
    const key = userId;
    return store.friendships.get(key) || [];
  },
};

const journalDb = {
  findById(id) {
    return store.journals.get(id) || null;
  },

  findByUserId(userId) {
    const result = [];
    for (const journal of store.journals.values()) {
      if (journal.user_id === userId) result.push(journal);
    }
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  create(data) {
    const now = new Date().toISOString();
    const journal = {
      id: generateId(),
      user_id: data.userId,
      title: data.title,
      content: data.content,
      visibility: data.visibility || 'private',
      created_at: now,
      updated_at: now,
    };
    store.journals.set(journal.id, journal);
    return journal;
  },

  update(id, fields) {
    const journal = store.journals.get(id);
    if (!journal) return null;
    const updated = { ...journal, ...fields, updated_at: new Date().toISOString() };
    store.journals.set(id, updated);
    return updated;
  },

  delete(id) {
    store.journals.delete(id);
  },
};

const friendshipDb = {
  areFriends(userId, friendId) {
    const friends = store.friendships.get(userId) || [];
    return friends.includes(friendId);
  },

  addFriendship(userId, friendId) {
    const now = new Date().toISOString();
    const userFriends = store.friendships.get(userId) || [];
    if (!userFriends.includes(friendId)) {
      store.friendships.set(userId, [...userFriends, friendId]);
    }
    const friendFriends = store.friendships.get(friendId) || [];
    if (!friendFriends.includes(userId)) {
      store.friendships.set(friendId, [...friendFriends, userId]);
    }
    return now;
  },

  removeFriendship(userId, friendId) {
    const userFriends = store.friendships.get(userId) || [];
    store.friendships.set(userId, userFriends.filter((id) => id !== friendId));
    const friendFriends = store.friendships.get(friendId) || [];
    store.friendships.set(friendId, friendFriends.filter((id) => id !== userId));
  },

  getFriends(userId) {
    const friendIds = store.friendships.get(userId) || [];
    return friendIds.map((id) => store.users.get(id)).filter(Boolean);
  },
};

const friendRequestDb = {
  findById(id) {
    return store.friendRequests.get(id) || null;
  },

  findPendingBetween(fromUserId, toUserId) {
    for (const req of store.friendRequests.values()) {
      if (req.from_user_id === fromUserId && req.to_user_id === toUserId && req.status === 'pending') {
        return req;
      }
    }
    return null;
  },

  getPendingForUser(toUserId) {
    const result = [];
    for (const req of store.friendRequests.values()) {
      if (req.to_user_id === toUserId && req.status === 'pending') result.push(req);
    }
    return result;
  },

  getSentByUser(fromUserId) {
    const result = [];
    for (const req of store.friendRequests.values()) {
      if (req.from_user_id === fromUserId && req.status === 'pending') result.push(req);
    }
    return result;
  },

  create(fromUserId, toUserId) {
    const request = {
      id: generateId(),
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    store.friendRequests.set(request.id, request);
    return request;
  },

  updateStatus(id, status) {
    const req = store.friendRequests.get(id);
    if (!req) return null;
    const updated = { ...req, status };
    store.friendRequests.set(id, updated);
    return updated;
  },
};

module.exports = { userDb, journalDb, friendshipDb, friendRequestDb };
