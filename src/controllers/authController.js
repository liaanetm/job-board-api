// src/controllers/authController.js
// Import bcryptjs to hash (encrypt) passwords before storing them in the database
const bcrypt = require('bcryptjs');

// Import jsonwebtoken to create and verify tokens for user authentication
const jwt = require('jsonwebtoken');

// Import the database connection pool to interact with the database
const pool = require('../db');


// REGISTER FUNCTION
// Handles creating a new user in the database
// It's asynchronous (async) so it can handle database queries without blocking other operations
const register = async (req, res) => {
  // Extract name, email, and password from the request body
  const { name, email, password } = req.body;

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);// $1 is a placeholder replaced by the value of email
    // Check if a user with the same email already exists
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before storing it
    // bcrypt.hash(password, 10) encrypts the password with 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at`,
      [name, email, hashedPassword]
    );
     
    // Send a success response with the new user's info
    res.status(201).json({ msg: 'User registered', user: newUser.rows[0] });
  } catch (err) {
    console.error('Register error:',err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// LOGIN FUNCTION
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // Compare the provided password with the hashed password stored in the database
    // bcrypt.compare returns true if they match, false otherwise
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JWT (JSON Web Token) for the authenticated user
    // The token includes user ID and email as payload and uses a secret from environment variables
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN, // Token expiration time
    });

    res.status(200).json({
      msg: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { register, login };
