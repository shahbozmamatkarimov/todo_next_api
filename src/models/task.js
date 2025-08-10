const { DataTypes } = require('sequelize');
const sequelize = require('../lib/sequelize');
const Category = require('./category');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  completed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  tableName: 'Tasks'
});

Category.hasMany(Task, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
Task.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Task;
