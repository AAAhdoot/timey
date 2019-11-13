const Sequelize = require('sequelize');
const db = require('../db');
const Column = require('./column');
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

Ticket.prototype.insertSameColumnLL = async function(dest) {
  const column = await this.getColumn();

  if (column.ticketRoot === this.id) {
    await column.update({ ticketRoot: this.next });
  } else if (column.ticketRoot === dest.id) {
    await column.update({ ticketRoot: this.id });
  }

  await Ticket.update(
    { next: this.next || null },
    {
      where: {
        projectId: this.projectId,
        next: this.id
      }
    }
  );

  await this.update({ next: dest.next });

  await Ticket.update(
    { next: this.id || null },
    {
      where: {
        projectId: this.projectId,
        id: dest.id
      }
    }
  );
};

Ticket.prototype.removeFromColumnLL = async function() {
  const column = await this.getColumn();

  if (column.ticketRoot === this.id) {
    await column.update({ ticketRoot: this.next });
  }

  await Ticket.update(
    // change the next ref of prev ticket to this.next
    { next: this.next || null },
    {
      where: {
        projectId: this.projectId,
        next: this.id
      }
    }
  );

  await this.update({ next: null });
};

Ticket.prototype.insertDiffColumnLL = async function(dest) {
  const destColumn = await Column.findByPk(dest.columnId);

  if (destColumn.ticketRoot === dest.id) {
    await destColumn.update({ ticketRoot: this.id });
  }

  // await Ticket.update(
  //   { next: this.id },
  //   {
  //     where: {
  //       projectId: this.projectId,
  //       id: dest.id
  //     }
  //   }
  // );

  await Ticket.update(
    { next: this.id },
    {
      where: {
        projectId: this.projectId,
        next: dest.id
      }
    }
  );

  await this.update({ next: dest.id, columnId: destColumn.id });
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
