const mysql = require('mysql2/promise');

// Create the connection pool. The pool manages connections, which is more
// efficient than creating a new one for every query.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('MySQL Connection Pool created.');

// Export the pool so it can be used in your models (e.g., user.model.js)
module.exports = pool;