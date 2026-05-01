const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const smartphonesRouter = require('./routes/smartphones');
const brandsRouter = require('./routes/brands');
const usersRouter = require('./routes/users');
const favoritesRouter = require('./routes/favorites');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/smartphones', smartphonesRouter);
app.use('/api/brands', brandsRouter);
app.use('/api/users', usersRouter);
app.use('/api/favorites', favoritesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SmartPrice server running on http://localhost:${PORT}`);
});