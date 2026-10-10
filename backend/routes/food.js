const express = require('express');
const router = express.Router();
const db = require('../db');

// GET: Browse available food
router.get('/', async (req, res) => {
    try {
        // Enforces PRD rule: Only return AVAILABLE listings where current_time < expiry_time
        const result = await db.query(
            "SELECT * FROM food WHERE status = 'AVAILABLE' AND expires_at > NOW() ORDER BY expires_at ASC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a listing
router.post('/', async (req, res) => {
    try {
        const { eatery_name, title, quantity, expires_at } = req.body;
        const newFood = await db.query(
            "INSERT INTO food (eatery_name, title, quantity, expires_at, status) VALUES ($1, $2, $3, $4, 'AVAILABLE') RETURNING *",
            [eatery_name, title, quantity, expires_at]
        );
        res.json(newFood.rows[0]);
    } catch (err) {
        console.error('Database insert error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// POST: Claim food (Atomic update to prevent race conditions)
router.post('/:id/claim', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Enforces PRD Case 1 & 2: Atomic update ensuring it is AVAILABLE and not expired
        const result = await db.query(
            "UPDATE food SET status = 'CLAIMED' WHERE id = $1 AND status = 'AVAILABLE' AND expires_at > NOW() RETURNING *",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Food is no longer available or already claimed." 
            });
        }

        res.json({ success: true, claim: result.rows[0] });
    } catch (err) {
        console.error('Database claim error:', err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;