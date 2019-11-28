const router = require('express').Router();
const { Project, Column } = require('../db/models');
module.exports = router;

router.put('/:id', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      const { name } = req.body;
      const column = await Column.findByPk(req.params.id);
      const project = await Project.findByPk(column.projectId);
      if (!column || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          await column.update({
            name
          });
        }
        res.json(column);
      }
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
      const column = await Column.findByPk(Number(req.params.id));
      const project = await Project.findByPk(column.projectId);

      if (!column || !project) {
        next();
      } else {
        const authorized = await project.hasUser(req.user);
        if (!authorized) {
          res.sendStatus(403);
        } else {
          let tickets = await column.getTickets();
          if (tickets.length) {
            res
              .status(304)
              .send(
                'Column still contains tickets. Please move or delete all tickets in this column before attempting to delete the column again.'
              );
          } else {
            await column.destroy();
            res.sendStatus(200);
          }
        }
      }
    }
  } catch (error) {
    next(error);
  }
});
