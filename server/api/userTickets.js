const router = require('express').Router();
const { UserTicket, User, Ticket } = require('../db/models');
const Sequelize = require('sequelize');
module.exports = router;

// returns all usertickets for a specific userId
// router.get('/:userId', async (req, res, next) => {
//   try {
//     if (!req.isAuthenticated()) {
//       res.sendStatus(403);
//     } else {
//       const user = await User.findByPk(Number(req.params.userId));
//       if (!user) {
//         next();
//       } else {
//         const usertickets = await user.getUserTickets();
//         res.json(usertickets);
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// returns all usertickets for a specific ticketId
// router.get('/:ticketId', async (req, res, next) => {
//   try {
//     if (!req.isAuthenticated()) {
//       res.sendStatus(403);
//     } else {
//       const ticket = await Ticket.findByPk(Number(req.params.ticketId));
//       if (!ticket) {
//         next();
//       } else {
//         const usertickets = await ticket.getUserTickets();
//         res.json(usertickets);
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// });

// returns the open userTicket for a specific ticketId
router.get('/:ticketId/open', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const userTicket = await UserTicket.findOne({
        where: {
          ticketId: req.params.ticketId,
          userId: req.user.id,
          end: null
        }
      });
      if (!userTicket) {
        res.json('no open tickets');
      } else {
        res.json(userTicket);
      }
    }
  } catch (error) {
    next(error);
  }
});

// for adding an end to a userTicket
router.put('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const userTicket = await UserTicket.findOne({
        where: {
          ticketId: req.params.id,
          userId: req.user.id,
          end: null
        }
      });
      if (!userTicket) {
        next();
      } else {
        const updatedTicket = await userTicket.update({
          end: Sequelize.literal('CURRENT_TIMESTAMP')
        });
        res.json(updatedTicket);
      }
    }
  } catch (error) {
    next(error);
  }
});

// for creating a new userTicket
router.post('/:ticketId', async (req, res, next) => {
  const ticketId = Number(req.params.ticketId);
  const user = await User.findByPk(Number(req.user.id));
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(Number(ticketId));
      if (!ticket) {
        next();
      } else if (ticket.userId !== user.id) {
        res.sendStatus(403);
      }
      const openTickets = await UserTicket.findAll({
        where: {
          userId: user.id,
          end: null
        }
      });
      if (openTickets.length) {
        res.json(403);
      } else {
        const userTicket = await UserTicket.create();
        await userTicket.setUser(user);
        await userTicket.setTicket(ticket);
        res.json(userTicket);
      }
    }
  } catch (error) {
    next(error);
  }
});
