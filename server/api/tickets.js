/* eslint-disable complexity */
/* eslint-disable no-lonely-if */
const router = require('express').Router();
const { Ticket, User, Project } = require('../db/models');
module.exports = router;

router.get('/', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const allTickets = await Ticket.findAll();
      res.json(allTickets);
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(Number(req.params.id));
      const project = await Project.findByPk(ticket.projectId);

      if (!ticket || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          res.json(ticket);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

router.get('/:id/user', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(Number(req.params.id));
      const project = await Project.findByPk(ticket.projectId);
      if (!ticket || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          const user = await ticket.getUser();
          if (!user) {
            next();
          } else {
            res.json(user);
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
});
//getting user for the ticket
router.get('/:id/user', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(Number(req.params.id));
      const project = await Project.findByPk(ticket.projectId);
      if (!ticket || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          const user = ticket.findByPk(Number(req.params.id));
          res.json(user);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { title, description, points, status } = req.body;
      const newTicket = await Ticket.create({
        title,
        description,
        points,
        status
      });
      res.json(newTicket);
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { title, description, points, status, userId } = req.body;
      const ticket = await Ticket.findByPk(req.params.id);
      const project = await Project.findByPk(ticket.projectId);
      if (!ticket || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          await ticket.update({
            title,
            description,
            points,
            status
          });
        }
        if (userId) {
          const user = await User.findByPk(userId);
          if (user) {
            await ticket.setUser(user);
            ticket.currentUserEmail = user.email;
          }
        }

        res.json(ticket);
      }
    }
  } catch (error) {
    next(error);
  }
});

router.put('/:id/reorder', async (req, res, next) => {
  try {
    const { result, src, dest } = req.body;

    // console.log(src, dest);

    const { destination, source, draggableId } = result;

    const ticket = await Ticket.findByPk(req.params.id);

    if (source.droppableId === destination.droppableId) {
      // await ticket.insertSameColumn(source.index, destination.index);
      // await ticket.update({
      //   order: destination.index
      // });
      await ticket.removeFromColumnLL();
      // await ticket.insertSameColumnLL(dest);

      res.sendStatus(200);
    } else {
      // await ticket.removeFromColumn();
      // await Ticket.insertDiffColumn(
      //   destination.droppableId,
      //   ticket.projectId,
      //   destination.index
      // );
      // await ticket.update({
      //   status: destination.droppableId,
      //   order: destination.index
      // });

      await ticket.removeFromColumnLL();
      await ticket.insertDiffColumnLL(dest);

      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
});

// add a user to a specific ticket
router.put('/:id/adduser', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(req.params.id);
      const user = await User.findByPk(req.body.userId);
      await ticket.setUser(user);
      const result = {};
      result.ticket = ticket;
      result.userEmail = user.email;
      // let result = await ticket.update({ userId: req.body.userId });
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

// remove  user from specific ticket
router.put('/:id/removeuser', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(req.params.id);
      let result = await ticket.update({ userId: null });
      res.json(result);
    }
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const ticket = await Ticket.findByPk(Number(req.params.id));
      const project = await Project.findByPk(ticket.projectId);
      if (!ticket || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          await ticket.removeFromColumn();
          await ticket.destroy();
          res.sendStatus(200);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});
