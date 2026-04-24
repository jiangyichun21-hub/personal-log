const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { signToken } = require('../middleware/auth');

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

async function register(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  if (username.length < 2 || username.length > 20) {
    return res.status(400).json({ error: '用户名长度需在 2-20 个字符之间' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少 6 位' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(409).json({ error: '用户名已被占用' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();
  const now = new Date().toISOString();
  db.prepare(
    'INSERT INTO users (id, username, password, avatar, bio, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, username, hashedPassword, '', '', now);
  const token = signToken(id);
  const user = formatUser(db.prepare('SELECT * FROM users WHERE id = ?').get(id));
  return res.status(201).json({ token, user });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const isMatch = await bcrypt.compare(password, row.password);
  if (!isMatch) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const token = signToken(row.id);
  const user = formatUser(row);
  return res.json({ token, user });
}

function getMe(req, res) {
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  return res.json(formatUser(row));
}

function updateMe(req, res) {
  const { avatar, bio } = req.body;
  db.prepare('UPDATE users SET avatar = ?, bio = ? WHERE id = ?').run(
    avatar ?? '',
    bio ?? '',
    req.userId
  );
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId);
  return res.json(formatUser(row));
}

function getUserByUsername(req, res) {
  const { username } = req.params;
  const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  return res.json(formatUser(row));
}

module.exports = { register, login, getMe, updateMe, getUserByUsername };
