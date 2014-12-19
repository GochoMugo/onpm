#!/usr/bin/env node

var debug = require("debug")("onpm:cli");
var pkg = require("../package.json");
var onpm = require("../index");


debug("invoking CLI");
require("simple-argparse")
  .description("OFFLINE Node Package Manager")
  .version(pkg.version)
  .option("install <pkg>", "install packages from cache/registry",
    onpm.installPackages)
  .option("update", "update packages in cache",
    onpm.updateCache)
  .option("upgrade", "upgrade ONPM itself",
    onpm.upgrade)
  .epilog("See " + pkg.homepage + " for more information")
  .parse()
