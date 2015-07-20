/**
 * loadjs tests
 * @module test/tests.js
 */

var pathsLoaded = null,  // file register
    assert = chai.assert;


describe('hello', function() {


  beforeEach(function() {
    // reset register
    pathsLoaded = {};
  });


  it('should call success callback on valid path', function(done) {
    loadjs(['assets/file1.js'], function() {
      assert.equal(pathsLoaded['file1.js'], true);
      done();
    });
  });

  
  it('should call success callback on two valid paths', function(done) {
    loadjs(['assets/file1.js', 'assets/file2.js'], function() {
      assert.equal(pathsLoaded['file1.js'], true);
      assert.equal(pathsLoaded['file2.js'], true);
      done();
    });
  });


  it('should define bundles', function(done) {
    loadjs(['assets/file1.js', 'assets/file2.js'], 'bundle1');

    // on bundle load
    loadjs.ready('bundle1', function() {
      assert.equal(pathsLoaded['file1.js'], true);
      assert.equal(pathsLoaded['file2.js'], true);
      done();
    });
  });


  it('should allow bundle callbacks before definitions', function(done) {
    // on bundle load
    loadjs.ready('bundle2', function() {
      assert.equal(pathsLoaded['file1.js'], true);
      assert.equal(pathsLoaded['file2.js'], true);
      done();
    });

    loadjs(['assets/file1.js', 'assets/file2.js'], 'bundle2');
  });


  it('should call fail callback on invalid path', function(done) {
    loadjs(['assets/file-doesntexist.js'],
           function() {throw "Executed success callback";},
           function() {done();});
  });
});
