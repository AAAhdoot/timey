const Sequelize = require('sequelize');
const db = require('../db');

const Column = db.define('column', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
    // create validation to make sure there isn't another column of the same name for a specific project
  },
  ticketRoot: {
    type: Sequelize.INTEGER,
    validate: {
      min: 1
    }
  }
});

module.exports = Column;
