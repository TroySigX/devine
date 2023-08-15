const conf = require('config');

// github token
const githubToken =
  process.env.NODE_ENV === 'production' && process.env.githubToken
    ? process.env.githubToken
    : conf.get('githubToken');

// jwt secret
const jwtSecret =
  process.env.NODE_ENV === 'production' && process.env.jwtSecret
    ? process.env.jwtSecret
    : conf.get('jwtSecret');

// mongodb URI
const mongoURI =
  process.env.NODE_ENV === 'production' && process.env.mongoURI
    ? process.env.mongoURI
    : conf.get('mongoURI');

const vars = { githubToken, jwtSecret, mongoURI };

const config = {
  get: function (var_name) {
    return vars[var_name];
  },
};

module.exports = config;
