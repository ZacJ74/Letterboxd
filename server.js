

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
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ Could not connect to MongoDB:', err));



// --- Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { secure: 'auto', httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }
}));



// --- Make user available in all views ---
app.use((req, res, next) => {
  res.locals.user = req.session.userId || null;
  next();
});


// --- View Engine Configuration ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// --- Route Imports ---
const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');
const moviesController = require('./controllers/movies');
const { isLoggedIn } = require('./middleware/auth');



// --- Route Handling ---
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);



// --- Dashboard (Root Route) ---
app.get('/', isLoggedIn, moviesController.getDashboard);



// --- 404 Not Found Handling ---
app.use((req, res) => {
  res.status(404).render('404');
});



// --- Start the Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
