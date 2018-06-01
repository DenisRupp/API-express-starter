const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const statusMonitor = require('express-status-monitor')();

const router = express.Router();

/**
 * GET v1/status
 */
router.use(statusMonitor);

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));
router.use('/docs-examples', express.static('docs-examples'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
