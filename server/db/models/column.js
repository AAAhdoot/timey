const Sequelize = require('sequelize');
const db = require('../db');

const Column = db.define('column', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  ticketRoot: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1
    }
  }
});

module.exports = Column;
