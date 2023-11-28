const express = require('express');
const router = express.Router();
const passport = require('passport');

// Display the sign-in form
router.get('/signin', (req, res) => {
    // Check if the user is already authenticated (you need to implement this logic)
    if (req.isAuthenticated()) {
        return res.redirect('/inbox');
    }
    // Render the sign-in form
    res.render('signin', { error: req.flash('error') });
});

// Process the sign-in form
router.post('/signin', passport.authenticate('local', {
    successRedirect: '/inbox',
    failureRedirect: '/signin',
    failureFlash: true,
}));
router.post('/signup', async(req, res) => {
    const { full_name, email, password, confirm_password } = req.body;

    // Validate form data
    if (!full_name || !email || !password || !confirm_password) {
        req.flash('error', 'All fields are required');
        return res.redirect('/auth/signup');
    }

    if (password !== confirm_password) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/auth/signup');
    }

    try {
        // Check if the email is already used
        const existingUser = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            // Email is already used
            req.flash('error', 'Email is already registered');
            return res.redirect('/auth/signup');
        }

        // Proceed to hash the password and create a new user
        // TODO: Add logic for password hashing and user creation here

        // Redirect to sign-in page after successful sign-up
        res.redirect('/auth/signin');
    } catch (error) {
        console.error('Error checking existing user:', error);
        req.flash('error', 'An error occurred');
        res.redirect('/auth/signup');
    }
});

// Display the inbox
router.get('/inbox', isAuthenticated, (req, res) => {
    // TODO: Fetch and pass the user's emails to the view
    const emails = []; // Replace this with the actual emails from the database

    res.render('inbox', { user: req.user, emails });
});

// TODO: Add the logic for the delete feature

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin');
}
// Display the compose page
router.get('/compose', isAuthenticated, (req, res) => {
    // TODO: Fetch and pass the list of users to the view
    const users = []; // Replace this with the actual list of users from the database

    res.render('compose', { user: req.user, users, error: req.flash('error') });
});

// Process the compose form
router.post('/compose', isAuthenticated, (req, res) => {
    const { recipient, subject, body } = req.body;
    const attachment = req.file; // Assuming you use multer for file uploads

    // Validate form data
    if (!recipient || !subject || !body) {
        req.flash('error', 'All fields are required');
        return res.redirect('/compose');
    }

    // TODO: Add logic to send the email (save it to the database)
    // TODO: If there's an attachment, save it to the server and store the file path in the database

    res.redirect('/inbox');
});
// Display the outbox
router.get('/outbox', isAuthenticated, (req, res) => {
    // TODO: Fetch and pass the user's sent emails to the view
    const emails = []; // Replace this with the actual sent emails from the database

    res.render('outbox', { user: req.user, emails });
});

// TODO: Add the logic for the delete feature
// Display the email detail
router.get('/email/:id', isAuthenticated, (req, res) => {
    const emailId = req.params.id;

    // TODO: Fetch and pass the email details to the view
    const email = {}; // Replace this with the actual email details from the database

    res.render('email_detail', { user: req.user, email });
});

module.exports = router;