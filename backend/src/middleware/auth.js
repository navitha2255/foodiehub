const { User } = require('../models');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/token');

// Blocks the request unless a valid token is sent
const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Not authenticated. Please log in.', 401);
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new AppError('Session expired. Please log in again.', 401);
      }
      if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
        throw new AppError('Invalid token. Please log in again.', 401);
      }
      throw err; // a real server problem, not a bad token
    }

    const user = await User.findByPk(payload.id);
    if (!user) throw new AppError('This user no longer exists', 401);

    req.user = user; // controllers can now use req.user
    next();
  } catch (error) {
    next(error);
  }
};

// Allows only the listed roles. Use it AFTER protect.
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to do this', 403));
  }
  next();
};

const adminOnly = authorize('admin');

module.exports = { protect, authorize, adminOnly };