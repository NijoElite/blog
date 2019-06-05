const router   = require('express').Router(),
      mongoose = require('mongoose'),
      Article  = mongoose.model('Article'),
      User     = mongoose.model('User'),
      auth     = require('../auth');

router.param('article', function(req, res, next, slug) {
  Article.findOne({slug: slug}).populate('author').
          then(article => {
            if (!article) {
              return res.sendStatus(404);
            }

            req.article = article;
            return next();
          }).catch(next);
});

// Get Articles
// offset = Number >= 0, limit = Number[0;100], Author = String, Tags = tag-1, tag-2, tag-3
router.get('/feed', auth.optional, (req, res, next) => {
  const q = req.query;
  const query = {};

  let offset = Number.parseInt(q.offset) || +0;
  offset = Math.max(offset, 0);

  let limit = Number.parseInt(q.limit) || +20;
  limit = Math.max(limit, 0);
  limit = Math.min(limit, 100);

  if (typeof q.tags !== 'undefined') {
    const tags = q.tags.split(',');
    query.tagList = {$all: tags};
  }

  if (typeof q.author !== 'undefined') {
    query.author = q.author;
  }

  Article.find(query, 'title author slug createdAt tagList description').
          limit(limit).
          skip(offset).
          sort({createdAt: 'desc'}).
          populate('author').
          then((articles) => res.render('articles/feed.pug',
              {articles: articles})).
          catch(next);
});

// Create article
router.post('/post', auth.required, function(req, res, next) {
  const q = req.body;
  const articleParams = {
    title: q.title, description: q.desc, body: q.body,
  };

  articleParams.tagList = [];
  if (typeof q.tags !== 'undefined') {
    articleParams.tagList = q.tags.split(',');
  }

  articleParams.author = req.user._id;

  console.log(articleParams);

  let article = new Article(articleParams);

  article.save().then((article) => {
    res.redirect(`/articles/${article.slug}`);
  }).catch(next);
});

// Delete article
router.delete('/:article', auth.required, function(req, res, next) {
  User.findById(req.user._id).then(function(user) {
    if (!user) {
      return res.sendStatus(401);
    }

    if (req.article.author._id.toString() !== user._id.toString()) {
      return res.sendStatus(403);
    }

    req.article.remove().then(() => {
      res.sendStatus(204);
    }).catch(next);
  });
});

// Get article
router.get('/:article', auth.optional, (req, res) => {
  res.render('articles/article.pug', {article: req.article});
});

// Redirect
router.get('/', auth.optional, (req, res) => {
  res.redirect('/articles/feed');
});

module.exports = router;
