const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Register section for name, email and password
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).send('Missing fields.');

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).send('Email is already in use.');

        const user = new User({ name, email, password });
        await user.save();
        res.status(201).send('User registered successfully.');
    } catch (err) {
        res.status(500).send('Error creating user.');
    }
});

// Login section
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) return res.status(404).send('User not found.');
        
        if (user.locked && user.lockUntil > new Date()) 
            return res.status(403).send('Account locked. Try later.');

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            user.loginAttempts += 1;
            if (user.loginAttempts >= 3) {
                user.locked = true;
                //after 30 min, it locks the user
                user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); 
            }
            await user.save();
            return res.status(401).send('Invalid credentials.');
        }

        user.loginAttempts = 0;
        user.locked = false;
        await user.save();

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.send({ token });
    } catch (err) {
        res.status(500).send('Error logging in.');
    }
});

module.exports = router;
