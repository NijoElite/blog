const express  = require('express'),
      mongoose = require('mongoose'),
      config   = require('./config'),
      passport = require('passport'),
      session  = require('express-session');


const app = express();

const isProduction = process.env.NODE_ENV === 'production';


/// mongoose
mongoose.connect(config.mongodb_uri);
mongoose.set('debug', !isProduction);

// models
require('./models/Article');
require('./models/User');

app.use(express.urlencoded());
app.use(session({
    secret: config.secret, resave: false, saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

/// routes
app.use(require('./routes'));

// 404
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use((err, req, res) => {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            'errors': {
                message: err.message, error: err,
            },
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message, error: {},
        },
    });
});


// start server
const server = app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on port ' + server.address().port);
});


