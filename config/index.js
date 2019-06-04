module.exports = {
  secret     : process.env.NODE_ENV === 'production'
      ? process.env.SECRET
      : 'secret',
  mongodb_uri: process.env.NODE_ENV === 'production'
      ? process.env.MONGODB_URI
      : 'mongodb://127.0.0.1:27017',
};
