const assert = require('assert');
const dotenv = require('dotenv');
const eg = dotenv.config({path: '.env.example'});
const env = dotenv.config({path: '.env'});

describe('Environment Variables Test', function () {
  for (let key in eg.parsed) {
    if (key) {
      it(`${key} should exist in .env`, function () {
        assert(Object.prototype.hasOwnProperty.call(env.parsed, key));
      });
    }
  }
});
