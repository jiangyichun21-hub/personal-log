const bcrypt = require('bcryptjs');
const { userDb } = require('../db');
const { signToken } = require('../middleware/auth');

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
  const existing = userDb.findByUsername(username);
  if (existing) {
    return res.status(409).json({ error: '用户名已被占用' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userDb.create({ username, password: hashedPassword });
  const token = signToken(user.id);
  return res.status(201).json({ token, user: formatUser(user) });
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }
  const row = userDb.findByUsername(username);
  if (!row) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const isMatch = await bcrypt.compare(password, row.password);
  if (!isMatch) {
    return res.status(401).json({ error: '用户名或密码错误' });
  }
  const token = signToken(row.id);
  return res.json({ token, user: formatUser(row) });
}

function getMe(req, res) {
  const row = userDb.findById(req.userId);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  return res.json(formatUser(row));
}

function updateMe(req, res) {
  const { avatar, bio } = req.body;
  const updated = userDb.update(req.userId, { avatar: avatar ?? '', bio: bio ?? '' });
  if (!updated) return res.status(404).json({ error: '用户不存在' });
  return res.json(formatUser(updated));
}

function getUserByUsername(req, res) {
  const { username } = req.params;
  const row = userDb.findByUsername(username);
  if (!row) return res.status(404).json({ error: '用户不存在' });
  return res.json(formatUser(row));
}

module.exports = { register, login, getMe, updateMe, getUserByUsername };
