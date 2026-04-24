const express = require('express');
const router = express.Router();
const { register, login, getMe, updateMe, getUserByUsername } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 注册新用户
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 注册成功
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登录成功
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 获取当前用户信息
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 用户信息
 */
router.get('/me', authMiddleware, getMe);

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: 更新当前用户信息
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put('/me', authMiddleware, updateMe);

/**
 * @swagger
 * /api/auth/user/{username}:
 *   get:
 *     summary: 根据用户名搜索用户
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/user/:username', authMiddleware, getUserByUsername);

module.exports = router;
