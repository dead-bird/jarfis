require('dotenv').config({path: '.env'});

const axios = require('axios');
const env = process.env;

module.exports = {
  get: {
    async getTweet(id) {
      var token = await getAccessKey();
      const headers = {
        Authorization: token,
        'Accept-Encoding': 'gzip'
      };

      return new Promise((resolve, reject) => {
        axios.get('https://api.twitter.com/1.1/statuses/lookup.json?tweet_mode=extended&id=' + id, {headers}).then(res => {
          resolve(res.data[0]);
        }).catch(err => {
          reject(err.response.data);
        });
      });
    }
  }
};

function getAccessKey() {
  const twitterCredentials = `${env.CONSUMER_KEY}:${env.CONSUMER_SECRET}`;
  const encodedCredentials = new Buffer(twitterCredentials).toString('base64');
  const headers = {
    Authorization: 'Basic ' + encodedCredentials,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept-Encoding': 'gzip',
    Connection: 'keep-alive'
  };

  return new Promise((resolve, reject) => {
    axios.post('https://api.twitter.com/oauth2/token', 'grant_type=client_credentials', {headers}).then(res => {
      resolve(res.data.token_type + ' ' + res.data.access_token);
    }).catch(err => {
      reject(err.response.data);
    });
  });
}
