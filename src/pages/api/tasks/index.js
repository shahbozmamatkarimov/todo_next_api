import sequelize from '../../../lib/sequelize';
import Task from '../../../models/task';
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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
      const tasks = await Task.findAll({
        include: [{ model: Category, attributes: ['id', 'name'] }],
        order: [['id', 'ASC']],
      });
      return res.status(200).json(tasks);
    } catch (err) {
      console.error('GET /tasks error:', err);
      return sendError(res, 500, 'Failed to fetch tasks');
    }
  }

  if (method === 'POST') {
    try {
      const { title, categoryId } = req.body || {};

      if (!title || typeof title !== 'string' || !title.trim()) {
        return sendError(res, 400, 'title is required and must be a string');
      }

      let category = null;
      if (categoryId) {
        category = await Category.findByPk(categoryId);
        if (!category) {
          return sendError(res, 400, 'categoryId not found');
        }
      }

      const task = await Task.create({
        title: title.trim(),
        completed: false,
        categoryId: category ? category.id : null,
      });

      const taskWithCategory = await Task.findByPk(task.id, {
        include: [{ model: Category, attributes: ['id', 'name'] }],
      });

      return res.status(201).json(taskWithCategory);
    } catch (err) {
      console.error('POST /tasks error:', err);
      return sendError(res, 500, 'Failed to create task');
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
  return sendError(res, 405, `Method ${method} Not Allowed`);
}
