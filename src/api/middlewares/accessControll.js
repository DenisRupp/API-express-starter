module.exports = role => (req, res, next) => {
  //  Here your custom access control logic
  if (req.user && req.user.role === role) return next();
  return next({ message: 'Access denied', status: 401 });
};
