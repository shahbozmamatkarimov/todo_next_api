// migrate.js
const sequelize = require('./lib/sequelize');
const fs = require('fs');
const path = require('path');

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('DB connection OK');

    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.js'))
      .sort();

    const queryInterface = sequelize.getQueryInterface();
    const Sequelize = require('sequelize');

    for (const file of files) {
      const migration = require(path.join(migrationsDir, file));
      if (migration && typeof migration.up === 'function') {
        console.log('Running migration:', file);
        await migration.up(queryInterface, Sequelize);
        console.log('OK', file);
      }
    }

    console.log('All migrations done');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed', err);
    process.exit(1);
  }
}

runMigrations();
