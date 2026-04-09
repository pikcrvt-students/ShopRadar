const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

const User = require('./models/user.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err));

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ ok: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ ok: false, message: 'Invalid token' });
    }
}

app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password, repeatPassword } = req.body;

        if (!username || !email || !password || !repeatPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Please fill in all fields'
            });
        }

        if (password !== repeatPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Passwords do not match'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                ok: false,
                message: 'Password must be at least 6 characters'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({
                ok: false,
                message: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            ok: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Please fill in all fields'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                username: user.username,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            ok: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});

app.get('/api/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'User not found'
            });
        }

        res.json({
            ok: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});

const path = require("path");

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "code", "home.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.use("/code", express.static(path.join(__dirname, "code")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/icons", express.static(path.join(__dirname, "icons")));
app.use("/fonts", express.static(path.join(__dirname, "fonts")));