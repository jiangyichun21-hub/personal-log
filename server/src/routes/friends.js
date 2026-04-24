const express = require('express');
const router = express.Router();
const {
  getFriends,
  getPendingRequests,
  getSentRequests,
  sendFriendRequest,
  respondToRequest,
  removeFriend,
} = require('../controllers/friendController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: 获取好友列表
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, getFriends);

/**
 * @swagger
 * /api/friends/requests/pending:
 *   get:
 *     summary: 获取收到的待处理好友申请
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 */
router.get('/requests/pending', authMiddleware, getPendingRequests);

/**
 * @swagger
 * /api/friends/requests/sent:
 *   get:
 *     summary: 获取已发送的好友申请
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 */
router.get('/requests/sent', authMiddleware, getSentRequests);

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: 发送好友申请
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 */
router.post('/request', authMiddleware, sendFriendRequest);

/**
 * @swagger
 * /api/friends/requests/{id}:
 *   put:
 *     summary: 接受或拒绝好友申请
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 */
router.put('/requests/:id', authMiddleware, respondToRequest);

/**
 * @swagger
 * /api/friends/{friendId}:
 *   delete:
 *     summary: 删除好友
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:friendId', authMiddleware, removeFriend);

module.exports = router;
