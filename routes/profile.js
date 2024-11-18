const express = require('express');
const User = require('../models/user');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) return res.status(404).send('User not found.');
        if (user.locked) return res.status(403).send('Account is locked.');

        res.send(user);
    } catch (err) {
        res.status(500).send('Error fetching profile.');
    }
});

module.exports = router;
