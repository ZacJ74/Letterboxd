

// --- Module and Package Imports ---
const User = require('../models/User.js'); // Import the User model
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison

// --- Controller Functions ---

// Renders the login/signup form page.
const authForm = (req, res) => {
    // If a user is already authenticated, redirect them to the home page or dashboard.
    if (req.session.isLoggedIn) {
        return res.redirect('/');
    }
    // Render the auth-form view, which we will create next.
    res.render('auth-form', {
        title: 'Login / Sign Up' // Pass a title to the view.
    });
};

// Handles user registration (signup).
const signup = async (req, res) => {
    const { email, password } = req.body; // Extract email and password from the form submission.

    try {
        // Check if a user with the provided email already exists.
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // If the user exists, redirect back to the signup form with an error message.
            
            return res.redirect('/signup');
        }

        // Create a new user instance and save it to the database.
        const newUser = new User({ email, password });
        await newUser.save();

        // After successful signup, log the user in by creating a session.
        req.session.isLoggedIn = true;
        req.session.user = newUser._id; // Store the user's ID in the session.
        req.session.save(err => {
            if (err) console.error(err);
            res.redirect('/'); // Redirect to the home page.
        });

    } catch (error) {
        console.error(error);
        res.redirect('/signup'); // Redirect on error.
    }
};

// Handles user login.
const login = async (req, res) => {
    const { email, password } = req.body; // Extract form data.

    try {
        // Find the user by their email.
        const user = await User.findOne({ email });
        if (!user) {
            // If no user is found, redirect back to the login form.
            return res.redirect('/login');
        }

        // Compare the submitted password with the hashed password in the database.
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            // If passwords don't match, redirect back to login.
            return res.redirect('/login');
        }

        // If credentials are correct, create a new session.
        req.session.isLoggedIn = true;
        req.session.user = user._id;
        req.session.save(err => {
            if (err) console.error(err);
            res.redirect('/');
        });

    } catch (error) {
        console.error(error);
        res.redirect('/login');
    }
};

// Handles user logout.
const logout = (req, res) => {
    // Destroy the user's session to log them out.
    req.session.destroy(err => {
        if (err) console.error(err);
        res.redirect('/'); // Redirect to the home page after logout.
    });
};

// --- Export Controller Functions ---
module.exports = {
    authForm,
    signup,
    login,
    logout
};
