import sequelize from '../../../lib/sequelize';
import Category from '../../../models/category';
import NextCors from 'nextjs-cors';

async function ensureDB() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error('DB connection error:', err);
    throw new Error('Database connection failed');
  }
}

async function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

export default async function handler(req, res) {
  await NextCors(req, res, {
    methods: ['GET', 'OPTIONS'],
    origin: '*',
    optionsSuccessStatus: 200,
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureDB();
  } catch (err) {
    return sendError(res, 500, err.message);
  }

  const method = req.method;

  if (method === 'GET') {
    try {
      const categories = await Category.findAll({
        order: [['id', 'ASC']],
      });
      return res.status(200).json(categories);
    } catch (err) {
      console.error('GET /categories error:', err);
      return sendError(res, 500, 'Failed to fetch tasks');
    }
  }

  res.setHeader('Allow', ['GET', 'OPTIONS']);
  return sendError(res, 405, `Method ${method} Not Allowed`);
}
