const passport = require('passport');
const pool = require('../dbsetup');

// Display the sign-in form
exports.showSignInForm = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/inbox');
    }
    res.render('signin', { message: req.flash('error') });
};

// Process the sign-in form
exports.signIn = passport.authenticate('local', {
    successRedirect: '/inbox',
    failureRedirect: '/signin',
    failureFlash: true
});