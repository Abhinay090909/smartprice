const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all brands
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM brands ORDER BY brand_name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;