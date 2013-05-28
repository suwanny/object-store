
LRU           = require('lru-cache')
ObjectStore   = require('./object_store')

class MemoryStore extends ObjectStore
  constructor: (location=null) ->
    @cache = LRU()

  #
  # Common cache methods 
  # 

  set: (key, value, callback) ->
    val = switch (typeof value)
      when 'object' then ObjectStore.JSON_OBJECT_PREFIX + JSON.stringify(value)
      else value

    ret = @cache.set(key, val)
    callback(undefined, ret)
  
  get: (key, callback) ->
    prefix_len = ObjectStore.JSON_OBJECT_PREFIX.length      
    data = @cache.get(key)
    if data?.substring(0,prefix_len) is ObjectStore.JSON_OBJECT_PREFIX
      obj = JSON.parse(data.substring(prefix_len))
      callback(undefined, obj)
    else
      callback(undefined, data)

  
  del: (key, callback) ->
    val = @cache.del(key)
    callback(undefined, val)
  
  has: (key, callback) ->
    val = @cache.has(key)
    callback(undefined, val)
  
  keys: (pattern, callback) ->
    val = @cache.keys()
    callback(undefined, val)

  #
  # LRU specific methods .. 
  # 

  flush:  (callback) -> 
    @cache.reset()
    callback(null, true)

  clear:  () -> @cache.reset()

  reset:  () -> @cache.reset()

  size:   () -> @cache.keys().length

  quit: () ->


module.exports = MemoryStore 