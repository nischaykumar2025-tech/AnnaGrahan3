const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

// UPDATE THESE CREDENTIALS to match your PostgreSQL setup
const pool = new Pool({
    user: 'postgres',        // Your Postgres username
    host: 'localhost',
    database: 'surplus_db',  // Make sure this database exists
    password: '8501', // Ensure this password is correct
    port: 5432,
});

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL Connection Failed:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL surplus_db successfully!');
        release();
    }
});

app.get('/api/food', async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM food WHERE status = 'available' ORDER BY expires_at ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err.message);
        // Send JSON so Next.js res.json() won't crash
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/food', async (req, res) => {
    try {
        const { eatery_name, title, quantity, expires_at } = req.body;
        const newFood = await pool.query(
            "INSERT INTO food (eatery_name, title, quantity, expires_at) VALUES ($1, $2, $3, $4) RETURNING *",
            [eatery_name, title, quantity, expires_at]
        );
        res.json(newFood.rows[0]);
    } catch (err) {
        console.error('Database insert error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});