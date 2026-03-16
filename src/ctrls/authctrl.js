const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'stephenHawking67diddiled9littlpeople12';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

const register = async (req, res) => {
    try {
        const { 
            first_name, 
            last_name, 
            email, 
            phone, 
            password, 
            user_type,
            institution_id 
        } = req.body;

        console.log('Registration attempt for:', email);

        const existingUser = await db.query(
            'SELECT user_id FROM users WHERE email = ? OR phone = ?',
            [email, phone]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'User with this email or phone already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const result = await db.query(
            `INSERT INTO users 
            (first_name, last_name, email, phone, password_hash, user_type, institution_id, verified) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                first_name, 
                last_name, 
                email, 
                phone, 
                hashedPassword, 
                user_type || 'student',
                institution_id || null,
                false  
            ]
        );

        const [newUser] = await db.query(
            `SELECT user_id, first_name, last_name, email, phone, user_type, verified, created_at 
             FROM users WHERE user_id = ?`,
            [result.insertId]
        );

        const token = jwt.sign(
            { 
                id: newUser.user_id,
                email: newUser.email,
                role: newUser.user_type
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: newUser,
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed',
            details: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('Login attempt for:', email);

        const users = await db.query(
            `SELECT user_id, first_name, last_name, email, phone, password_hash, user_type, verified 
             FROM users WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        const user = users[0];

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        await db.query(
            'UPDATE users SET last_login = NOW() WHERE user_id = ?',
            [user.user_id]
        );

        delete user.password_hash;

        const token = jwt.sign(
            { 
                id: user.user_id,
                email: user.email,
                role: user.user_type
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed',
            details: error.message
        });
    }
};

const verifyToken = async (req, res) => {
    try {
        const userId = req.user.id;

        const users = await db.query(
            `SELECT user_id, first_name, last_name, email, phone, user_type, verified, created_at, last_login 
             FROM users WHERE user_id = ?`,
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: users[0]
        });

    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            success: false,
            error: 'Verification failed'
        });
    }
};

module.exports = {
    register,
    login,
    verifyToken
};