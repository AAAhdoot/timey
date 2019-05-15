const router = require('express').Router();
const { User, UserTicket, Ticket, Project } = require('../db/models');
const Sequelize = require('sequelize');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/timesheet', async (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.sendStatus(403);
  } else {
    try {
      const data = await UserTicket.findAll({
        where: {
          userId: req.user.id,
          end: {
            [Sequelize.Op.ne]: null
          }
        },
        include: [{ model: Ticket, include: [{ model: Project }] }]
      });
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
});
