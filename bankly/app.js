/** Application for bank.ly */
const { Pool } = require('pg');
const express = require('express');
const app = express();
const ExpressError = require("./helpers/expressError");

app.use(express.json());

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

/** 404 handler */

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Bankly API!' });
});


app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);

  return next(err);
});

/** general error handler */

app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  return res.json({
    status: err.status,
    message: err.message
  });
});

const pool = new Pool({
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.get('/users', async (req, res) => {
  try {
    // Query the database for all users.
    const result = await pool.query('SELECT * FROM users');
    // Send the users back in the response.
    res.json(result.rows);
  } catch (err) {
    // If an error occurs, send an error response.
    console.error(err);
    res.status(500).json({error: 'Internal server error'});
  }
});


module.exports = app;


