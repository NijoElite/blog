const router = require('express').Router();

router.get('/', (req, res) => {
    res.redirect('/articles');
});

router.use('/', require('./articles'));
router.use('/articles', require('./articles'));
router.use('/tags', require('./tags'));

module.exports = router;