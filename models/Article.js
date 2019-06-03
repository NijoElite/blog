const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      slug = require('slug');

const ArticleSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    title: String,
    description: String,
    body: String,
    tagList: [{type: String}],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

ArticleSchema.plugin(uniqueValidator, { message: 'is already taken' });

ArticleSchema.pre('validate', function(next)  {
    if(!this.slug)  {
        this.slugify();
    }

    next();
});

ArticleSchema.methods.slugify = function() {
    this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

mongoose.model('Article', ArticleSchema);