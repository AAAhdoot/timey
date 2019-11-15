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
  // order: {
  //   type: Sequelize.INTEGER,
  //   allowNull: false,
  //   defaultValue: 0,
  //   min: 0
  // },
  next: {
    type: Sequelize.INTEGER
  }
});

// Ticket.maxOrder = async function(status, projectId) {
//   const max = await Ticket.findAll({
//     where: {
//       status,
//       projectId
//     },
//     attributes: [Sequelize.fn('MAX', Sequelize.col('order'))],
//     raw: true
//   });
//   return max;
// };

Ticket.prototype.insertSameColumnLL = async function(dest, srcIdx, destIdx) {
  const column = await this.getColumn();

  if (column.ticketRoot === this.id) {
    await column.update({ ticketRoot: this.next });
  } else if (column.ticketRoot === dest.id) {
    await column.update({ ticketRoot: this.id });
  }

  const prev = await Ticket.findOne({
    where: { next: this.id }
  });

  const destTicket = await Ticket.findByPk(dest.id);

  if (prev) {
    await prev.update({ next: this.next });
  }

  if (srcIdx < destIdx) {
    await this.update({ next: destTicket.next });
    await destTicket.update({ next: this.id });
  } else {
    const preDest = await Ticket.findOne({ where: { next: dest.id } });
    if (preDest) {
      await preDest.update({ next: this.id });
    }
    await this.update({ next: destTicket.id });
  }
};

Ticket.prototype.removeFromColumnLL = async function() {
  const column = await this.getColumn();

  if (column.ticketRoot === this.id) {
    await column.update({ ticketRoot: this.next });
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

  await this.update({ next: null });
};

Ticket.prototype.insertDiffColumnLL = async function(dest, destColumnId) {
  const destColumn = await Column.findByPk(destColumnId);

  if (!dest) {
    // adding to end of column
    const lastTicket = await Ticket.findOne({
      where: { columnId: destColumnId, next: null }
    });
    if (lastTicket) {
      await lastTicket.update({ next: this.id });
    } else {
      // column is empty
      await destColumn.update({ ticketRoot: this.id });
    }

    await this.setColumn(destColumn);

    return;
  }

  if (destColumn.ticketRoot === dest.id) {
    await destColumn.update({ ticketRoot: this.id });
  }

  const prev = await Ticket.findOne({
    where: { next: dest.id }
  });

  if (prev) {
    await prev.update({ next: this.id });
  }

  await this.update({ next: dest.id, columnId: destColumnId });
};

// Ticket.prototype.insertSameColumn = async function(src, dest) {
//   if (src > dest) {
//     await Ticket.increment('order', {
//       where: {
//         status: this.status,
//         projectId: this.projectId,
//         order: { [Op.lt]: src, [Op.gte]: dest }
//       },
//       raw: true
//     });
//   }

//   if (src < dest) {
//     await Ticket.decrement('order', {
//       where: {
//         status: this.status,
//         projectId: this.projectId,
//         order: { [Op.gt]: src, [Op.lte]: dest }
//       },
//       raw: true
//     });
//   }
// };

// Ticket.prototype.removeFromColumn = async function() {
//   await Ticket.decrement('order', {
//     where: {
//       status: this.status,
//       projectId: this.projectId,
//       order: { [Op.gt]: this.order }
//     },
//     raw: true
//   });
// };

// Ticket.insertDiffColumn = async function(status, projectId, dest) {
//   await Ticket.increment('order', {
//     where: {
//       status,
//       projectId,
//       order: { [Op.gte]: dest }
//     },
//     raw: true
//   });
// };

module.exports = Ticket;
