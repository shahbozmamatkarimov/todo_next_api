// createCategories.js
const sequelize = require('../lib/sequelize');
const { QueryTypes } = require('sequelize');

async function createCategories() {
  await sequelize.authenticate();
  console.log('DB connected');

  // change categories array as you like
  const categories = ['Personal', 'Work', 'Shopping', 'Other'];

  for (const name of categories) {
    // using raw query ensures idempotency with ON CONFLICT DO NOTHING
    await sequelize.query(
      `INSERT INTO "Categories" ("name", "createdAt", "updatedAt")
       VALUES (:name, NOW(), NOW())
       ON CONFLICT ("name") DO NOTHING`,
      { replacements: { name }, type: QueryTypes.INSERT }
    );
    console.log('Ensured category:', name);
  }

  console.log('Category seed complete');
  process.exit(0);
}

createCategories().catch(err => {
  console.error(err);
  process.exit(1);
});
