let assert = require('assert');

describe('Example Test', function () {
  describe('Pass', function () {
    it('should pass the test', function () {
      assert.equal(1, 1);
    });
  });
  describe('Jarfis', function () {
    it('return true', function () {
      assert('Jarfis');
    });
  });
});
