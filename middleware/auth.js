// middleware/auth.js

function isLoggedIn(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    // Redirect guests to login
    return res.redirect('/users/auth?mode=login');
  }
}

module.exports = { isLoggedIn };
