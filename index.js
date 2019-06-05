const express  = require('express'),
      mongoose = require('mongoose'),
      config   = require('./config'),
      passport = require('passport'),
      session  = require('express-session'),
      moment   = require('moment'),
      path     = require('path');

const app = express();

const isProduction = process.env.NODE_ENV === 'production';

/// mongoose
mongoose.connect(config.mongodb_uri);
mongoose.set('debug', !isProduction);

// models
require('./models/Article');
require('./models/User');

/// Express config
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/templates'));

app.locals.moment = moment;

app.use(express.static('static'));

app.use(express.urlencoded());
app.use(session({
  secret: config.secret, resave: false, saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

/// routes
app.use(require('./routes'));

// 404
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  err.message = 'Page doesn\'t exist';
  next(err);
});

app.use(function(err, req, res) {
  res.status = err.status || 500;

  res.render('error', {status: err.status, message: err.message});
});

// start server
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port ' + server.address().port);
});


