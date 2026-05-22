// db.js - MySQL Database Connection
// This file creates and exports a MySQL connection pool

const mysql = require('mysql2');

// Create a connection pool (better than single connection for multiple requests)
const pool = mysql.createPool({
    host: 'localhost',        // MySQL server host
    user: 'root',             // Your MySQL username
    password: 'root828',             // Your MySQL password (change this)
    database: 'car_manufacturing_system',
    waitForConnections: true,
    connectionLimit: 10,      // Maximum 10 simultaneous connections
    queueLimit: 0
});

// Convert pool to use Promises (so we can use async/await)
const db = pool.promise();

// Test connection on startup
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('Make sure MySQL is running and credentials are correct in db.js');
    } else {
        console.log('✅ Connected to MySQL database: car_manufacturing_system');
        connection.release(); // Release the connection back to pool
    }
});

module.exports = db;
