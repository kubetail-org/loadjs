/**
 * Test helpers
 * @module test/helpers
 */


/** Define module API */
module.exports = {
  initDOM: function() {
    // initialize jsdom if document is undefined
    if (typeof (document) === "undefined") {
      var jsdom = require('mocha-jsdom'),
          html,
          features,
          config;

      html = [
        '<!doctype html>',
        '<html>',
        '  <head></head>',
        '  <body></body>',
        '</html>'];
      html = html.join('\n');

      features = {
        FetchExternalResources: ['script'],
        ProcessExternalResources: ['script'],
        MutationEvents: ['2.0'],
        SkipExternalResources: false
      };

      jsdom({
        html: html,
        url: __dirname,
        features: features,
        done: function(errors, window) {
          console.log(errors);
        }
      });
    }
  }
}
