/**
 * path, bundleName
 * bundleCache
 *
 * bundleCache{}
 *   * <bundleName>{}
 *     * waiting[]
 *     * depsNotFound[]
 *
 * callbackQueue[]{}
 *   * waiting[]
 *   * depsNotFound[]
 *   * success
 *   * fail
 *
 * - user defines bundle 
 *   - update entry in bundleCache (add <path> to waiting list)
 *   - add entry to callbackQueue
 *   - load scripts
 *     - remove <path> from waiting list in bundleCache
 *     - if 'error' add to depsNotFound
 *     - if waiting list is empty execute success / fail callbacks
 *       - delete success/fail lists
 *
 * - user calls ready
 *   - check bundleCache
 *     - if waiting list is empty for all bundles, execute callbacks
 *     - else add to callbackQueue
 * 
 */
(function(win, doc) {
  var head = doc.head,
      bundleCache = {},
      callbackQueue = [],
      anonId = 0;


  /**
   * Register callback.
   * @param {Array} deps - List of bundle ids.
   * @param {Function} successFn - Success callback if all deps are loaded.
   * @param {Function} failFn - Fail callback if at least one dep doesn't load.
   */
  function registerCallback(deps, successFn, failFn) {
    var callbackObj, bundleId, bundleObj, i;

    callbackObj = {
      waiting: [],
      depsNotFound: [],
      success: successFn,
      fail: failFn
    };

    // check dependencies
    for (i=deps.length-1; i > -1; i--) {
      bundleId = deps[i];
      bundleObj = bundleCache[deps[i]];

      if (!bundleObj) continue;

      if (bundleObj.depsNotFound.length) {
        callbackObj.depsNotFound.push(bundleId);
      } else {
        callbackObj.waiting.push(bundleId);
      }
    }

    // execute or add to queue
    if (callbackObj.waiting.length === 0) {
      if (callbackObj.depsNotFound.length) {
        // fail
        if (failFn) failFn(callbackObj.depsNotFound);
      } else {
        // success
        if (successFn) successFn();
      }
    } else {
      callbackQueue.push(callbackObj);
    }
  }


  /**
   * Register callback.
   * @param {string} bundleId - The bundle id.
   * @param {string} path - The script's path.
   * @param {string} result - The result of the script load ("load"|"error").
   */
  function updateQueue(bundleId, path, result) {
    var bundleObj = bundleCache[bundleId],
        j,
        k;

    // remove from waiting list
    j = bundleObj.waiting.indexOf(path);
    if (j > -1) bundleObj.waiting.splice(j, 1);
    
    // add to depsNotFound
    if (result === 'error') bundleObj.depsNotFound.push(path);
    
    // exit if not callbacks
    if (bundleObj.waiting.length !== 0) return;

    // execute callbacks
    while (j < callbackQueue.length) {
      callbackObj = callbackQueue[j];
      
      // remove from waiting list
      k = callbackObj.waiting.indexOf(bundleId);
      if (k > -1) callbackObj.waiting.splice(k, 1);
      
      // update depsNotFound
      if (bundleObj.depsNotFound.length) {
        callbackObj.depsNotFound.push(bundleId);
      }
      
      // execute
      if (callbackObj.waiting.length === 0) {
        if (callbackObj.depsNotFound.length) {
          // TODO: use paths for depsNotFound for bundle defined callbacks
          // fail
          if (callbackObj.fail) callbackObj.fail(callbackObj.depsNotFound);
        } else {
          // success
          if (callbackObj.success) callbackObj.success();
        }
        
        // remove from queue
        callbackQueue.splice(j, 1);
        
      } else {
        // increment loop counter
        j += 1;
        
      }
    }
  }


  /**
   * loadScript - Load JavaScript file
   */
  function loadScript(path, bundleId) {
    var s = doc.createElement('script');

    s.style = 'text/javascript';
    s.async = true;
    s.src = path;

    s.onload = s.onerror = function(ev) {
      // remove script
      s.parentNode.removeChild(s);

      // de-reference script
      s = null;

      // update queue
      updateQueue(bundleId, path, ev.type);
    };

    // add to document
    head.appendChild(s);
  }


  /**
   * loadjs - Main function
   */
  function loadjs(paths, idOrSuccess, successOrFail, fail) {
    var id, successFn, failFn, arg, i, bundleObj;
    var args = [idOrSuccess, successOrFail, fail];

    // listify
    paths = paths.push ? paths : [paths];
    
    // get args
    for (i=0; i < 3; i++) {
      arg = args[i];

      // id
      if (i === 0 && arg && !arg.call) {
        id = arg.toString();  // use strings for external ids
        continue;
      }

      // successFn
      if (!successFn) {
        successFn = arg;
        continue;
      }

      // failFn
      if (arg) failFn = arg;
    }

    // generate anonymous id
    if (id === undefined) {
      id = anonId;  // use integers for internal ids
      anonId += 1;
    }

    // check bundleCache
    if (id in bundleCache) {
      throw "LoadJS Error: bundle " + id + " has already been defined.";
    }

    // add to bundleCache
    bundleObj = bundleCache[id] = {
      waiting: paths,
      depsNotFound: [],
      success: [],
      fail: []
    };

    // register callback
    registerCallback([id], successFn, failFn);

    // load scripts
    win.setTimeout(function() {
      for (var i=paths.length - 1; i > -1; i--) loadScript(paths[i], id);
    }, 0);  // fires after window 'load' event
  }


  /**
   * ready - Ready function
   */
  loadjs.ready = function ready(deps, successFn, failFn) {
    // listify
    deps = deps.push ? deps : [deps];

    // register calback
    registerCallback(deps, successFn, failFn);

    // return chainable object
    return loadjs;
  };


  /**
   * done - Done function
   */
  loadjs.done = function done(id) {
  };

  
  // export
  win.loadjs = loadjs;
})(window, document);
