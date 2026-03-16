const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/database');

const app = express();

const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';
const NODE_ENV = process.env.NODE_ENV || 'development';


app.use(helmet());


app.use(cors({
    origin: NODE_ENV === 'development' ? '*' : 'https://yourdomain.com',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '10mb' }));


app.use(express.urlencoded({ extended: true }));


app.use(morgan('dev'));


app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: NODE_ENV,
        database: 'connected'
    });
});


app.get(API_PREFIX, (req, res) => {
    res.json({
        name: 'Hostel Services API',
        version: '1.0.0',
        description: 'API for finding and booking hostels',
        endpoints: {
            health: '/health',
            hostels: `${API_PREFIX}/hostels`,
            auth: `${API_PREFIX}/auth`,
            users: `${API_PREFIX}/users`,
            bookings: `${API_PREFIX}/bookings`
        },
        documentation: 'https://github.com/xxxxx/xxxxx'
    });
});


app.get(`${API_PREFIX}/test-db`, async (req, res) => {
    try {
        const cities = await db.query('SELECT * FROM cities LIMIT 5');
        
        res.json({
            success: true,
            message: 'Database connection working',
            data: cities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Database query failed',
            details: error.message
        });
    }
});

// Import routes
const hostelRoutes = require('./routes/hostelroutes');
const areaRoutes = require('./routes/arearoutes');
const cityRoutes = require('./routes/cityroutes');
const amenityRoutes = require('./routes/amenityroutes');
const searchRoutes = require('./routes/searchroutes');
const authRoutes = require('./routes/authroutes');
const userRoutes = require('./routes/userroutes');
const adminRoutes = require('./routes/adminroutes');
const ownerRoutes = require('./routes/ownerroutes');
const bookingRoutes = require('./routes/bookingroutes');
const reviewRoutes = require('./routes/reviewroutes');

// API Routes
app.use(`${API_PREFIX}/hostels`, hostelRoutes);
app.use(`${API_PREFIX}/areas`, areaRoutes);
app.use(`${API_PREFIX}/cities`, cityRoutes);
app.use(`${API_PREFIX}/amenities`, amenityRoutes);
app.use(`${API_PREFIX}/search`, searchRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);
app.use(`${API_PREFIX}/owner`, ownerRoutes);
app.use(`${API_PREFIX}/bookings`, bookingRoutes);
app.use(`${API_PREFIX}/reviews`, reviewRoutes);


app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});


app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    
    const message = NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(err.status || 500).json({
        success: false,
        error: message
    });
});


app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log(` Server started successfully!`);
    console.log('='.repeat(50));
    console.log(` Environment: ${NODE_ENV}`);
    console.log(` Port: ${PORT}`);
    console.log(` API Base: http://localhost:${PORT}${API_PREFIX}`);
    console.log(` Health Check: http://localhost:${PORT}/health`);
    console.log('='.repeat(50) + '\n');
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing server...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Closing server...');
    process.exit(0);
});