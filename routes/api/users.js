const router = require('express').Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


// Get User
router.get('/:username', function(req, res) {
    User.findOne({username: req.params.username}, 'username image bio email')
        .then(user => res.send(user));
});


// Get Users List
// username = string, limit = Number[0;100], offset = Number >= 0
router.get('/', function(req, res) {
    const q = req.query;
    const query = {};

    let offset = Number.parseInt(q.offset) || +0;
    offset = Math.max(offset, 0);

    let limit = Number.parseInt(q.limit) || +20;
    limit = Math.max(limit, 0);
    limit = Math.min(limit, 100);


    if (typeof q.username !== 'undefined') {
        query.username = new RegExp("^"+ q.username);
    }

    User.find(query, 'username image bio')
        .limit(limit)
        .skip(offset)
        .sort({username: 'desc'})
        .then( users => res.send(users));
});

module.exports = router;