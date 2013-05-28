
MemcachedStore  = require('./memcached_store')
RedisStore      = require('./redis_store')
MemoryStore     = require('./memory_store')
Q               = require('q')

deferredHander = (deferred) ->
  (err, res) -> if err? then deferred.reject(err) else deferred.resolve(res)


class DeferredStore
  constructor: (type, location) ->
    @store = switch type 
      when "redis"      then new RedisStore(location)
      when "memcached"  then new MemcachedStore(location)
      else new MemoryStore(location)


  keys: (filter="*") ->
    deferred = Q.defer()
    @store.keys(filter, deferredHander(deferred))
    deferred.promise

  set: (key, value) ->
    deferred = Q.defer()
    @store.set(key, value, deferredHander(deferred))
    deferred.promise
  
  get: (key) ->
    deferred = Q.defer()
    @store.get(key, deferredHander(deferred))
    deferred.promise
  
  has: (key) ->
    deferred = Q.defer()
    @store.has(key, deferredHander(deferred))
    deferred.promise
  
  del: (key) ->
    deferred = Q.defer()
    @store.del(key, deferredHander(deferred))
    deferred.promise
  
  flush: () ->
    deferred = Q.defer()
    @store.flush(deferredHander(deferred))
    deferred.promise
  
  quit: () -> @store.quit()
  
  
  
  
module.exports = DeferredStore

