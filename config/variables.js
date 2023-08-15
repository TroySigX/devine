// github token
const githubToken =
  process.env.NODE_ENV === 'production'
    ? process.env.githubToken
    : config.get('githubToken');

// jwt secret
const jwtSecret =
  process.env.NODE_ENV === 'production'
    ? process.env.jwtSecret
    : config.get('jwtSecret');

// mongodb URI
const mongoURI =
  process.env.NODE_ENV === 'production'
    ? process.env.mongoURI
    : config.get('mongoURI');

const vars = { githubToken, jwtSecret, mongoURI };

const config = {
  get: function (var_name) {
    return vars[var_name];
  },
};

module.exports = config;
