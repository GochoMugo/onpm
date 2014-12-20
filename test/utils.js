/**
* Test Utilities
*/


// Module Imports
var fs = require("fs");
var mkdirp = require("mkdirp");
var path = require("path");
var rimraf = require("rimraf");


/**
* Creates a Cache, if not created yet, at "cachePath".
* If "packages" is passed, each is created in cache.
* SYNCHRONOUS
*
* @param  {String}  cachePath
* @param  {Array}   [packages]
*/
exports.makeCache = function(cachePath, packages) {
  mkdirp.sync(cachePath);
  if (packages) {
    for (var pkg in packages) {
      mkdirp.sync(path.join(cachePath, packages[pkg]));
    }
  }
};


/**
* Creating Directories. Just a thin wrapper for mkdirp.sync()
*
* @param  {String}  directoryPath
*/
exports.makeDir = function(directoryPath) {
  mkdirp.sync(directoryPath);
};


/**
* Thin wrapper for removing made caches and packages.
* SYNCHRONOUS
*
* @param  {String}  cachePath
*/
exports.remove = function(cachePath) {
  rimraf.sync(cachePath);
};


/**
* Writes some JSON to a file at the directoryPath specified
* SYNCHRONOUS
* THROWS ERROR
*
* @param  {String} directoryPath
* @param  {JSON|Object} content
*/
exports.writeJSON = function(directoryPath, content) {
  fs.writeFileSync(directoryPath, JSON.stringify(content));
};
