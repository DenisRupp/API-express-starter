const expressJwt = require('express-jwt');
const { User } = require('../models');
const router = require('express').Router();

router.use(
  expressJwt({ secret: process.env.SECRET_STRING }),
  async (req, res, next) => {
    try {
      const invalidToken = { message: 'Invalid token', status: 401 };
      const userBlocked = { message: 'User is blocked', status: 401 };
      const user = await User.findById(req.user.id);

      if (!user) throw invalidToken;
      if (!user.isActive) throw userBlocked;

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
