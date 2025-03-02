const { Pool } = require('pg');

const pool = new Pool({
  user: 'actual_user', // Replace with actual database user
  host: 'localhost',
  database: 'ui_design_db', // Ensure this database exists
  password: 'actual_password', // Replace with actual database password
  port: 5432,
});


module.exports = pool;
