const router   = require('express').Router(),
      mongoose = require('mongoose'),
      User     = mongoose.model('User'),
      auth     = require('../auth');

// Register new user
router.post('/', auth.notAuthorized, function(req, res, next) {
  if (!req.body.email) {
    res.status(422).json({errors: {email: 'can\'t be blank'}});
  }

  if (!req.body.password) {
    res.status(422).json({errors: {password: 'can\'t be blank'}});
  }

  let bio = '';
  if (typeof req.body.bio !== 'undefined') {
    bio = req.body.bio;
  }

  const user = new User({
    username: req.body.username, email: req.body.email, bio: bio,
  });

  user.setPassword(req.body.password);

  user.save().
       then((user) => res.send(
           {status: 0, desc: `User ${user.username} created`})).
       catch(next);
});

module.exports = router;
