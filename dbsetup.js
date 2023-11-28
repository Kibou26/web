const mysql = require('mysql2');

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

// Drop existing tables (if any)
const dropTablesQuery = `
    DROP TABLE IF EXISTS emails, users;
`;

pool.query(dropTablesQuery, (dropTablesErr, dropTablesResults) => {
    if (dropTablesErr) {
        console.error('Error dropping tables:', dropTablesErr);
        pool.end(); // End the database connection pool in case of an error
        return;
    }

    console.log('Tables dropped successfully');

    // Create users table
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `;

    pool.query(createUsersTableQuery, (createUsersErr, createUsersResults) => {
        if (createUsersErr) {
            console.error('Error creating users table:', createUsersErr);
            pool.end();
            return;
        }

        console.log('Users table created successfully');

        // Insert user data
        const insertUsersQuery = `
            INSERT INTO users (full_name, email, password) VALUES
            ('User 1', 'a@a.com', 'pass123'),
            ('User 2', 'b@b.com', 'hashed_password_2'),
            ('User 3', 'c@c.com', 'hashed_password_3');
        `;

        pool.query(insertUsersQuery, (insertUsersErr, insertUsersResults) => {
            if (insertUsersErr) {
                console.error('Error inserting user data:', insertUsersErr);
                pool.end();
                return;
            }

            console.log('User data inserted successfully');

            // Create emails table
            const createEmailsTableQuery = `
                CREATE TABLE IF NOT EXISTS emails (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    sender_id INT NOT NULL,
                    receiver_id INT NOT NULL,
                    subject VARCHAR(255),
                    body TEXT,
                    file_path VARCHAR(255),
                    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (sender_id) REFERENCES users(id),
                    FOREIGN KEY (receiver_id) REFERENCES users(id)
                );
            `;

            pool.query(createEmailsTableQuery, (createEmailsErr, createEmailsResults) => {
                if (createEmailsErr) {
                    console.error('Error creating emails table:', createEmailsErr);
                    pool.end();
                    return;
                }

                console.log('Emails table created successfully');

                // Insert email data
                const insertEmailsQuery = `
                    INSERT INTO emails (sender_id, receiver_id, subject, body, file_path) VALUES
                    (1, 2, 'Hello User 2', 'How are you?', NULL),
                    (2, 1, 'Hi User 1', 'I am fine, thank you!', NULL),
                    (1, 3, 'Meeting Tomorrow', 'Let''s meet tomorrow at 2 PM.', NULL),
                    (3, 1, 'Re: Meeting Tomorrow', 'Sure! I''ll be there.', NULL),
                    (2, 3, 'Project Update', 'Attached is the latest project update.', '/path/to/file.txt'),
                    (3, 2, 'Re: Project Update', 'Thanks! I will review it soon.', NULL);
                `;

                pool.query(insertEmailsQuery, (insertEmailsErr, insertEmailsResults) => {
                    if (insertEmailsErr) {
                        console.error('Error inserting email data:', insertEmailsErr);
                        pool.end();
                        return;
                    }

                    console.log('Email data inserted successfully');
                    // Note: You might want to keep the pool open for the duration of your application's runtime
                    // pool.end(); // Close the database connection pool after all operations

                });
            });
        });
    });
});

module.exports = pool;