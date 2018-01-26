# LoadJS

<img src="https://www.muicss.com/static/images/loadjs.svg" width="250px">

LoadJS is a tiny async loader for modern browsers (753 bytes).

[![Dependency Status](https://david-dm.org/muicss/loadjs.svg)](https://david-dm.org/muicss/loadjs)
[![devDependency Status](https://david-dm.org/muicss/loadjs/dev-status.svg)](https://david-dm.org/muicss/loadjs#info=devDependencies)
[![CDNJS](https://img.shields.io/cdnjs/v/loadjs.svg)](https://cdnjs.com/libraries/loadjs)

## Introduction

LoadJS is a tiny async loading library for modern browsers (IE9+). It has a simple yet powerful dependency management system that lets you fetch JavaScript and CSS files in parallel and execute code after the dependencies have been met. The recommended way to use LoadJS is to include the minified source code of [loadjs.js](https://raw.githubusercontent.com/muicss/loadjs/master/dist/loadjs.min.js) in your &lt;html&gt; (possibly in the &lt;head&gt; tag) and then use the `loadjs` global to manage JavaScript dependencies after pageload.

LoadJS is based on the excellent [$script](https://github.com/ded/script.js) library by [Dustin Diaz](https://github.com/ded). We kept the behavior of the library the same but we re-wrote the code from scratch to add support for success/error callbacks and to optimize the library for modern browsers. LoadJS is 753 bytes (minified + gzipped).

Here's an example of what you can do with LoadJS:

```javascript
// define a dependency bundle
loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar');

// execute code when the bundle loads
loadjs.ready('foobar', {
  success: function() { /* foo.js & bar.js loaded */ },
  error: function(depsNotFound) { /* foobar bundle load failed */ }
});
```

Note that if you only want a success callback you can use this simpler syntax instead:

```javascript
// define a dependency bundle
loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar');

// execute code when the bundle loads successfully
loadjs.ready('foobar', function() {
  // foo.js & bar.js loaded
});
```

The latest version of LoadJS can be found in the `dist/` directory in this repository:
 * [loadjs.js](https://cdn.rawgit.com/muicss/loadjs/3.5.2/dist/loadjs.js)
 * [loadjs.min.js](https://cdn.rawgit.com/muicss/loadjs/3.5.2/dist/loadjs.min.js)

You can also use it as a CJS or AMD module:

```bash
$ npm install --save loadjs
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
      success: function() { /* foo.js and bar.js loaded */ }
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

1. Force treating file as CSS stylesheet

    ```javascript
    loadjs(['css!/path/to/cssfile.custom'], {
      success: function() { /* cssfile.custom loaded as stylesheet */ }
    });
    ```

1. Add a bundle id

    ```javascript
    loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar', {
      success: function() { /* foo.js & bar.js loaded */ }
    });
    ```

1. Check if bundle has already been defined

    ```javascript
    if (!loadjs.isDefined('foobar')) {
      loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar', {
        success: function() { /* foo.js & bar.js loaded */ }
      });
    }
    ```

1. Add an error callback

    ```javascript
    loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar', {
      success: function() { /* foo.js & bar.js loaded */ },
      error: function(pathsNotFound) { /* at least one path didn't load */ }
    });
    ```

1. Retry files before calling the error callback

    ```javascript
    loadjs(['/path/to/foo.js', '/path/to/bar.js'], 'foobar', {
      success: function() { /* foo.js & bar.js loaded */ },
      error: function(pathsNotFound) { /* at least one path didn't load */ },
      numRetries: 3
    });
    ```

1. Execute a callback before script tags are embedded

    ```javascript
    loadjs(['/path/to/foo.js', '/path/to/bar.js'], {
      success: function() {},
      error: function(pathsNotFound) {},
      before: function(path, scriptEl) {
        /* called for each script node before being embedded */
        if (path === '/path/to/foo.js') scriptEl.crossOrigin = true;
      }
    });
    ```

1. Bypass LoadJS default DOM insertion mechanism (DOM `<head>`)

    ```javascript
    loadjs(['/path/to/foo.js'], {
      success: function() {},
      error: function(pathsNotFound) {},
      before: function(path, scriptEl) {
        document.body.appendChild(scriptEl);
      
        /* return `false` to bypass default DOM insertion mechanism */
        return false;
      }
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
    loadjs.ready(['dependency1', 'dependency2'], {
      success: function() {
        // run code after dependencies have been met
      }
    });

    function fn1() {
      loadjs.done('dependency1');
    }
  
    function fn2() {
      loadjs.done('dependency2');
    }
    ```

1. Reset dependency trackers

    ```javascript
    loadjs.reset();
    ```

1. Use success callback functions for simplicity

   ```javascript
   loadjs('/path/to/foo.js', 'foo', function() {
     // foo.js loaded
   });

   loadjs.ready('foo', function() {
     // foo.js loaded
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

    * [nodejs](http://nodejs.org/)
    * [npm](https://www.npmjs.org/)
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
    $ npm run build-examples
    ```

    To view the examples you can use any static file server. To use the `nodejs` http-server module:

    ```bash
    $ npm install http-server
    $ npm run http-server -- -p 3000
    ```

    Then visit [http://localhost:3000/examples](http://localhost:3000/examples)

1. Build distribution files

    ```bash
    $ npm run build-dist
    ```

    The files will be located in the `dist` directory.

1. Run tests

     To run the browser tests first build the `loadjs` library:

     ```bash
     $ npm run build-tests
     ```

     Then visit [http://localhost:3000/test](http://localhost:3000/test)

1. Build all files

     ```bash
     $ npm run build-all
     ```

