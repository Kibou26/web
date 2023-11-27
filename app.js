const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const signinRoute = require('./routes/signin'); // Đường dẫn thực tế có thể khác

const app = express();

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
                return done(err);
            }

            if (results.length === 0) {
                return done(null, false, { message: 'Invalid email or password' });
            }

            const user = results[0];

            bcrypt.compare(password, user.password, (bcryptErr, isMatch) => {
                if (bcryptErr) {
                    return done(bcryptErr);
                }

                if (isMatch) {
                    return done(null, user);
                } else {
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

// Your routes and other configurations go here

app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});