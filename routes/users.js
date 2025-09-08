// --- Module and Package Imports ---
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users'); // Import the user controller

// --- User Authentication Routes ---

// GET route for rendering the login/signup page.
// This handles requests to the '/auth' URL and uses the authForm controller function.
router.get('/auth', userController.authForm);

// POST route for user signup.
// This receives form data from the signup form and uses the signup controller function.
router.post('/signup', userController.signup);

// POST route for user login.
// This receives form data from the login form and uses the login controller function.
router.post('/login', userController.login);

// POST route for user logout.
// This handles logging out a user by destroying their session.
router.post('/logout', userController.logout);

// --- Export the Router ---
module.exports = router;
