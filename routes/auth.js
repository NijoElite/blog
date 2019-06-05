function authIsRequired(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  const err = new Error('You don\'t have permission to access');
  err.status(403);
  return next(err);
}

function authIsOptional(req, res, next) {
  return next();
}

function notAuthorized(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  const err = new Error('You don\'t have permission to access');
  err.status(403);
  return next(err);
}

module.exports = {
  optional     : authIsOptional,
  required     : authIsRequired,
  notAuthorized: notAuthorized,
};
