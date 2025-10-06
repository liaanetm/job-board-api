// Load environment variables from the .env file into process.env
// This allows you to store sensitive information (like database URL, secret keys) securely outside your code
require('dotenv').config();

// Import the Pool class from the 'pg' (PostgreSQL) library
// Pool manages a set of database connections to optimize performance
const { Pool } = require('pg');

// Create a new connection pool to the PostgreSQL database
// connectionString: specifies the database URL stored in environment variables
// ssl: ensures secure connection to the database (rejectUnauthorized: false allows self-signed certificates)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Export an object with a query function so this pool can be used in other files
// query: takes SQL text and parameters, then executes it on the database
// Example usage: pool.query('SELECT * FROM users WHERE id = $1', [1])
module.exports = {
    query: (text,params) => pool.query(text,params),
};