const mysql = require('mysql2/promise');

require('dotenv').config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    waitForConnections: true,   
    connectionLimit: 10,        
    queueLimit: 0,              
    
    enableKeepAlive: true,      
    keepAliveInitialDelay: 10000, 
    
    connectTimeout: 10000,        
});


(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('   Database connected successfully');
        console.log(`   Connected as: ${connection.config.user}@${connection.config.host}`);
        console.log(`   Database: ${connection.config.database}`);
        
        connection.release();
    } catch (error) {
        console.error('   Database connection failed:');
        console.error(`   Error: ${error.message}`);
        console.error('   Please check:');
        console.error('   - MySQL server is running');
        console.error('   - Database credentials are correct');
        console.error('   - Database name exists');
        
        process.exit(1);
    }
})();

/**
 * Helper function for simple queries
 * @param {string} sql - SQL query with ? placeholders
 * @param {Array} params - Values for placeholders
 * @returns {Promise<Array>} Query results
 * 
 */
const query = async (sql, params = []) => {
    try {
        const stringParams = params.map(p => {
            if (typeof p === 'number') {
                return String(p);
            }
            if (Array.isArray(p)) {
                return p.map(sp => typeof sp === 'number' ? String(sp) : sp);
            }
            return p;
        });
        
        console.log('Original params:', params);
        console.log('String params:', stringParams);
        
        const [rows] = await pool.execute(sql, stringParams);
        return rows;
    } catch (error) {
        console.error('Query error:', error);
        console.error('SQL:', sql);
        console.error('Original params:', params);
        console.error('String params:', stringParams);
        throw error;
    }
};

/**
 * Get a connection for transactions
 * @returns {Promise<Connection>} Database connection
 * 
 */
const getConnection = async () => {
    return await pool.getConnection();
};

module.exports = {
    pool,
    query,
    getConnection
};