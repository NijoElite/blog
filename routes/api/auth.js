const router = require('express').Router(),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    LocalStrategy = require('passport-local').Strategy,
    passport = require('passport');

passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(username, done) {
    User.findOne({username: username})
        .then(user => done(null, user))
        .catch(err => done(err));
});


passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username})
            .then(user => {
                if (!user) {
                    return done(null, false)
                }

                if (!user.validatePassword(password)) {
                    return done(null, false);
                }

                return done(null, user);
            })
            .catch(err => done(err));
    }));


router.post('/login',
    passport.authenticate('local', { failureRedirect: '/login'}),
    function(req, res) {
        res.redirect('/users/' + req.user.username);
    }
);

router.post('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;


