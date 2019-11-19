const Sequelize = require('sequelize');
/* eslint-disable no-case-declarations */
/* eslint-disable no-lonely-if */
const router = require('express').Router();
const { Project, Ticket, User, Column } = require('../db/models');
module.exports = router;

router.get('/all', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const allProjects = await Project.findAll();
      res.json(allProjects);
    }
  } catch (error) {
    next(error);
  }
});

/* The is the route for D3 chart: Get all of the tickets that belong to a specific user, include the project route */
router.get('/user/tickets', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      let userId = Number(req.user.id);
      const user = await User.findByPk(userId);
      const tickets = await Ticket.findAll({
        where: {
          userId: user.id
        },
        attributes: [
          'project.id',
          [Sequelize.fn('sum', Sequelize.col('points')), 'points']
        ],
        group: ['project.id'],
        include: [{ model: Project }],
        raw: true
      });
      res.json(tickets);
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
      const project = await Project.findByPk(Number(req.params.id));
      if (!project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          res.json(project);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});
/* get all tickets for a project a group them by the user  */
router.get('/:id/ticketdata', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const tickets = await Ticket.findAll({
        where: {
          projectId: req.params.id
        },
        attributes: [
          'user.id',
          [Sequelize.fn('sum', Sequelize.col('points')), 'points']
        ],
        group: ['user.id'],
        include: [{ model: User }],
        raw: true
      });
      console.log('TICKETS', tickets);
      res.json(tickets);
    }
  } catch (error) {
    next(error);
  }
});

// add a ticket to a specific project
router.post('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { title, description, points } = req.body;
      const project = await Project.findByPk(Number(req.params.id));
      if (!project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          const toDoColumn = await Column.findOne({
            where: {
              name: 'To Do',
              projectId: Number(req.params.id)
            }
          });

          const newTicket = await Ticket.create({
            title,
            description,
            points
          });

          await newTicket.insertDiffColumnLL(null, toDoColumn.id);

          await newTicket.setProject(project);

          res.json(newTicket);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

// add a column to a specific project
router.post('/:id/addColumn', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { name } = req.body;
      const project = await Project.findByPk(Number(req.params.id));
      if (!project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          const newColumn = await Column.create({
            name
          });

          await newColumn.setProject(project);

          res.json(newColumn);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

// get all the tickets for a specific project
router.get('/:id/tickets', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const project = await Project.findByPk(Number(req.params.id));
      if (!project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          const result = {};
          const tickets = [];

          let llResult = {};
          let columns = await project.getColumns();
          for (let i = 0; i < columns.length; i++) {
            let ticketRoot = await Ticket.findByPk(columns[i].ticketRoot, {
              include: User
            });
            let linkedList = [];
            while (ticketRoot) {
              linkedList.push(ticketRoot);
              tickets.push(ticketRoot);
              ticketRoot = await Ticket.findByPk(ticketRoot.next, {
                include: User
              });
            }
            llResult[columns[i].id] = { name: columns[i].name, linkedList };
          }

          result.llResult = llResult;
          result.tickets = tickets;
          res.json(result);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

/* This route gets all the users for a specific project  */
router.get('/:id/users', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const project = await Project.findByPk(Number(req.params.id));
      if (!project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          const users = await project.getUsers();
          res.json(users);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

/* This gets all the projects that belongs to a user */
router.get('/', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const user = await User.findByPk(req.user.id);
      const projects = await user.getProjects();
      res.json(projects);
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
      const { name, totalTime } = req.body;
      const newProject = await Project.create({ name, totalTime });
      await newProject.addUser(req.user);
      res.json(newProject);
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
      const project = await Project.findByPk(Number(req.params.id));
      if (!project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          await project.destroy();
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

// add a user to a specific project
router.put('/:id/adduser', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { email } = req.body;
      const project = await Project.findByPk(req.params.id);
      const user = await User.findOne({
        where: {
          email
        }
      });
      if (!project || !user) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          if (!user) {
            next();
          } else {
            const exists = await project.hasUser(user);
            if (!exists) {
              await project.addUser(user);
            }
          }
        }
        res.json(user);
      }
    }
  } catch (error) {
    next(error);
  }
});

// changing a project (not including adding users)
// eslint-disable-next-line complexity
router.put('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { name, totalTime } = req.body;

      if (typeof Number(req.params.id) !== 'number') {
        next();
      } else {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
          next();
        } else {
          const authorized = await project.hasUser(req.user);
          if (!authorized) {
            res.sendStatus(403);
          } else {
            await project.update({
              name,
              totalTime
            });
          }
          res.json(project);
        }
      }
    }
  } catch (error) {
    next(error);
  }
});
