const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    status = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    status = 409;
    message = 'This record is linked to other data';
  }

  if (status === 500) {
    console.error(err);
    message = 'Internal server error';
  }

  res.status(status).json({ success: false, message });
};

module.exports = { notFound, errorHandler };