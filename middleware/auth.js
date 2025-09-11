// Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (req.session.userId) return next();
  res.redirect('/users/auth?mode=login');
}

module.exports = { isLoggedIn };
