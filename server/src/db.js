const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DATA_DIR = '/tmp/journal_data';
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const JOURNALS_FILE = path.join(DATA_DIR, 'journals.json');
const FRIEND_REQUESTS_FILE = path.join(DATA_DIR, 'friend_requests.json');
const FRIENDSHIPS_FILE = path.join(DATA_DIR, 'friendships.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJsonFile(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch {
    return defaultValue;
  }
}

function writeJsonFile(filePath, data) {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function loadUsers() {
  const arr = readJsonFile(USERS_FILE, []);
  const map = new Map();
  arr.forEach((u) => map.set(u.id, u));
  return map;
}

function saveUsers(map) {
  writeJsonFile(USERS_FILE, Array.from(map.values()));
}

function loadJournals() {
  const arr = readJsonFile(JOURNALS_FILE, []);
  const map = new Map();
  arr.forEach((j) => map.set(j.id, j));
  return map;
}

function saveJournals(map) {
  writeJsonFile(JOURNALS_FILE, Array.from(map.values()));
}

function loadFriendRequests() {
  const arr = readJsonFile(FRIEND_REQUESTS_FILE, []);
  const map = new Map();
  arr.forEach((r) => map.set(r.id, r));
  return map;
}

function saveFriendRequests(map) {
  writeJsonFile(FRIEND_REQUESTS_FILE, Array.from(map.values()));
}

function loadFriendships() {
  const obj = readJsonFile(FRIENDSHIPS_FILE, {});
  const map = new Map();
  Object.entries(obj).forEach(([k, v]) => map.set(k, v));
  return map;
}

function saveFriendships(map) {
  const obj = {};
  map.forEach((v, k) => { obj[k] = v; });
  writeJsonFile(FRIENDSHIPS_FILE, obj);
}

function generateId() {
  return uuidv4();
}

const userDb = {
  findById(id) {
    const users = loadUsers();
    return users.get(id) || null;
  },

  findByUsername(username) {
    const users = loadUsers();
    for (const user of users.values()) {
      if (user.username === username) return user;
    }
    return null;
  },

  create(data) {
    const users = loadUsers();
    const user = {
      id: generateId(),
      username: data.username,
      password: data.password,
      avatar: data.avatar || '',
      bio: data.bio || '',
      created_at: new Date().toISOString(),
    };
    users.set(user.id, user);
    saveUsers(users);
    return user;
  },

  update(id, fields) {
    const users = loadUsers();
    const user = users.get(id);
    if (!user) return null;
    const updated = { ...user, ...fields };
    users.set(id, updated);
    saveUsers(users);
    return updated;
  },

  getFriendIds(userId) {
    const friendships = loadFriendships();
    return friendships.get(userId) || [];
  },
};

const journalDb = {
  findById(id) {
    const journals = loadJournals();
    return journals.get(id) || null;
  },

  findByUserId(userId) {
    const journals = loadJournals();
    const result = [];
    for (const journal of journals.values()) {
      if (journal.user_id === userId) result.push(journal);
    }
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  create(data) {
    const journals = loadJournals();
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
    journals.set(journal.id, journal);
    saveJournals(journals);
    return journal;
  },

  update(id, fields) {
    const journals = loadJournals();
    const journal = journals.get(id);
    if (!journal) return null;
    const updated = { ...journal, ...fields, updated_at: new Date().toISOString() };
    journals.set(id, updated);
    saveJournals(journals);
    return updated;
  },

  delete(id) {
    const journals = loadJournals();
    journals.delete(id);
    saveJournals(journals);
  },
};

const friendshipDb = {
  areFriends(userId, friendId) {
    const friendships = loadFriendships();
    const friends = friendships.get(userId) || [];
    return friends.includes(friendId);
  },

  addFriendship(userId, friendId) {
    const friendships = loadFriendships();
    const now = new Date().toISOString();
    const userFriends = friendships.get(userId) || [];
    if (!userFriends.includes(friendId)) {
      friendships.set(userId, [...userFriends, friendId]);
    }
    const friendFriends = friendships.get(friendId) || [];
    if (!friendFriends.includes(userId)) {
      friendships.set(friendId, [...friendFriends, userId]);
    }
    saveFriendships(friendships);
    return now;
  },

  removeFriendship(userId, friendId) {
    const friendships = loadFriendships();
    const userFriends = friendships.get(userId) || [];
    friendships.set(userId, userFriends.filter((id) => id !== friendId));
    const friendFriends = friendships.get(friendId) || [];
    friendships.set(friendId, friendFriends.filter((id) => id !== userId));
    saveFriendships(friendships);
  },

  getFriends(userId) {
    const friendships = loadFriendships();
    const users = loadUsers();
    const friendIds = friendships.get(userId) || [];
    return friendIds.map((id) => users.get(id)).filter(Boolean);
  },
};

const friendRequestDb = {
  findById(id) {
    const requests = loadFriendRequests();
    return requests.get(id) || null;
  },

  findPendingBetween(fromUserId, toUserId) {
    const requests = loadFriendRequests();
    for (const req of requests.values()) {
      if (req.from_user_id === fromUserId && req.to_user_id === toUserId && req.status === 'pending') {
        return req;
      }
    }
    return null;
  },

  getPendingForUser(toUserId) {
    const requests = loadFriendRequests();
    const result = [];
    for (const req of requests.values()) {
      if (req.to_user_id === toUserId && req.status === 'pending') result.push(req);
    }
    return result;
  },

  getSentByUser(fromUserId) {
    const requests = loadFriendRequests();
    const result = [];
    for (const req of requests.values()) {
      if (req.from_user_id === fromUserId && req.status === 'pending') result.push(req);
    }
    return result;
  },

  create(fromUserId, toUserId) {
    const requests = loadFriendRequests();
    const request = {
      id: generateId(),
      from_user_id: fromUserId,
      to_user_id: toUserId,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    requests.set(request.id, request);
    saveFriendRequests(requests);
    return request;
  },

  updateStatus(id, status) {
    const requests = loadFriendRequests();
    const req = requests.get(id);
    if (!req) return null;
    const updated = { ...req, status };
    requests.set(id, updated);
    saveFriendRequests(requests);
    return updated;
  },
};

module.exports = { userDb, journalDb, friendshipDb, friendRequestDb };
