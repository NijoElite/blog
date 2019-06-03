const router = require('express').Router(),
      mongoose = require('mongoose'),
      Article = mongoose.model('Article');

// Get Articles
// offset = Number >= 0, limit = Number[0;100], Author = String, Tags = tag-1, tag-2, tag-3
router.get('/', (req, res) => {
    const q = req.query;
    const query = {};

    let offset = Number.parseInt(q.offset) || +0;
    offset = Math.max(offset, 0);

    let limit = Number.parseInt(q.limit) || +20;
    limit = Math.max(limit, 0);
    limit = Math.min(limit, 100);

    if (typeof q.tags !== 'undefined') {
        const tags = q.tags.split(',');
        query.tagList = { $all: tags }
    }

    if (typeof q.author !== 'undefined') {
        query.author = q.author
    }

    Article.find(query, 'title author slug createdAt tagList description')
        .limit(limit)
        .skip(offset)
        .sort({createdAt: 'desc'})
        .then((articles) => res.send(articles));
});

// Get The Article
router.get('/:slug', (req, res) => {
    Article.findOne({slug: req.params.slug}).then(function(article) {
        if (!article) { return res.sendStatus(404); }

        res.send(article);
    });
});



module.exports = router;