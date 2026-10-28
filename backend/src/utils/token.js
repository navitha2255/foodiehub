const jwt = require('jsonwebtoken');

const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set in backend/.env');
  }
  return process.env.JWT_SECRET;
};

// Only the id goes inside the token. The role is always read fresh from the database.
const signToken = (user) =>
  jwt.sign({ id: user.id }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const verifyToken = (token) => jwt.verify(token, getSecret());

module.exports = { signToken, verifyToken };