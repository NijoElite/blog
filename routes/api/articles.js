const router = require('express').Router(),
      mongoose = require('mongoose'),
      Article = mongoose.model('Article'),
      authRequired = require('../auth');

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

// Create article
router.post('/post', authRequired,
    function(req, res) {
        const q = req.body;
        const articleParams = {
            title: q.title,
            description: q.desc,
            body: q.body
        };

        articleParams.tagList = [];
        if (typeof q.tags !== 'undefined') {
            articleParams.tagList = q.tags.split(',');
        }

        articleParams.author = req.user._id;

        console.log(articleParams);

        let article = new Article(articleParams);

        article.save()
            .then((article) => {
                res.redirect(`/articles/${article.slug}` )
            })
            .catch(err => res.send({err:err.message}))

    });


// Get The Article
router.get('/:slug', (req, res) => {
    Article.findOne({slug: req.params.slug}).then(function(article) {
        if (!article) { return res.sendStatus(404); }

        res.send(article);
    });
});


module.exports = router;

/*
const ArticleSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    title: String,
    description: String,
    body: String,
    tagList: [{type: String}],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });
*/
