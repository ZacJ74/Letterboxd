

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
require('dotenv').config(); // Load environment variables from .env file

// --- Router Imports ---
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const PORT = process.env.PORT || 3000;

// --- Initialize the Express App ---
const app = express();


// --- Database Connection ---
// Set strictQuery to false for Mongoose 7+
mongoose.set('strictQuery', false);

// Connect to MongoDB using the event-driven approach
mongoose.connect(process.env.MONGODB_URI);

// --- View Engine Setup ---
// Sets EJS as the template engine and specifies the views directory
app.set('view engine', 'ejs');
app.set('views', './views');

// --- Middleware ---
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies for form data
app.use(express.static('public')); // Serves static files from the 'public' directory
app.use(methodOverride('_method')); // Allows PUT and DELETE from forms

// --- Session Middleware ---
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'fine-then-keep-your-secrets', // Secret key for signing the session ID cookie
        resave: false, // Prevents session from being re-saved if it wasn't modified
        saveUninitialized: true, // Saves uninitialized sessions
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Stores session data in MongoDB
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 // Cookie expiration set to 1 day
        }
    })
);

// --- Route Middleware ---
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);



// --- Root Route ---
// A simple route to test if the server is working
app.get('/', (req, res) => {
    res.redirect('/users/auth');
});


// --- Error Handling ---
// 404 handler for routes that don't exist
app.use((req, res, next) => {
    res.status(404).render('404', { url: req.originalUrl });
});

// General error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// --- Server Listening ---
// The server only starts listening when the database connection is fully open
mongoose.connection.once('open', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });
});







// -------------------------- Grave yard ------------------------------



// // --- Module and Package Imports ---
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const methodOverride = require('method-override');
// require('dotenv').config(); // Load environment variables from .env file

// // --- Router Imports ---
// const usersRouter = require('./routes/users');
// const moviesRouter = require('./routes/movies');

// const PORT = process.env.PORT || 3000;

// // --- Initialize the Express App ---
// const app = express();


// // --- Database Connection ---
// const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-tracker-db';

// mongoose.connect(dbUri);

// mongoose.connection.on('connected', () => {
//     console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
// });
// mongoose.connection.on('error', (err) => {
//     console.error('MongoDB connection error:', err);
// });


// // --- View Engine Setup ---
// // Sets EJS as the template engine and specifies the views directory


// app.set('view engine', 'ejs');
// app.set('views', './views');

// // --- Middleware ---

// app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies for form data
// app.use(express.static('public')); // Serves static files from the 'public' directory
// app.use(methodOverride('_method')); // Allows PUT and DELETE from forms



// // --- Session Middleware ---
// app.use(
//     session({
//         secret: process.env.SESSION_SECRET || 'fine-then-keep-your-secrets', // Secret key for signing the session ID cookie
//         resave: false, // Prevents session from being re-saved if it wasn't modified
//         saveUninitialized: true, // Saves uninitialized sessions
//         store: MongoStore.create({ mongoUrl: dbUri }), // Stores session data in MongoDB
//         cookie: {
//             maxAge: 1000 * 60 * 60 * 24 // Cookie expiration set to 1 day
//         }
//     })
// );



// // --- Route Middleware ---
// app.use('/users', usersRouter);
// app.use('/movies', moviesRouter);






// // --- Root Route ---
// // A simple route to test if the server is working
// app.get('/', (req, res) => {
//     res.redirect('/users/auth');
// });


// // --- Error Handling ---
// // 404 handler for routes that don't exist
// app.use((req, res, next) => {
//     res.status(404).render('404', { url: req.originalUrl });
// });


// // General error handler
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });


// // --- Server Listening ---
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });


