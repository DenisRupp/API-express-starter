const express = require('express');
const statusMonitor = require('express-status-monitor')();
const passport = require('passport');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const profileRoutes = require('./profile.route');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();
const jwtAuth = passport.authenticate('jwt', { session: false });

/**
 * GET v1/status
 */
router.use(statusMonitor);

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));
router.use('/docs-examples', express.static('docs-examples'));

router.use('/users', jwtAuth, authenticate('admin'), userRoutes);
router.use('/profile', jwtAuth, authenticate('user'), profileRoutes);
router.use('/auth', authRoutes);

module.exports = router;
