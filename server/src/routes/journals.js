const express = require('express');
const router = express.Router();
const {
  getMyJournals,
  getUserJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
} = require('../controllers/journalController');
const { authMiddleware } = require('../middleware/auth');

/**
 * @swagger
 * /api/journals:
 *   get:
 *     summary: 获取我的所有日记
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authMiddleware, getMyJournals);

/**
 * @swagger
 * /api/journals:
 *   post:
 *     summary: 创建日记
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authMiddleware, createJournal);

/**
 * @swagger
 * /api/journals/user/{userId}:
 *   get:
 *     summary: 获取指定用户的日记（按可见性过滤）
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 */
router.get('/user/:userId', authMiddleware, getUserJournals);

/**
 * @swagger
 * /api/journals/{id}:
 *   get:
 *     summary: 获取单篇日记
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', authMiddleware, getJournalById);

/**
 * @swagger
 * /api/journals/{id}:
 *   put:
 *     summary: 更新日记
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', authMiddleware, updateJournal);

/**
 * @swagger
 * /api/journals/{id}:
 *   delete:
 *     summary: 删除日记
 *     tags: [Journals]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', authMiddleware, deleteJournal);

module.exports = router;
