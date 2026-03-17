const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Helper to generate and set the JWT cookie
const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', // Prevents CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Prevent duplicate emails 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error(`Register Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      message: 'Logged in successfully',
      user: { id: user._id, email: user.email }
    });
  } catch (error) {
    console.error(`Login Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.logout = (req, res) => {
  // Clear the cookie by setting an expired date
  res.cookie('token', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully' });
};