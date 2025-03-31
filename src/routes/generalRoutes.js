const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/welcome:
 *   get:
 *     summary: Get welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Welcome message
 *                   example: Welcome to Todo List API
 *                 version:
 *                   type: string
 *                   description: API version
 *                   example: 1.0.0
 *                 status:
 *                   type: string
 *                   description: API status
 *                   example: running
 */
router.get('/welcome', (req, res) => {
  res.json({
    message: 'Welcome to Todo List API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health status
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Health check response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: Health status
 *                   example: healthy
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime()
  });
});

module.exports = router; 