/**
* Handles Error Defintions
*/


/**
* Creates Error classes
*
* @param  {String}  message
* @return   {Error}
*/
function defineError(message) {
  var _Error = function(customMessage) {
    this.message = JSON.stringify({
      message: customMessage || message
    });
  }
  _Error.prototype = Object.create(Error.prototype);
  _Error.prototype.constructor = _Error;
  return _Error;
}


// Error Defintions
exports = module.exports = {
  PackageJSONNotFoundError: defineError("package.json not found"),
  PackageVersionNotFoundError: defineError("Package version does not exit")
};
