# TODO Backend (Next.js + Sequelize + Postgres)

1. Copy `.env.example` to `.env` and fill your DB credentials.
2. Install:
   ```bash
   npm install
3. Run migrations:
   ```bash
   npm run migrate
4. Seed categories:
   ```bash
   npm run seed
5. Start dev server:
   ```bash
   npm run dev
Endpoints:

GET /api/tasks — list tasks (with category)

POST /api/tasks — create task: { "title": "Buy milk", "categoryId": 1 }

PUT /api/tasks/:id — update: { "completed": true } or { "title": "...", "categoryId": 2 }

DELETE /api/tasks/:id — delete task