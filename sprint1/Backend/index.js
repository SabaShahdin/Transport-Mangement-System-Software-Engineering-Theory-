const express = require('express');
const admin = require('firebase-admin');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Initialize Firebase Admin SDK
const serviceAccount = require('./transport-management-sys-ce9dd-firebase-adminsdk-lg888-a22471874c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2022",
    database: "TransportManagement"
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL!');
});

app.post('/check-user', (req, res) => {
    const { email, username, contact_number, role, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?"; // Define sql query

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Database error" });
        }
        if (!result.length > 0) {
            // Insert new user into the database if they don't exist
            const insertSql = "INSERT INTO `transportmanagement`.`users` " +
                "(`username`, `email`, `password`, `contact_number`, `role`, `created_at`) VALUES (?)";

            const values = [
                username,
                email,
                password, // Add password to values
                contact_number || null,
                role || 'Passenger',
                new Date() // Add current timestamp for `created_at`
            ];

            db.query(insertSql, [values], (err, result) => {
                if (err) {
                    console.error('Database insertion error:', err);
                    return res.status(500).json({ error: "Failed to insert user" });
                }
                res.json({ exists: false, message: "User registered successfully!" });
            });
        } else {
            res.json({ exists: true }); // Return that the user exists
        }
    });
});

app.post('/signup', (req, res) => {
    // Extract values from request body
    const { username, email, password, contact_number, role } = req.body;

    const insertSql = "INSERT INTO `transportmanagement`.`users` " +
                      "(`username`, `email`, `password`, `contact_number`, `role`, `created_at`) VALUES (?)";

    const values = [
        username,
        email,
        password, // Add password to values
        contact_number || null,
        role || 'Passenger',
        new Date() // Add current timestamp for `created_at`
    ];

    // Use insertSql instead of sql
    db.query(insertSql, [values], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// Sign-In route
app.post('/signin', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length > 0) {
            res.status(200).json({ message: "Sign in successful!", user: result[0] });
        } else {
            res.status(401).json({ error: "Invalid email or password" });
        }
    });
});

// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.post('/check-user-sign', (req, res) => {
    const { email, username, contact_number, role, password } = req.body;
    const sql = "SELECT * FROM Users WHERE email = ?";
    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: "Database error" });
        }

        if (result.length > 0) {
            // User exists in the database
            res.json({ exists: true });
        } 
        
    });
});