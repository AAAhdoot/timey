const Sequelize = require('sequelize');
const Column = require('./column');
const db = require('../db');

const Project = db.define('project', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  totalTime: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
      min: 0
    }
  }
});

Project.afterCreate(async project => {
  const columns = [
    await Column.create({ name: 'To Do' }),
    await Column.create({ name: 'In Progress' }),
    await Column.create({ name: 'In Review' }),
    await Column.create({ name: 'Done' })
  ];
  for (let i = 0; i < columns.length; i++) {
    await columns[i].setProject(project);
  }
});

module.exports = Project;
