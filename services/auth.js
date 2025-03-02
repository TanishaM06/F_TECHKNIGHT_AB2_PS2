const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const pool = require('../config/db');

async function register(email, username, password) {
  if (!email || !username || !password) {
    throw new Error('Email, username, and password are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const result = await pool.query(
    'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id',
    [email, username, hashedPassword]
  );
  const token = jwt.sign({ id: result.rows[0].id }, 'secret_key');
  return { token };
}

async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];
  if (user && await bcrypt.compare(password, user.password)) { // Compare hashed password

    const token = jwt.sign({ id: user.id }, 'secret_key');
    return { token };
  }
  throw new Error('Invalid credentials');
}

module.exports = { register, login };
