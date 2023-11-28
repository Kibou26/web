const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const bodyParser = require('body-parser'); // Add this line
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for file uploads
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const signinRoute = require('./routes/signin'); // Update the path as needed
const authRoutes = require('./routes/auth');
const pool = require('./dbsetup'); // Replace with the correct path

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // Use bodyParser middleware

// Configure session
app.use(session({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Set up Passport Local Strategy
passport.use(new LocalStrategy(
    (email, password, done) => {
        pool.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return done(err);
            }

            if (results.length === 0) {
                console.log('User not found:', email);
                return done(null, false, { message: 'Invalid email or password' });
            }

            const user = results[0];
            console.log('Retrieved user from the database:', user);

            bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
                if (bcryptErr) {
                    console.error('Password comparison error:', bcryptErr);
                    return done(bcryptErr);
                }

                if (isMatch) {
                    console.log('User authenticated:', user.email);
                    return done(null, user);
                } else {
                    console.log('Incorrect password for user:', user.email);
                    return done(null, false, { message: 'Invalid email or password' });
                }
            });
        });
    }
));


// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    pool.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
        done(err, results[0]);
    });
});

app.set('view engine', 'ejs');

// Routes
app.use('/auth', authRoutes);
app.use('/', signinRoute);

// Your routes and other configurations go here

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});