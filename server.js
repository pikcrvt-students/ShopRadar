// Importē Express servera izveidei
const express = require('express');

// Importē Mongoose darbam ar MongoDB
const mongoose = require('mongoose');

// Importē bcrypt paroles šifrēšanai
const bcrypt = require('bcryptjs');

// Importē JWT tokenu izveidei
const jwt = require('jsonwebtoken');

// Importē path moduli failu ceļiem
const path = require('path');

// Ielādē .env faila datus
require('dotenv').config();

// Importē lietotāja modeli
const User = require('./models/user.js');

// Izveido servera lietotni
const app = express();

// Atļauj apstrādāt JSON datus
app.use(express.json());

// Atļauj apstrādāt formas datus
app.use(express.urlencoded({ extended: true }));

// Padara pieejamus statiskos failus no "code" mapes
app.use(express.static(path.join(__dirname, 'code')));

// Padara pieejamas resursu mapes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/icons', express.static(path.join(__dirname, 'icons')));
app.use('/fonts', express.static(path.join(__dirname, 'fonts')));

// Savienojas ar MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err));

// Pārbauda lietotāja tokenu
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            message: 'No token provided'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({
            ok: false,
            message: 'Invalid token'
        });
    }
}

// Lietotāja reģistrācija
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
        console.error('Register error:', error);
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});

// Lietotāja pieteikšanās
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
        console.error('Login error:', error);
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});

// Atgriež pašreizējo lietotāju
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
        console.error('Me error:', error);
        res.status(500).json({
            ok: false,
            message: 'Server error'
        });
    }
});

// Izrakstīšanās maršruts
app.post('/api/logout', (req, res) => {
    res.json({
        ok: true,
        message: 'Logout successful'
    });
});

// Atver sākumlapu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'code', 'home.html'));
});

// Palaiž serveri
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});