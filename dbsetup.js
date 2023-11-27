const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Database connection pool configuration
const pool = mysql.createPool({
    host: 'localhost',
    user: 'wpr',
    password: 'fit2023',
    database: 'wpr2023',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool;

// Create tables and insert data
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error getting connection from pool:', err);
        return;
    }

    console.log('Connected to MySQL');

    // Drop existing tables (if any)
    const dropTablesQuery = `
      DROP TABLE IF EXISTS emails, users;
  `;

    connection.query(dropTablesQuery, (dropTablesErr, dropTablesResults) => {
        if (dropTablesErr) {
            console.error('Error dropping tables:', dropTablesErr);
            connection.release();
            return;
        }

        console.log('Tables dropped successfully');

        // Create tables
        const createTablesQueries = [
            `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
      `,
            `
        CREATE TABLE IF NOT EXISTS emails (
            id INT AUTO_INCREMENT PRIMARY KEY,
            sender_id INT NOT NULL,
            receiver_id INT NOT NULL,
            subject VARCHAR(255),
            body TEXT,
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (receiver_id) REFERENCES users(id)
        );
      `,
        ];

        // Execute each create table query
        createTablesQueries.forEach((createTableQuery, index) => {
            connection.query(createTableQuery, (createTablesErr, createTablesResults) => {
                if (createTablesErr) {
                    console.error(`Error creating table ${index + 1}:`, createTablesErr);
                } else {
                    console.log(`Table ${index + 1} created successfully`);
                }
            });
        });

        // Release the connection back to the pool
        connection.release();
    });
});