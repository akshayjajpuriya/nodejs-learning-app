const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Go up one level to find models/User

const router = express.Router();

// THE SIGNUP DOOR: POST /api/signup
router.post('/signup', async (req, res) => {
    try {
        // 1. Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        // 2. Hash the password (the "shredder")
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // 3. Create a new user with our model
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword
        });

        // 4. Save the user to the database
        const savedUser = await newUser.save();
        res.status(201).json({ message: "User created successfully!" });

    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error });
    }
});
// THE LOGIN DOOR: POST /api/login
router.post('/login', async (req, res) => {
    try {
        // 1. Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // 3. Create the JWT "wristband"
        const payload = {
            user: {
                id: user.id 
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Use the secret from .env
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ token }); // Send the token to the user
            }
        );

    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;