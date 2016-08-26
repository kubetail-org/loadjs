# LoadJS

<img src="https://www.muicss.com/static/images/loadjs.svg" width="250px">

LoadJS is a tiny async loader for modern browsers (654 bytes).

[![Dependency Status](https://david-dm.org/muicss/loadjs.svg)](https://david-dm.org/muicss/loadjs)
[![devDependency Status](https://david-dm.org/muicss/loadjs/dev-status.svg)](https://david-dm.org/muicss/loadjs#info=devDependencies)

## Introduction

LoadJS is a tiny async loading library for modern browsers (IE9+). It has a simple yet powerful dependency management system that lets you fetch JavaScript and CSS files in parallel and execute code after the dependencies have been met. The recommended way to use LoadJS is to include the minified source code in your &lt;html&gt; and then use the `loadjs` global to manage JavaScript dependencies after pageload.

LoadJS is based on the excellent <a href="https://github.com/ded/script.js">$script</a> library by <a href="https://github.com/ded">Dustin Diaz</a>. We kept the behavior of the library the same but we re-wrote the code from scratch to add support for success/error callbacks and to optimize the library for modern browsers. LoadJS is 654 bytes (minified + gzipped).

Here's an example of what you can do with LoadJS:

```javascript
// define a dependency bundle
loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar');

// execute code elsewhere when the bundle has loaded
loadjs.ready('foobar', {
  success: function() { /* foo.js & bar.js loaded */ },
  error: function(depsNotFound) { /* foobar bundle load failed */ }
});
```

The latest version of LoadJS can be found in the `dist/` directory in this repository:
 * [loadjs.js](https://raw.githubusercontent.com/muicss/loadjs/master/dist/loadjs.js)
 * [loadjs.min.js](https://raw.githubusercontent.com/muicss/loadjs/master/dist/loadjs.min.js)

You can also use it as a CJS or AMD module:

```bash
$ npm install --save-dev loadjs
```

```javascript
var loadjs = require('loadjs');

loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar');

loadjs.ready('foobar', {
  success: function() { /* foo.js & bar.js loaded */ },
  error: function(depsNotFound) {/* foobar bundle load failed */}
});
```

## Browser Support

 * IE9+ (`async: false` support only works in IE10+)
 * Opera 12+
 * Safari 5+
 * Chrome
 * Firefox
 * iOS 6+
 * Android 4.4+

LoadJS also detects script load failures from AdBlock Plus and Ghostery in:

 * Safari
 * Chrome

Note: LoadJS treats empty CSS files as load failures in IE (to get around lack of support for onerror events on `<link>` tags)

## Documentation

1. Load a single file

  ```javascript
  loadjs('/path/to/foo.js', {
    success: function() { /* foo.js loaded */}
  });
  ```

1. Fetch files in parallel and load them asynchronously

  ```javascript
  loadjs(['/path/to/foo.js', '/path/to/bar.js'], {
    success: function() { /* foo.js & bar.js loaded */ }
  });
  ```

1. Fetch files in parallel and load them in series

  ```javascript
  loadjs(['/path/to/foo.js', '/path/to/bar.js'], {
    success: function() { /* foo.js and bar.js loaded in series */ },
    async: false
  });
  ```

1. Fetch JavaScript and CSS files

  ```javascript
  loadjs(['/path/to/foo.css', '/path/to/bar.js'], {
    success: function() { /* foo.css and bar.js loaded */ }
  });
  ```

1. Add a bundle id

  ```javascript
  loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar', {
    success: function() { /* foo.js & bar.js loaded */ }
  });
  ```

1. Add an error callback

  ```javascript
  loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar', {
    success: function() { /* foo.js & bar.js loaded */ },
    error: function(pathsNotFound) { /* at least one path didn't load */ }
  });
  ```

1. Execute a callback after bundle finishes loading

  ```javascript
  loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar');

  loadjs.ready('foobar', {
    success: function() { /* foo.js & bar.js loaded */ }
  });
  ```

1. Chain .ready() together

  ```javascript
  loadjs('/path/to/foo.js', 'foo');
  loadjs('/path/to/bar.js', 'bar');

  loadjs
    .ready('foo', {
      success: function() { /* foo.js loaded */ }
    })
    .ready('bar', {
      success: function() { /* bar.js loaded */ }
    });
  ```

1. Compose more complex dependency lists

  ```javascript
  loadjs('/path/to/foo.js', 'foo');
  loadjs('/path/to/bar.js', 'bar');
  loadjs(['/path/to/thunkor.js', '/path/to/thunky.js'], 'thunk');

  // wait for multiple depdendencies
  loadjs.ready(['foo', 'bar', 'thunk'], {
    success: function() {
      // foo.js & bar.js & thunkor.js & thunky.js loaded
    },
    error: function(depsNotFound) {
      if (depsNotFound.indexOf('foo') > -1) {};  // foo failed
      if (depsNotFound.indexOf('bar') > -1) {};  // bar failed
      if (depsNotFound.indexOf('thunk') > -1) {};  // thunk failed
    }
  });
  ```
  
1. Use .done() for more control

  ```javascript
  loadjs.ready('my-awesome-plugin', {
    success: function() {
      myAwesomePlugin();
    }
  });

  loadjs.ready('jquery', {
    success: function() {
      // plugin requires jquery
      window.myAwesomePlugin = function() {
        if (!window.jQuery) throw "jQuery is missing!";
      };

      // plugin is done loading
      loadjs.done('my-awesome-plugin');
    }
  });
  ```

## Directory structure

<pre>
loadjs/
├── dist
│   ├── loadjs.js
│   ├── loadjs.min.js
│   └── loadjs.umd.js
├── examples
├── gulpfile.js
├── LICENSE.txt
├── package.json
├── README.md
├── src
│   └── loadjs.js
├── test
└── umd-templates
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
  $ ./node_modules/.bin/gulp examples:build
  ```

  To view the examples you can use any static file server. To use the `nodejs` http-server module:

  ```bash
  $ npm install http-server
  $ ./node_modules/.bin/http-server -p 3000
  ```

  Then visit http://localhost:3000/examples

1. Build distribution files

  ```bash
  $ ./node_modules/.bin/gulp dist:build
  ```

  The files will be located in the `dist` directory.

## Run tests

To run the browser tests first build the `loadjs` library:

```bash
$ ./node_modules/.bin/gulp test:build
```

Then visit http://localhost:3000/test
