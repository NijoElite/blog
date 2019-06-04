const mongoose = require('mongoose'),
      uniqueValidator = require('mongoose-unique-validator'),
      slug = require('slug');

const ArticleSchema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    title: {type: String, required: [true, 'cant be blank']},
    description: {type: String, required: [true, 'cant be blank']},
    body: {type: String, required: [true, 'cant be blank']},
    tagList: [{type: String}],
    author: { type: mongoose.Schema.Types.ObjectId, required: [true, 'cant be blank'], ref: 'User' }
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