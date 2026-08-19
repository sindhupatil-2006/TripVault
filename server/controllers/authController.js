const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { generateUniqueUsername } = require('../utils/username');

const ensureProfileFields = async (user) => {
  if (!user) {
    return user;
  }

  if (!user.username) {
    user.username = await generateUniqueUsername(User, user.name || user.email, user._id);
  }

  if (user.bio === undefined || user.bio === null) {
    user.bio = '';
  }

  await user.save();
  return user;
};

const registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = await generateUniqueUsername(User, name);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      username,
      bio: '',
    });

    res.status(201).json({ success: true, message: 'Registration Successful', user: { id: user._id, name: user.name, email: user.email, username: user.username, bio: user.bio || '' } });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user = await ensureProfileFields(user);
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio || '',
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await ensureProfileFields(req.user);
    res.status(200).json({ success: true, user: {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio || '',
    } });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser, loginUser, getMe, ensureProfileFields };
