const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all smartphones with filters
router.get('/', async (req, res) => {
    try {
        const { brand, ram, storage, minPrice, maxPrice, search } = req.query;
        let query = `
            SELECT s.phone_id, s.model_name, b.brand_name, s.ram_gb, 
                   s.storage_gb, s.price, s.color, s.unlocked
            FROM smartphones s
            JOIN brands b ON s.brand_id = b.brand_id
            WHERE 1=1
        `;
        const params = [];
        let i = 1;

        if (brand) { query += ` AND b.brand_name = $${i++}`; params.push(brand); }
        if (ram) { query += ` AND s.ram_gb = $${i++}`; params.push(ram); }
        if (storage) { query += ` AND s.storage_gb = $${i++}`; params.push(storage); }
        if (minPrice) { query += ` AND s.price >= $${i++}`; params.push(minPrice); }
        if (maxPrice) { query += ` AND s.price <= $${i++}`; params.push(maxPrice); }
        if (search) { query += ` AND s.model_name ILIKE $${i++}`; params.push(`%${search}%`); }

        query += ` ORDER BY s.price ASC LIMIT 200`;

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single smartphone
router.get('/:id', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, b.brand_name 
            FROM smartphones s
            JOIN brands b ON s.brand_id = b.brand_id
            WHERE s.phone_id = $1
        `, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Add smartphone (admin)
router.post('/', async (req, res) => {
    try {
        const { model_name, brand_id, ram_gb, storage_gb, price, color, unlocked } = req.body;
        const result = await pool.query(`
            INSERT INTO smartphones (model_name, brand_id, ram_gb, storage_gb, price, color, unlocked)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `, [model_name, brand_id, ram_gb, storage_gb, price, color, unlocked]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update smartphone (admin)
router.put('/:id', async (req, res) => {
    try {
        const { model_name, brand_id, ram_gb, storage_gb, price, color, unlocked } = req.body;
        const result = await pool.query(`
            UPDATE smartphones SET model_name=$1, brand_id=$2, ram_gb=$3, 
            storage_gb=$4, price=$5, color=$6, unlocked=$7
            WHERE phone_id=$8 RETURNING *
        `, [model_name, brand_id, ram_gb, storage_gb, price, color, unlocked, req.params.id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete smartphone (admin)
router.delete('/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM smartphones WHERE phone_id = $1', [req.params.id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;