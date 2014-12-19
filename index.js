/**
* OFFLINE NODE PACKAGE MANAGER (ONPM)
*
* @author   GochoMugo
* @email     mugo@forfuture.co.ke
* @url         https://github.com/forfuture-dev/onpm
*/


// Module imports
var debug = require("debug")("onpm:index");
var lib = require("./lib");
var path = require("path");


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
  version = version || "";
  // install from cache
  lib.cache.installFromCache(pkg, version, "", function(error) {
    if (! error) {return console.log("installed");}
    // installing from npm
    lib.npm.installPackage(pkg, version, function(error) {
      if (error) {return console.log("npm failed");}
      debug("No such package [%s] found in cache", pkg);
      debug("installing %s using npm", pkg);
      lib.npm.installPackage(pkg, function(error) {
        if (error) {return console.log("Npm fucked: " + error);}
        lib.storeIntoCache(pkg, function(error) {
          if (error) {return console.log("could not store into cache");}
          return console.log("stored into cache");
        });
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
  childProcess.exec("npm install -g onpm", function(error) {
    if (error) {return console.log("Could not upgrade");}
    return console.log("upgraded");
  });
};
