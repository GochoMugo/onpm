/**
* Testing the Cache
*/


// Module imports
var cache = require("../lib").cache;
var fs = require("fs");
var path = require("path");
var should = require("should");
var testUtils = require("./utils");


// Module variables
var node_modulesPath = __dirname + "/node_modules";


// NOTE: repeatedly creating and removing directories with the same
// name usually throws errors. So we do such tasks when test starts
// and ends
before(function() {
  testUtils.makeDir(node_modulesPath);
});


after(function() {
  testUtils.remove(node_modulesPath);
});


describe(".getHomePath()", function() {
  it("should return a string", function() {
    cache.getHomePath().should.be.a.String;
  });
});


describe(".getCachePath()", function() {
  it("should return a string", function() {
    cache.getCachePath().should.be.a.String;
  });
  it("should detect the environment variable ONPM_CACHE", function() {
    process.env.ONPM_CACHE = "/some/path/to/cache";
    cache.getCachePath().should.eql(process.env.ONPM_CACHE);
    delete process.env.ONPM_CACHE;
  });
});


describe(".getPackagePath()", function() {
  var cachePath = __dirname + "/test_getCachePath";

  before(function() {
    process.env.ONPM_CACHE= cachePath;
    testUtils.makeCache(cachePath, [
      "packageA/0.0.1", "packageA/1.0.0"
    ]);
  });

  after(function() {
    testUtils.remove(cachePath);
    delete process.env.ONPM_CACHE;
  });

  it("should pass an absolute path to callback, if successful", function(done) {
    cache.getPackagePath("packageA", "0.0.1", function(err, _path) {
      should(err).not.be.ok;
      var packagePath = path.join(cachePath, "packageA", "0.0.1");
      _path.should.eql(path.resolve(packagePath));
      done();
    });
  });

  it("should allow version being left out", function(done) {
    should(function() {
      cache.getPackagePath("packageA", function(err, _path) {
        should(err).not.be.ok;
        _path.should.be.ok;
        done();
      });
    }).not.throw();
  });

  it("should return path to the latest package version installed",
  function(done) {
    cache.getPackagePath("packageA", function(err, _path) {
      should(err).not.be.ok;
      _path.should.be.containEql("1.0.0").and.not.containEql("0.0.1");
      done();
    });
  });

  it("should pass an error to callback if the package version is not in cache",
  function(done) {
    cache.getPackagePath("packageA", "2.0.0", function(err, _path) {
      err.should.be.ok;
      should(_path).not.be.ok;
      done();
    });
  });

  it("should pass an error to callback if no such package is not in cache",
  function(done) {
    cache.getPackagePath("packageB", function(err, _path) {
      err.should.be.ok;
      should(_path).not.be.ok;
      done();
    });
  });

  it("should pass an error to callback if cache is not made yet",
  function(done) {
    process.env.ONPM_CACHE = "/home/non-existant/path";
    cache.getPackagePath("somePackage", function(err, _path) {
      err.should.be.ok;
      should(_path).not.be.ok;
      delete process.env.ONPM_CACHE;
      done();
    });
  });
});


describe(".copyDirectory()", function() {
  var cachePath1 = __dirname + "/test_copyDirectory1";
  var cachePath2 = __dirname + "/test_copyDirectory2";

  before(function() {
    testUtils.makeCache(cachePath1, ["packageA/0.0.0/node_modules"]);
    testUtils.makeDir(cachePath2);
  });

  after(function() {
    testUtils.remove(cachePath1);
    testUtils.remove(cachePath2);
  });

  it("should copy contents from a source path to directory path",
  function(done) {
    cache.copyDirectory(cachePath1 + "/packageA/0.0.0",
      cachePath2, function(err) {
        should(err).not.be.ok;
        fs.existsSync(cachePath2 + "/node_modules").should.be.ok;
        done();
      });
  });

  it("clean up destination, only if it had created it");
});


describe(".getModulesPath()", function() {
  var node_modulesPath = process.cwd() + "/node_modules";

  // It is assumed that there exists a "node_modules" directory already
  // due to installed dependencies. However, if not, create it but it
  // wont be removed afterwards
  before(function() {
    testUtils.makeDir(node_modulesPath);
  });

  it("should return absolute path to node_modules directory in cwd,\
  if path is not passed", function() {
    cache.getModulesPath().should.eql(path.resolve(node_modulesPath));
  });

  it("should return absolute path to node_modules directory in the path,\
  if passed", function() {
    var fake_node_modulesPath = __dirname + "/node_modules";
    cache.getModulesPath(__dirname).should
      .eql(path.resolve(__dirname + "/node_modules"));
  });
});


describe(".getVersion()", function() {
  var testDir = __dirname + "/test_getVersion";

  before(function() {
    testUtils.makeDir(testDir);
    testUtils.writeJSON(testDir + "/package.json", '{"version": "1.1.1"}');
  });

  after(function() {
    testUtils.remove(testDir);
  });

  it("should return the version number of the package at path", function() {
    cache.getVersion(testDir).should.eql("1.1.1");
  });
});


describe(".installFromCache()", function() {
  var cachePath = __dirname + "/test_installFromCache";
  var installLoc = process.cwd() + "/node_modules/packageA";

  before(function() {
    process.env.ONPM_CACHE = cachePath;
    testUtils.makeCache(cachePath, ["packageA/0.1.0"]);
  });

  after(function() {
    testUtils.remove(cachePath);
    testUtils.remove(installLoc);
    delete process.env.ONPM_CACHE;
  });

  it("should install package into cwd, if no path is passed", function(done) {
    cache.installFromCache("packageA", "0.1.0", function (err) {
      should(err).not.be.ok;
      fs.existsSync(installLoc).should.be.ok;
      done();
    });
  });

  it("should install package into path, if passed", function(done) {
    var test_node_modulesPath = __dirname + "/node_modules";
    cache.installFromCache("packageA", "0.1.0", __dirname,
    function(err) {
      should(err).not.be.ok;
      fs.existsSync(test_node_modulesPath + "/packageA").should.be.ok;
      done();
    });
  });

  it("should pass an error if package is not found", function(done) {
    cache.installFromCache("packageA", "0.2.0", function (err) {
      err.should.be.ok;
      done();
    });
  });
});


describe(".storeIntoCache()", function() {
  var cachePath = __dirname + "/test_storeIntoCache";
  var packageDir = __dirname + "/test_storeIntoCache_package";

  before(function() {
    process.env.ONPM_CACHE = cachePath;
    testUtils.makeCache(cachePath);
    testUtils.makeDir(packageDir);
    testUtils.writeJSON(packageDir + "/package.json", '{"version": "0.9.0"}');
  });

  after(function() {
    testUtils.remove(cachePath);
    testUtils.remove(packageDir);
    delete process.env.ONPM_CACHE;
  });

  it.skip("should store package under a directory with its version as name",
  function(done) {
    cache.storeIntoCache("packageA", packageDir, function(err) {
      should(err).not.be.ok;
      console.log(fs.readdirSync(cachePath));
      fs.existsSync(cachePath + "/packageA/0.9.0").should.be.ok;
      done();
    });
  });
});
