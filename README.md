# LoadJS

<img src="https://www.muicss.com/static/images/loadjs.svg" width="250px">

LoadJS is a tiny async loader for modern browsers (566 bytes).

[![Dependency Status](https://david-dm.org/muicss/loadjs.svg)](https://david-dm.org/muicss/loadjs)
[![devDependency Status](https://david-dm.org/muicss/loadjs/dev-status.svg)](https://david-dm.org/muicss/loadjs#info=devDependencies)

## Introduction

LoadJS is a tiny async loading library for modern browsers (IE9+). It has a simple yet powerful dependency management system that lets you fetch files in parallel and execute code after the dependencies have been met. The recommended way to use LoadJS is to include the minified source code in your &lt;html&gt; and then use the `loadjs` global to manage JavaScript dependencies after pageload.

LoadJS is based on the excellent <a href="https://github.com/ded/script.js">$script</a> library by <a href="https://github.com/ded">Dustin Diaz</a>. We kept the behavior of the library the same but we re-wrote the code from scratch to add support for success/failure callbacks and to optimize the library for modern browsers. LoadJS is 566 bytes (minified + gzipped).

Here's an example of what you can do with LoadJS:

```javascript
// define a dependency bundle
loadjs(['foo.js', 'bar.js'], 'foobar');

// execute code elsewhere when the bundle has loaded
loadjs.ready('foobar', function() {
  // foo.js & bar.js loaded
});
```

The latest version of LoadJS can be found in the `dist/` directory in this repository:
 * [loadjs.js](https://raw.githubusercontent.com/muicss/loadjs/master/dist/loadjs.js)
 * [loadjs.min.js](https://raw.githubusercontent.com/muicss/loadjs/master/dist/loadjs.min.js)

## Browser Support 

 * IE9+
 * Opera 12+
 * Safari 5+
 * Chrome
 * Firefox
 * iOS 6+
 * Android 4.4+

## Documentation

```javascript
// load a single file
loadjs('foo.js', function() {
  // foo.js loaded
});


// load multiple files (in parallel)
loadjs(['foo.js', 'bar.js'], function() {
  // foo.js & bar.js loaded
});


// load multiple files (in series)
loadjs('foo.js', function() {
  loadjs('bar.js', function() {
    // foo.js loaded then bar.js loaded
  });
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

## Development Quickstart

1. Install dependencies
 
  * nodejs (http://nodejs.org/)
  * npm (https://www.npmjs.org/)
  * http-server (via npm)

1. Clone repository

  ```bash
  $ git clone git@github.com:muicss/loadjs.git
  $ cd loadjs
  ```

1. Install node dependencies using npm

  ```bash
  $ npm install
  ```

1. Build examples

  ```bash
  $ ./node_modules/.bin/gulp build-examples
  ```
  
  To view the examples you can use any static file server. To use the `nodejs` http-server module:
  
  ```bash
  $ npm install http-server
  $ ./node_modules/.bin/http-server -p 3000
  ```
  
  Then visit http://localhost:3000/examples
  
## Run tests

To run the browser tests first build the `loadjs` library:

```bash
$ ./node_modules/.bin/gulp build-test
```

Then visit http://localhost:3000/test
