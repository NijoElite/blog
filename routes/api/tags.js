const router = require('express').Router(),
    mongoose = require('mongoose'),
    Article = mongoose.model('Article');

router.get('/', function(req, res) {
    Article.aggregate([{
        $unwind: "$tagList"
    },
    {
        $group: {
            _id: "$tagList",
            count: { $sum: 1 }
        }
    }
    ]).then(r => res.send(r));
});


module.exports = router;