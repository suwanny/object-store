
var MemcachedStore  = require('./lib/memcached_store');
var RedisStore      = require('./lib/redis_store');
var MemoryStore     = require('./lib/memory_store');
var DeferredStore   = require('./lib/deferred_store');


module.exports.MemcachedStore = MemcachedStore
module.exports.RedisStore     = RedisStore
module.exports.MemoryStore    = MemoryStore
module.exports.DeferredStore  = DeferredStore

module.exports.create = function(type, location) {
  var store;
  if (type === "redis") {
    store = new RedisStore(location);
  }
  else if (type === "memcached") {
    store = new MemcachedStore(location);
  }
  else {
    // default is in-memory .. 
    store = new MemoryStore(location);
  }
  return store;
}

