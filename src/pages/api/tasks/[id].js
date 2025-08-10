// pages/api/tasks/[id].js
const sequelize = require('../../../lib/sequelize');
const Task = require('../../../models/task')
const Category = require('../../../models/category');
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

  const {
    query: { id },
    method
  } = req;


  if (!id) {
    res.status(400).json({ error: 'id required' });
    return;
  }

  const taskId = parseInt(id, 10);
  if (!id || Number.isNaN(taskId)) return res.status(400).json({ error: 'invalid id' });

  try {
    if (['PUT', 'PATCH'].includes(req.method)) {
      const payload = req.body || {};

      const task = await Task.findByPk(taskId);
      if (!task) return res.status(404).json({ error: 'Task not found' });

      const updates = {};
      if (payload.title !== undefined) {
        if (!payload.title || typeof payload.title !== 'string')
          return res.status(400).json({ error: 'invalid title' });
        updates.title = payload.title.trim();
      }
      if (payload.completed !== undefined) updates.completed = Boolean(payload.completed);
      if (payload.categoryId !== undefined) {
        if (payload.categoryId === null) {
          updates.categoryId = null;
        } else {
          const cat = await Category.findByPk(payload.categoryId);
          if (!cat) return res.status(400).json({ error: 'categoryId not found' });
          updates.categoryId = payload.categoryId;
        }
      }

      await task.update(updates);

      const updated = await Task.findByPk(task.id, {
        include: [{ model: Category, attributes: ['id', 'name'] }]
      });

      return res.status(200).json(updated);
    }
  } catch (err) {
    console.error(err);
    return sendError(res, 500, 'Failed to fetch tasks');
  }

  if (req.method === 'DELETE') {
    try {
      const task = await Task.findByPk(taskId);
      if (!task) return res.status(404).json({ error: 'Task not found' });
      await task.destroy();
      return res.status(204).end();
    } catch (error) {
      console.error(err);
      return sendError(res, 500, 'Failed to fetch tasks');
    }
  }

  res.setHeader('Allow', 'PUT, PATCH, DELETE');
  res.status(405).end(`Method ${method} Not Allowed`);
}
