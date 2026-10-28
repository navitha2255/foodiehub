const bcrypt = require('bcryptjs');
const { User } = require('../models');
const AppError = require('../utils/AppError');
const { signToken } = require('../utils/token');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      throw new AppError('Name, email and password are required', 400);
    }
    if ([name, email, password].some((v) => typeof v !== 'string')) {
      throw new AppError('Invalid input', 400);
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < 2) throw new AppError('Name must be at least 2 characters', 400);
    if (!EMAIL_REGEX.test(cleanEmail)) throw new AppError('Enter a valid email', 400);
    if (password.length < 8 || password.length > 72) {
      throw new AppError('Password must be 8 to 72 characters', 400);
    }

    const existing = await User.findOne({ where: { email: cleanEmail } });
    if (existing) throw new AppError('Email is already registered', 409);

    // role is NOT taken from the request, so it defaults to 'customer'
    const user = await User.create({ name: cleanName, email: cleanEmail, password });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user, token: signToken(user) },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    const passwordOk = user && (await bcrypt.compare(password, user.password));

    // Same message for "no such email" and "wrong password"
    if (!passwordOk) throw new AppError('Invalid email or password', 401);

    res.json({
      success: true,
      message: 'Login successful',
      data: { user, token: signToken(user) },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { register, login, getMe };