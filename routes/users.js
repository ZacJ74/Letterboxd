const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// --- GET Auth Form (Login/Signup) ---
router.get('/auth', (req, res) => {
    res.render('auth-form', { message: null, title: 'Login or Sign Up' });
});

// --- POST Signup ---
router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('auth-form', { 
                message: 'Username already taken.', 
                title: 'Login or Sign Up' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        // Set session + redirect
        req.session.userId = newUser._id;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Session save failed');
            }
            res.redirect('/movies');
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('An error occurred during signup.');
    }
});

// --- POST Login ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.render('auth-form', { 
                message: 'Invalid username or password.', 
                title: 'Login or Sign Up' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('auth-form', { 
                message: 'Invalid username or password.', 
                title: 'Login or Sign Up' 
            });
        }

        // Set session + redirect
        req.session.userId = user._id;
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).send('Session save failed');
            }
            res.redirect('/movies');
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('An error occurred during login.');
    }
});

// --- POST Logout (updated to match your forms) ---
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/users/auth');
    });
});

module.exports = router;
