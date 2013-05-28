
Memcached   = require('memcached')
microtime   = require('microtime')
ObjectStore = require('./object_store')
Async       = require('async')
_           = require('lodash')

class MemcachedStore extends ObjectStore

  constructor: (location='localhost:11211') ->
    @memcached = new Memcached(location)
    @default_expire = 10000
  #
  # Common cache methods 
  # 

  get: (key, callback) ->
    @memcached.get key, (err, data) ->
      throw err if err 
      callback(err, data)


  set: (key, value, callback) ->
    expire = @default_expire
    @memcached.set key, value, expire, (err, result) ->
      throw err if err 
      callback(err, result)
  
  
  del: (key, callback) ->
    @memcached.del key, (err, result) ->
      throw err if err 
      callback(err, result)
  
  
  has: (key, callback) ->
    @memcached.get key, (err, data) ->
      throw err if err 
      res = if data is false then false else true
      callback(err, res)
  

  # memcached doesn't support the pattern yet.. 
  # I would add it later.. but it wouldn't be efficient .. 
  # 
  keys: (pattern="*", callback) ->
    @items (err, items) =>
      throw err if err 
      # pick the first item because we only use one server
      # if there are multiple, then we have to combine all .. 
      my_item   = items[0] 
      server    = my_item.server
      slab_ids  = Object.keys(my_item)
      slab_ids.pop() # remove server
      @getSlabKeys(server, slab_ids, callback)
      
   
  getSlabKeys: (server, slab_ids, callback) ->
    self = this
    # create task functions
    all_keys = []
    tasks = for id in slab_ids
      do (id, server) ->
        (async_callback) -> self.cachedump(server, id, (err, result) ->
          all_keys = all_keys.concat(result)
          async_callback(err, result)
        )

    Async.series tasks, (err) ->
      _keys = _.map(all_keys, (item) -> item.key)
      callback(err, _keys)
      
    
  # Memcached specific 
  cachedump: (server, slab_id, callback) ->
    @memcached.cachedump server, +slab_id, 0, (err, res) ->
      ret = if res instanceof Array then res else [res]
      callback(err, ret)


  flush: (callback) -> @memcached.flush(callback)
    

  flushAll: (callback) ->
    self      = this
    fnFlush   = (cb) -> self.memcached.flushAll(cb)
    fnKeys    = (res, cb) -> self.keys("", cb)
    fnDelAll  = (keys, cb) ->
      tasks = for k in keys
        do (k) -> (cb) ->self.memcached.del(k, cb)
      Async.parallel(tasks, cb)

    Async.waterfall([fnFlush, fnKeys, fnDelAll], callback)
  
  

  items: (callback) ->
    @memcached.items (err, result) ->
      throw err if err 
      callback(err, result)
   
  quit: () -> @memcached.end()

  
  
  
module.exports = MemcachedStore

