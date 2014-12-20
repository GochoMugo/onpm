/**
* OFFLINE NODE PACKAGE MANAGER (ONPM)
*
* @author   GochoMugo
* @email     mugo@forfuture.co.ke
* @url         https://github.com/forfuture-dev/onpm
*/


// Module imports
var logger = require("custom-logger");
var debug = require("debug")("onpm:index");
var lib = require("./lib");
var path = require("path");


// Configuring the Console logger
logger.config({
  format: "[%timestamp%] %event%: %padding% %message%"
});


/**
* Install package into current working directory
* Tasks:
* 1. Try copy package from cache
* 2. If that fails, try "npm install" instead
*
* @param  {String}  pkg
* @param  {String}  version
*/
function installPackage(pkg, version) {
  debug("installing %s@%s", pkg, version);
  logger.info("installing: " + pkg + "@" + (version || "latest"));
  version = version || "";
  // install from cache
  lib.cache.installFromCache(pkg, version, "", function(error) {
    if (! error) {return logger.info("installed into node_modules: " + pkg);}
    logger.warn("not in cache. installing using npm: " + pkg);
    // installing from npm
    lib.npm.installPackage(pkg, {version: version}, function(error) {
      if (error) {return logger.error("npm failed us. Error being, " + error);}
      logger.info("installed into node_modules: " + pkg);
      lib.cache.storeIntoCache(pkg, function(error) {
        if (error) {return logger.error("could not store into cache: " + pkg);}
        return logger.info("stored into cache: " + pkg);
      });
    });
  });
}
exports.installPackage = installPackage;


/**
* Installs numerous packages
* Iterates over all the arguments passed, calling installPackage on each
* Passed package names may be in the following forms:
*   - package_name
*   - package_name@version
*/
function installPackages() {
  debug("installing packages");
  logger.info("processing packages");
  var regexp = /(.*)@(.*)/;
  for (var arg in arguments) {
    if (regexp.test(arguments[arg])) {
      var parts = regexp.exec(arguments[arg]);
      installPackage(parts[1], parts[2]);
    } else {
      installPackage(arguments[arg]);
    }
  }
}
exports.installPackages = installPackages;


/**
* Allow upgrading onpm, itself
*/
exports.upgrade = function() {
  debug("upgrading onpm");
  logger.warn("Attempting to upgrade onpm (myself!)");
  lib.npm.installPackage("onpm", {flags: ["-g"]}, function(error) {
    if (error) {return logger.error("I could not upgrade! May be I need sudo.");}
    return logger.info("Wow! I'm upgraded!");
  });
};
