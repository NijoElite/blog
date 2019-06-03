process.env.NODE_ENV = 'debug';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017';


module.exports = {
    secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret'
};