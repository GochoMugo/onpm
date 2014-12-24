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
var prettydata = require("pretty-data").pd;
var rimraf = require("rimraf");
var semverCompare = require("semver-compare");
var errors = require("./errors");


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
    if ((! version) || (version === "latest")) {
      files = files.sort(semverCompare);
      version = files[files.length - 1];
      if (! version) {
        return callback(new errors.PackageVersionNotFoundError());
      }
    } else if (! lodash.contains(files, version)) {
      return callback(new errors.PackageVersionNotFoundError());
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
* Reads a package's `package.json` and returns an object of the content
* A `package.json` is looked into directoryPath. Returns null if no
* `package.json` is not found
*
* @param  {String}  directoryPath
* @return {Object|null}
*/
function readPackageJSON(directoryPath) {
  var jsonFile = path.join(directoryPath, "package.json");
  try {
    return require(jsonFile);
  } catch(error) {
    return null;
  }
}


/**
* Writes coten to `package.json` at directoryPath
* Returns the written JSON
* NOTE: json will be passed whether or not the error occurred
*
* @param  {String}  directoryPath
* @param  {Object} object
* @param  {Function} callback(err, json)
*/
function writePackageJSON(directoryPath, object, callback) {
  var json = JSON.stringify(object);
  json = prettydata.json(json);
  fs.writeFile(path.join(directoryPath, "package.json"), json, function(error) {
    debug("writing package.json ! path: %s ! error: %s", directoryPath, error);
    return callback(error, json);
  });
}


/**
* Gets a version number of a package.
*
* @param  {String}  directoryPath
* @return   {String}  version
*/
function getVersion(directoryPath) {
  return readPackageJSON(directoryPath).version;
}
exports.getVersion = getVersion;


/**
* Adds a package to `dependencies` or `devDependencies` of a
* `package.json`
*
* @param  {String}  jsonPath
* @param  {String}  flag
* @param  {String}  name
* @param  {String}  version
* @param  {Function} callback
*/
function savePackage(jsonPath, flag, name, version, callback) {
  var obj = readPackageJSON(jsonPath);
  if (obj === null) {
    return callback(new errors.PackageJSONNotFoundError());
  }
  var key = (flag === "--save") ? "dependencies" : "devDependencies";
  obj[key] = obj[key] || {};
  obj[key][name] = "^" + version;
  writePackageJSON(jsonPath, obj, callback);
}


/**
* Installs package into the directoryPath
* If "options.directoryPath" is passed, it will be installed to the
* "node_modules" directory. If "options.type" is passed, package.json will
* be modified to add the package.
*
* @param  {String}  name
* @param  {String}  version
* @param  {Object}  options [.directoryPath, .type]
* @param  {Function} callback(err)
*/
exports.installFromCache = function(name, version, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  getPackagePath(name, version, function(err, packagePath, info) {
    if (err) {return callback(err);}
    var destPath = path.join(getModulesPath(options.directoryPath), name);
    copyDirectory(packagePath, destPath, function(err) {
      if (err) {return callback(error);}
      if (! options.type) {return callback(null);}
      debug("saving package into package.json");
      version = readPackageJSON(destPath).version;
      savePackage(process.cwd(), options.type, name, version, callback);
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
