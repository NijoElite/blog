const router = require('express').Router();

router.get('/', (req, res) => {
  res.redirect('/articles/feed');
});

router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/reg', require('./reg'));

router.use(function(err, req, res, next) {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function(errors, key) {
        errors[key] = err.errors[key].message;

        return errors;
      }, {}),
    });
  }
  next(err);
});

module.exports = router;
