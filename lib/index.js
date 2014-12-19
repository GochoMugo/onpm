/**
* Library entry point
*/


// Module imports
var childProcess = require("child_process");
var debug = require("debug");
var cache = require("./cache");
var npm = require("npm");


// Sub-module exports
exports.cache = cache;
exports.npm = npm;
