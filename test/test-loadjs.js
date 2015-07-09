/**
 * loadjs tests
 * @module test/test-loadjs
 */


describe('hello', function() {
  
  var assert = require('assert'),
      helpers = require('./helpers.js');

  helpers.initDOM();

  it('should blah', function() {
    assert.equal(true, true);
  });
});
