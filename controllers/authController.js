const express = require('express');
const router = express.Router();

router.get('/signin', (req, res) => {
    res.render('signin', { error: req.flash('error') });
});

// Other routes and logic

module.exports = router;