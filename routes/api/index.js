const router = require('express').Router();

router.get('/', (req, res) => {
    res.redirect('/articles');
});

router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));
router.use('/users', require('./users'));
router.use('/reg', require('./reg'));
router.use('/login', require('./auth'));

module.exports = router;