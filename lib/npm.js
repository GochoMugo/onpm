/**
* Handles "npm" functionalities/commands such as "npm install package"
*/


// Module imports
var childProcess = require("child_process");
var debug = require("debug")("onpm:npm");
var lodash = require("lodash");
var path = require("path");
var semverCompare = require("semver-compare");


/**
* Installs package using "npm" i.e. npm install <package>
*
* @param  {String}  package
* @param  {String}  version
* @param  {Function} callback(err)
*/
function installPackage(pkg, options, callback) {
  debug("npm installing package: %s", pkg);
  if (typeof options === "function") {
    callback = options;
    options = null;
  }
  var pkgName = (options && options.version)
    ? pkg + "@" + options.version
    : pkg;
  var flags = (options && options.flags) ? options.flags : "";
  var args = lodash.flatten(["install", pkgName, flags]);
  console.log(args);
  var installation = childProcess.spawn("npm", args);
  installation.on("error", function(error) {
    return callback(error);
  });
  installation.on("close", function(code) {
    if (code === 0) {return callback(null);}
    return callback(new Error("Exited with a non-zero exit code: " + code));
  });
}
exports.installPackage = installPackage;
