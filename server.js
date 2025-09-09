// --- Module and Package Imports ---
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Load environment variables from .env file

// --- Initialize the Express App ---
const app = express();



// --- Database Connection ---
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-tracker-db';

mongoose.connect(dbUri)
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- View Engine Setup ---



// Sets EJS as the template engine and specifies the views directory
app.set('view engine', 'ejs');
app.set('views', './views');



// --- Middleware ---
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies for form data
app.use(express.static('public')); // Serves static files from the 'public' directory




// --- Session Middleware ---
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fine-then-keep-your-secrets', // Secret key for signing the session ID cookie
        resave: false, // Prevents session from being re-saved if it wasn't modified
        saveUninitialized: true, // Saves uninitialized sessions
        store: MongoStore.create({ mongoUrl: dbUri }), // Stores session data in MongoDB
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // Cookie expiration set to 1 day
        }
    })
);

// --- Import and Use Routers ---


// Import the users router and mount it to the '/users' path.
const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

// --- Root Route ---

app.get('/', (req, res) => {
    res.send('<h1>Server is running!</h1>');
});





// --- Server Listening ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on ${PORT}`);
});
