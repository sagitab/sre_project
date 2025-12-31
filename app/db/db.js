const mysql = require('mysql2/promise');

// Connection configuration for TiDB
const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1', // Localhost
    port: 4000,        // Default TiDB port [cite: 13]
    user: 'root',
    password: '',      // Default TiDB password is empty
    database: 'app_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;