const { sequelize } = require('../models');

const run = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // creates missing tables only. Never drops anything.
    console.log('Tables synced');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error.message);
    process.exit(1);
  }
};

run();