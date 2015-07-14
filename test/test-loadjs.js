/**
 * loadjs tests
 * @module test/test-loadjs
 */

describe('hello', function() {
  
  var assert = require('assert');


  before(function() {
    require('../src/loadjs.js');
  });


  it('should blah', function(done) {
    var loadjs = window.loadjs;

    loadjs(['assets/file1.js'],
           function() {
             console.log('load');
             assert.equal(true, true);
             done();
           },
           function() {
             console.log('error');
             assert.equal(false, true);
             done();
           });
  });
});
