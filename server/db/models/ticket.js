const Sequelize = require('sequelize');
const db = require('../db');
const Op = Sequelize.Op;

const Ticket = db.define('ticket', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      min: 1
    }
  },
  status: {
    type: Sequelize.ENUM('to_do', 'in_progress', 'in_review', 'done'),
    allowNull: false,
    defaultValue: 'to_do'
  },
  order: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    min: 0
  },
  next: {
    type: Sequelize.INTEGER
  }
});

Ticket.maxOrder = async function(status, projectId) {
  const max = await Ticket.findAll({
    where: {
      status,
      projectId
    },
    attributes: [Sequelize.fn('MAX', Sequelize.col('order'))],
    raw: true
  });
  return max;
};

Ticket.prototype.insertSameColumn = async function(src, dest) {
  if (src > dest) {
    await Ticket.increment('order', {
      where: {
        status: this.status,
        projectId: this.projectId,
        order: { [Op.lt]: src, [Op.gte]: dest }
      },
      raw: true
    });
  }

  if (src < dest) {
    await Ticket.decrement('order', {
      where: {
        status: this.status,
        projectId: this.projectId,
        order: { [Op.gt]: src, [Op.lte]: dest }
      },
      raw: true
    });
  }
};

Ticket.prototype.removeFromColumn = async function() {
  await Ticket.decrement('order', {
    where: {
      status: this.status,
      projectId: this.projectId,
      order: { [Op.gt]: this.order }
    },
    raw: true
  });
};

Ticket.insertDiffColumn = async function(status, projectId, dest) {
  await Ticket.increment('order', {
    where: {
      status,
      projectId,
      order: { [Op.gte]: dest }
    },
    raw: true
  });
};

module.exports = Ticket;
