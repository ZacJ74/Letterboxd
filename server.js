

// --- Module and Package Imports ---
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const methodOverride = require('method-override');
const dotenv = require('dotenv');

// --- Load Environment Variables ---
dotenv.config();

// --- Express App Initialization ---
const app = express();

// --- Database Connection ---
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Letterboxd.'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // ✅ only save sessions when something changes
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
        secure: process.env.NODE_ENV === 'production', // ✅ only secure in prod
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }
}));

// --- View Engine Configuration ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Route Imports ---
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const moviesController = require('./controllers/movies');

// --- Route Handling ---
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

// --- Dashboard (Root Route) ---
app.get('/', moviesController.getDashboard);

// --- 404 Not Found Handling ---
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});






// // --- Module and Package Imports ---
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const path = require('path');
// const methodOverride = require('method-override');
// const dotenv = require('dotenv');

// // --- Load Environment Variables ---
// dotenv.config();

// // --- Express App Initialization ---
// const app = express();

// // --- Database Connection ---
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB Letterboxd.'))
//     .catch(err => console.error('Could not connect to MongoDB:', err));

// // --- Middleware Setup ---
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//     cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24 * 7
// }

// }));

// // --- View Engine Configuration ---
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // --- Route Imports ---
// const userRoutes = require('./routes/users');
// const movieRoutes = require('./routes/movies');
// const moviesController = require('./controllers/movies'); // ✅ import controller

// // --- Route Handling ---
// app.use('/users', userRoutes);
// app.use('/movies', movieRoutes);

// // --- Dashboard (Root Route) ---
// app.get('/', moviesController.getDashboard); // ✅ dashboard is now "/"

// // --- 404 Not Found Handling ---
// app.use((req, res) => {
//     res.status(404).render('404');
// });

// // --- Start the Server ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });





// // --- Module and Package Imports ---
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const path = require('path');
// const methodOverride = require('method-override');
// const dotenv = require('dotenv');

// // --- Load Environment Variables ---
// dotenv.config();

// // --- Express App Initialization ---
// const app = express();

// // --- Database Connection ---
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB Letterboxd.'))
//     .catch(err => console.error('Could not connect to MongoDB:', err));

// // --- Middleware Setup ---
// app.use(express.json()); // Parses incoming JSON requests
// app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
// app.use(methodOverride('_method')); // Enables PUT and DELETE methods
// app.use(express.static(path.join(__dirname, 'public'))); // Serves static files from the 'public' directory
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//     cookie: {
//         secure: 'auto',
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//     }
// }));

// // --- View Engine Configuration ---
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // --- Route Imports ---
// const userRoutes = require('./routes/users');
// const movieRoutes = require('./routes/movies');
// const moviesController = require('./controllers/movies'); // <-- import controller

// // --- Route Handling ---
// // User routes
// app.use('/users', userRoutes);

// // Movie CRUD routes
// app.use('/movies', movieRoutes);

// // Root dashboard route
// app.get('/', moviesController.getDashboard);

// // --- 404 Not Found Handling ---
// app.use((req, res) => {
//     res.status(404).render('404');
// });

// // --- Start the Server ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });








// // --- Module and Package Imports ---
// const express = require('express');
// const mongoose = require('mongoose');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const path = require('path');
// const methodOverride = require('method-override');
// const dotenv = require('dotenv');

// // --- Load Environment Variables ---
// dotenv.config();

// // --- Express App Initialization ---
// const app = express();

// // --- Database Connection ---
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('Connected to MongoDB Letterboxd.'))
//     .catch(err => console.error('Could not connect to MongoDB:', err));

// // --- Middleware Setup ---
// app.use(express.json()); // Parses incoming JSON requests
// app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
// app.use(methodOverride('_method')); // Enables PUT and DELETE methods
// app.use(express.static(path.join(__dirname, 'public'))); // Serves static files from the 'public' directory
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
//     cookie: {
//         secure: 'auto',
//         httpOnly: true,
//         maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
//     }
// }));

// // --- View Engine Configuration ---
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// // --- Route Imports ---
// const userRoutes = require('./routes/users');
// const movieRoutes = require('./routes/movies');

// // --- Route Handling ---
// app.use('/users', userRoutes);
// app.use('/movies', movieRoutes);

// // --- Home Route ---
// app.get('/', (req, res) => {
//     res.redirect('/movies');
// });

// // --- 404 Not Found Handling ---
// app.use((req, res) => {
//     res.status(404).render('404');
// });

// // --- Start the Server ---
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on ${PORT}`);
// });






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
// // Set strictQuery to false for Mongoose 7+
// mongoose.set('strictQuery', false);

// // Connect to MongoDB using the event-driven approach
// mongoose.connect(process.env.MONGODB_URI);

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
//         store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }), // Stores session data in MongoDB
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
// // The server only starts listening when the database connection is fully open
// mongoose.connection.once('open', () => {
//     console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
//     app.listen(PORT, () => {
//         console.log(`Server is running on ${PORT}`);
//     });
// });







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


