
"use strict";

var ObjectStore = require('../index')
var Async       = require('async');
var store       = ObjectStore.create('memcached');

Async.waterfall([
  function(callback) {
    store.keys("*", callback);
  },
  function(resp, callback) {
    console.info('keys', resp);
    store.set("hello", {hello: 'world'}, callback);
  },
  function(resp, callback) {
    console.info('set', resp);
    store.has("hello", callback);
  },
  function(resp, callback) {
    console.info('has', resp);
    store.get("hello", callback);
  },
  function(resp, callback) {
    console.info('get', resp);
    store.del("hello", callback);
  },
  function(resp, callback) {
    console.info('del', resp);
    store.keys("*", callback);
  }
], function(err, resp) {
  if (err) {
    console.error(err);
    console.trace(err);
    throw err;
  }
  console.info('keys', resp);
  store.quit();
})