"use strict";

var ObjectStore = require('../index')
var store       = new ObjectStore.DeferredStore('');


store.keys("*")
.then(function(data){
  console.info('keys', data);
  return store.set("hello", {hello: 'world'});
})
.then(function(data){
  console.info('set', data);
  return store.keys("*");
})
.then(function(data){
  console.info('keys', data);
  return store.has("hello");
})
.then(function(data){
  console.info('has', data);
  return store.get("hello");
})
.then(function(data){
  console.info('get', data);
  return store.del("hello");
})
.then(function(data){
  console.info('del', data);
  return store.flush("*");
})
.then(function(data){
  console.info('flush', data);
  return store.keys("*");
})
.then(function(data){
  console.info('keys', data);
})
.fail(function(err){
  console.error(err);
  console.trace(err);
})
.done(function(){
  store.quit();
});

