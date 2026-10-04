const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all available food posts (Runtime validation layer included)
router.get('/', async (req, res) => {
    try {
        const { rows } = await db.query(
            `SELECT * FROM food_posts 
             WHERE status = 'available' AND expires_at > NOW() 
             ORDER BY created_at DESC`
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Create a new food listing
router.post('/', async (req, res) => {
    const { eatery_name, title, quantity, expires_at } = req.body;
    try {
        const { rows } = await db.query(
            `INSERT INTO food_posts (eatery_name, title, quantity, expires_at) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [eatery_name, title, quantity, expires_at]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Claim a food listing (Atomic Transaction)
router.post('/:id/claim', async (req, res) => {
    const { id } = req.params;
    const { consumer_name } = req.body;

    const client = await db.pool.connect();
    try {
        await client.query('BEGIN');

        // Lock the row to prevent race conditions
        const checkRes = await client.query(
            `SELECT * FROM food_posts WHERE id = $1 FOR UPDATE`,
            [id]
        );

        if (checkRes.rows.length === 0) {
            throw new Error('Listing not found');
        }

        const post = checkRes.rows[0];

        if (post.status !== 'available' || new Date(post.expires_at) <= new Date()) {
            throw new Error('Food is no longer available or has expired.');
        }

        // Update status to claimed
        await client.query(
            `UPDATE food_posts SET status = 'claimed' WHERE id = $1`,
            [id]
        );

        // Insert claim record
        await client.query(
            `INSERT INTO claims (post_id, consumer_name) VALUES ($1, $2)`,
            [id, consumer_name || 'Anonymous Consumer']
        );

        await client.query('COMMIT');
        res.json({ message: 'Food successfully claimed!' });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: err.message });
    } finally {
        client.release();
    }
});

module.exports = router;