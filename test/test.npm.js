/**
* testing the npm functionalities
*/


// module imports
var fs = require("fs");
var npm = require("../lib").npm;
var should = require("should");
var testUtils = require("./utils");


describe(".installPackage()", function() {
  this.timeout(0);

  it("should install package into a node_modules directory in cwd",
  function(done) {
    npm.installPackage("sequential-ids", function(error) {
      should(error).not.be.ok;
      var installLoc = process.cwd() + "/node_modules/sequential-ids";
      fs.existsSync(installLoc).should.be.ok;
      testUtils.remove(installLoc);
      done();
    });
  });

  it("should install package with a specific version, if passed", function(done) {
    npm.installPackage("sequential-ids", {version: "0.0.0-alpha.1.0"}, function(error) {
      should(error).not.be.ok;
      var installLoc = process.cwd() + "/node_modules/sequential-ids";
      fs.existsSync(installLoc).should.be.ok;
      require(installLoc + "/package.json").version.should.eql("0.0.0-alpha.1.0");
      testUtils.remove(installLoc);
      done();
    })
  });

  describe("should use any flags if passed", function() {
    // we must ensure our package.json is not touched
    var cwd = process.cwd();
    var jsonFile = cwd + "/package.json";
    var origContent = fs.readFileSync(jsonFile);

    after(function() {
      fs.unlinkSync(jsonFile);
      fs.writeFileSync(jsonFile, origContent);
    });

    it("changes the package.json", function(done) {
      npm.installPackage("sequential-ids", {flags: ["--save"]}, function(error) {
        should(error).not.be.ok;
        var installLoc = cwd + "/node_modules/sequential-ids";
        var jsonContent = require(cwd + "/package.json");
        fs.existsSync(installLoc).should.be.ok;
        should(jsonContent.dependencies["sequential-ids"]).be.ok;
        testUtils.remove(installLoc);
        done();
      });
    });

  });
});
