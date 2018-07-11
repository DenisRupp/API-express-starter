/**
 * Get logged in user info
 * @public
 */
exports.index = (req, res) => res.json(req.user.transform());
