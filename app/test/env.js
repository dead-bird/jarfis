const assert = require('assert');
const dotenv = require('dotenv');
const eg = dotenv.config({ path: '.env.example' });
const env = dotenv.config({ path: '.env' });

describe('Environment Variables Test', function() {
  for (let key in eg.parsed) {
    it(`${key} should exist in .env`, function() {
      assert(env.parsed.hasOwnProperty(key));
    });
  }
});
