const router = require('express').Router(),
      mongoose = require('mongoose'),
      User = mongoose.model('User');


// Register new user
router.post('/', function(req, res) {

    let isDataPresent =
        typeof req.body.email !== 'undefined' &&
        typeof req.body.username !== 'undefined' &&
        typeof req.body.password !== 'undefined';

    if (!isDataPresent) {
        res.send({
            status: 1,
            desc: 'Required parameters not provided'
        });
    }

    let bio = '';
    if (typeof req.body.bio !== 'undefined') {
        bio = req.body.bio;
    }

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        bio: bio,
    });

    user.save()
        .then((user) => res.send({status: 0, desc: `User ${user.username} created`}))
        .catch((err) => res.send({status: 1, desc: `${err}`}));
});


module.exports = router;