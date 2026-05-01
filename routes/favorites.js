const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get favorites for a user
router.get('/:userId', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.phone_id, s.model_name, b.brand_name, s.ram_gb,
                   s.storage_gb, s.price, s.color, s.unlocked
            FROM favorites f
            JOIN smartphones s ON f.phone_id = s.phone_id
            JOIN brands b ON s.brand_id = b.brand_id
            WHERE f.user_id = $1
        `, [req.params.userId]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add to favorites
router.post('/', async (req, res) => {
    try {
        const { user_id, phone_id } = req.body;
        await pool.query(`
            INSERT INTO favorites (user_id, phone_id) VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `, [user_id, phone_id]);
        res.json({ message: 'Added to favorites' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Remove from favorites
router.delete('/', async (req, res) => {
    try {
        const { user_id, phone_id } = req.body;
        await pool.query(`
            DELETE FROM favorites WHERE user_id = $1 AND phone_id = $2
        `, [user_id, phone_id]);
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;