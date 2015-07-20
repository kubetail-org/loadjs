/**
 * loadjs tests
 * @module test/tests.js
 */

var pathsLoaded = null,  // file register
    assert = chai.assert,
    expect = chai.expect;


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
    // define bundle
    loadjs(['assets/file1.js', 'assets/file2.js'], 'bundle1');

    // define callback
    loadjs.ready('bundle1', function() {
      assert.equal(pathsLoaded['file1.js'], true);
      assert.equal(pathsLoaded['file2.js'], true);
      done();
    });
  });


  it('should allow bundle callbacks before definitions', function(done) {
    // define callback
    loadjs.ready('bundle2', function() {
      assert.equal(pathsLoaded['file1.js'], true);
      assert.equal(pathsLoaded['file2.js'], true);
      done();
    });

    // define bundle
    loadjs(['assets/file1.js', 'assets/file2.js'], 'bundle2');
  });



  it('should throw an error if bundle is already defined', function() {
    loadjs(['assets/file1.js'], 'bundle3');

    var fn = function() {
      loadjs(['assets/file1.js'], 'bundle3');
    };

    expect(fn).to.throw(Error, /already been defined/);
  });


  it('should call fail callback on invalid path', function(done) {
    loadjs(['assets/file-doesntexist.js'],
           function() {throw "Executed success callback";},
           function() {done();});
  });
});
