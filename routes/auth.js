function authIsRequired(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.sendStatus(403);
}

function authIsOptional(req, res, next) {
    return next();
}

function notAuthorized(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.sendStatus(403);
}


module.exports = {
    optional: authIsOptional, required: authIsRequired, notAuthorized: notAuthorized,
};
