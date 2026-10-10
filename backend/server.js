const express = require('express');
const cors = require('cors');
const db = require('./db');
const foodRoutes = require('./routes/food'); 

const app = express();

app.use(cors());
app.use(express.json());

// Test connection on startup
db.pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ PostgreSQL Connection Failed:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL successfully!');
        release();
    }
});

// Delegate to the routes folder
app.use('/api/food', foodRoutes);

// Export app for Vercel; only listen locally
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app;