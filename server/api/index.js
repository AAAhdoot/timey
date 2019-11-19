const router = require('express').Router();
module.exports = router;

router.use('/users', require('./users'));
router.use('/tickets', require('./tickets'));
router.use('/projects', require('./projects'));
router.use('/columns', require('./columns'));
router.use('/userTickets', require('./userTickets'));

router.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  res.status(404).send('NOT FOUND');
});
