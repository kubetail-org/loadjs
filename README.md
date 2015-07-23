# LoadJS

[![Build Status](https://travis-ci.org/muicss/loadjs.svg?branch=master)](https://travis-ci.org/muicss/loadjs)
[![Dependency Status](https://david-dm.org/muicss/loadjs.svg)](https://david-dm.org/muicss/loadjs)
[![devDependency Status](https://david-dm.org/muicss/loadjs/dev-status.svg)](https://david-dm.org/muicss/loadjs#info=devDependencies)

LoadJS is a tiny async loading library for the browser.


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

## Dependencies

 * nodejs (http://nodejs.org/)
 * npm (https://www.npmjs.org/)

## Documentation

```javascript
loadjs('foo.js', function() {
  // foo.js succeeded
});


loadjs('foo.js', 'foo', function() {
         // foo.js succeeded
       },  
       function(depsNotFound) {
         // foo.js failed
       });


loadjs(['foo.js', 'bar.js'], function() {
  // foo.js & bar.js succeeded
});


loadjs(['foo.js', 'bar.js'], 'bundle')
loadjs.ready('bundle', function() {
  // foo.js & bar.js succeeded
});


// create an id and callback inline
loadjs(['foo.js', 'bar.js'], 'bundle', function() {
  // foo.js & bar.js succeeded
});


loadjs('foo.js', 'foo');
loadjs('bar.js', 'bar');
loadjs
  .ready('foo', function() {
    // foo.js succeeded
  })
  .ready('bar', function() {
    // bar.js succeeded
  });


loadjs('foo.js', 'foo');
loadjs('bar.js', 'bar');
loadjs(['thunkor.js', 'thunky.js'], 'thunk');

// wait for multiple depdendencies
loadjs.ready(['foo', 'bar', 'thunk'],
             function() {
                // foo.js & bar.js & thunkor.js & thunky.js succeeded
             },
             function(depsNotFound) {
               if (depsNotFound.indexOf('foo') === -1) {};  // foo failed
               if (depsNotFound.indexOf('bar') === -1) {};  // bar failed
               if (depsNotFound.indexOf('thunk') === -1) {};  // thunk failed
             });


// in my-awesome-plugin.js
loadjs.ready('jquery',
             function() {
               window.myAwesomePlugin = {};  // define awesome jquery plugin

               loadjs.done('my-awesome-plugin');
             },
             function(depsNotFound) {
               // jquery failed
             });


// in index.html
loadjs('jquery.js', 'jquery')
loadjs('my-awesome-plugin.js')
loadjs.ready('my-awesome-plugin', function() {
  // run code here when jquery and my awesome plugin are both finished
})
```
