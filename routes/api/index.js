const router = require('express').Router();

router.get('/', (req, res) => {
    res.redirect('/articles/feed');
});

router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));
router.use('/users', require('./users'));
router.use('/auth', require('./auth'));
router.use('/reg', require('./reg'));

module.exports = router;
