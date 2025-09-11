const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET auth page
router.get('/auth', (req, res) => {
  const mode = req.query.mode === 'signup' ? 'signup' : 'login';
  const title = mode === 'signup' ? 'Sign Up' : 'Login';
  res.render('auth-form', { mode, title, message: null });
});

// POST signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.render('auth-form', { mode: 'signup', title: 'Sign Up', message: 'Username taken' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashed });
    await newUser.save();

    req.session.userId = newUser._id;
    req.session.save(() => res.redirect('/'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during signup');
  }
});

// POST login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.render('auth-form', { mode: 'login', title: 'Login', message: 'Invalid username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.render('auth-form', { mode: 'login', title: 'Login', message: 'Invalid username or password' });

    req.session.userId = user._id;
    req.session.save(() => res.redirect('/'));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error during login');
  }
});

// POST logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/users/auth?mode=login'));
});

module.exports = router;
