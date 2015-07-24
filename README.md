# LoadJS

<img src="https://www.muicss.com/static/images/loadjs.svg" width="250px">

LoadJS is a tiny async loader for modern browsers (590 B gzipped).

[![Build Status](https://travis-ci.org/muicss/loadjs.svg?branch=master)](https://travis-ci.org/muicss/loadjs)
[![Dependency Status](https://david-dm.org/muicss/loadjs.svg)](https://david-dm.org/muicss/loadjs)
[![devDependency Status](https://david-dm.org/muicss/loadjs/dev-status.svg)](https://david-dm.org/muicss/loadjs#info=devDependencies)

## Directory structure

<pre>
loadjs/
├── dist
|   ├── loadjs.js
|   └── loadjs.min.js
├── examples/
├── gulpfile.js
├── main.js
├── package.json
├── LICENSE.md
├── README.md
├── src
|   └── loadjs.js
├── test/
</pre>

## Introduction



## Documentation

```javascript
// load a single file
loadjs('foo.js', function() {
  // foo.js loaded
});


// load multiple files
loadjs(['foo.js', 'bar.js'], function() {
  // foo.js & bar.js loaded
});


// add a bundle id
loadjs(['foo.js', 'bar.js'], 'foobar', function() {
  // foo.js & bar.js loaded
});


// add a failure callback
loadjs(['foo.js', 'bar.js'],
       'foobar',
       function() { /* foo.js & bar.js loaded */ },
       function(pathsNotFound) { /* at least one path didn't load */ });


// execute a callback after bundle finishes loading
loadjs(['foo.js', 'bar.js'], 'foobar');

loadjs.ready('foobar', function() {
  // foo.js & bar.js loaded
});


// .ready() can be chained together
loadjs('foo.js', 'foo');
loadjs('bar.js', 'bar');

loadjs
  .ready('foo', function() {
    // foo.js loaded
  })
  .ready('bar', function() {
    // bar.js loaded
  });


// compose more complex dependency lists
loadjs('foo.js', 'foo');
loadjs('bar.js', 'bar');
loadjs(['thunkor.js', 'thunky.js'], 'thunk');


// wait for multiple depdendencies
loadjs.ready(['foo', 'bar', 'thunk'],
             function() {
               // foo.js & bar.js & thunkor.js & thunky.js loaded
             },
             function(depsNotFound) {
               if (depsNotFound.indexOf('foo') > -1) {};  // foo failed
               if (depsNotFound.indexOf('bar') > -1) {};  // bar failed
               if (depsNotFound.indexOf('thunk') > -1) {};  // thunk failed
             });


// use .done() for more control
loadjs.ready('my-awesome-plugin', function() {
  myAwesomePlugin();
});

loadjs.ready('jquery', function() {
  // plugin requires jquery
  window.myAwesomePlugin = function() {
    if (!window.jQuery) throw "jQuery is missing!";
  };
  
  // plugin is done loading
  loadjs.done('my-awesome-plugin');
});
```

## Development Dependencies

 * nodejs (http://nodejs.org/)
 * npm (https://www.npmjs.org/)
