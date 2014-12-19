/**
* Tests Integration of the Tool
*/


// Module imports
var onpm = require("../index.js");
var should = require("should");


describe(".installPackage()", function() {
  it("should install the package into the cwd");
  it("should allow version be left out");
});


describe(".installPackages()", function() {
  it("should invoke a install of a package passed");
  it("should allow the format package_name@version for specific versions");
  it("should allow installation of numerous packages");
});


describe(".upgrade()", function() {
  it("should upgrade the tool itself");
});
