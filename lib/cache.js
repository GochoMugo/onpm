/**
* File System Utilities
*/


// Module imports
var debug = require("debug")("onpm:fs");
var fs = require("fs");
var lodash = require("lodash");
var mkdirp = require("mkdirp");
var ncp = require("ncp");
var path = require("path");
var rimraf = require("rimraf");
var semverCompare = require("semver-compare");


/**
* Returns the home directory using the $HOME variable
*
* @return   {String}
*/
function getHomePath() {
  return process.env.HOME;
}
exports.getHomePath = getHomePath;


/**
* Returns the Cache directory
*
* @return   {String}
*/
function getCachePath() {
  if (process.env.ONPM_CACHE) {return process.env.ONPM_CACHE;}
  return path.join(getHomePath(), ".onpm");
}
exports.getCachePath = getCachePath;


/**
* Returns path where a package is installed. If version is passed, the
* specific version is looked for.
*
* @param  {String}  pkg
* @param  {String}  version
* @param  {Function} callback(err, path)
*/
function getPackagePath(pkg, version, callback) {
  if (typeof version === "function") {
    callback = version;
    version = "";
  }
  var pkgPath = path.join(getCachePath(), pkg);
  fs.readdir(pkgPath, function(err, files) {
    if (err) {return callback(err);}
    if (! version) {
      files = files.sort(semverCompare);
      version = files[files.length - 1];
      if (! version) {return callback(new Error("does NOT exist"));}
    } else if (! lodash.contains(files, version)) {
      return callback(new Error("does NOT exist"));
    }
    return callback(null, path.join(pkgPath, version));
  });
}
exports.getPackagePath = getPackagePath;


/**
* Copy source into destination, making directories on the way, if they do
* NOT exist
*
* NOTE: that ncp will create any non-existent directories in the path
*
* @param  {String}  source
* @param  {String}  destination
* @param  {Function} callback(err)
*/
function copyDirectory(source, destination, callback) {
  // we need to wrap ncp in mkdirp to create destination "paths" beforehand
  debug("preparing destination: %s", destination);
  mkdirp(destination, function(mkdirpError) {
    if (mkdirpError) {return callback(mkdirpError);}
    debug("copying from %s to %s", source, destination);
    ncp.ncp(source, destination, {stopOnErr: true}, function(ncpError) {
      if (! ncpError) {return callback(null);}
      // cleaning up
      debug("errored copying. cleaning up, removing: %s", destination);
      rimraf(destination, function(rimrafError) {
        return callback(rimrafError || ncpError);
      }); // rimraf()
    }); // ncp()
  });
}
exports.copyDirectory = copyDirectory;


/**
* Returns the path to the "node_modules" directory in the current working
* directory or the directoryPath specified
*
* @param  {String}  directoryPath
* @return   {String}
*/
function getModulesPath(directoryPath) {
  directoryPath = directoryPath || process.cwd();
  return path.join(directoryPath, "node_modules");
}
exports.getModulesPath = getModulesPath;


/**
* Gets a version number of a package.
* A `package.json` is looked into directoryPath.
*
* @param  {String}  directoryPath
* @return   {String}  version
*/
function getVersion(directoryPath) {
  jsonFile = path.join(directoryPath, "package.json");
  return require(jsonFile).version;
}
exports.getVersion = getVersion;


/**
* Copying Package into the DirectoryPath or the current working directory
* If "directoryPath" is passed, it will be installed to the "node_modules"
* directory
*
* @param  {String}  name
* @param  {String}  version
* @param  {String}  directoryPath
* @param  {Function} callback(err)
*/
exports.installFromCache = function(name, version, directoryPath, callback) {
  if (typeof directoryPath === "function") {
    callback = directoryPath;
    directoryPath = null;
  }
  getPackagePath(name, version, function(err, packagePath) {
    if (err) {return callback(err);}
    var destPath = directoryPath
      ? path.join(directoryPath, "node_modules", name)
      : path.join(getModulesPath(), name);
    copyDirectory(packagePath, destPath, function(err) {
      if (err) {return callback(error);}
      return callback(null);
    });
  });
};


/**
* Copying package into cache
*
* @param  {Function}  callback(err)
*/
exports.storeIntoCache = function(name, sourcePath, callback) {
  if (typeof sourcePath === "function") {
    callback = sourcePath;
    sourcePath = path.join(process.cwd(), "node_modules", name);
  }
  var version = getVersion(sourcePath);
  var destPath = path.join(getCachePath(), name, version);
  copyDirectory(sourcePath, destPath, callback);
};
