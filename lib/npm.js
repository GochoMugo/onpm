/**
* Handles "npm" functionalities/commands such as "npm install package"
*/


// Module imports
var childProcess = require("child_process");
var debug = require("debug")("onpm:npm");
var path = require("path");
var semverCompare = require("semver-compare");


/**
* Installs package using "npm" i.e. npm install <package>
*
* @param  {String}  package
* @param  {String}  version
* @param  {Function} callback(err)
*/
function installPackage(pkg, version, callback) {
  debug("npm installing package: %s", pkg);
  version = version || "";
  childProcess.exec("npm install " + pkg + " " + version, function(error) {
    debug("npm installed [%s], successful? %s", pkg, ! error);
    return callback(error);
  });
}
exports.installPackage = installPackage;
