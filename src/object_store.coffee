
events    = require('events')

# parent class for all kinds of caches.. 
# show interfaces for those .. 
# 

class ObjectStore extends events.EventEmitter
  @JSON_OBJECT_PREFIX: "br_json_obj:" # 12

  constructor: (location=null) ->
    # body...
  

  set: (key, value, callback) ->
    throw new Error("Not implemented")
  
  get: (key, callback) ->
    throw new Error("Not implemented")
  
  del: (key, callback) ->
    throw new Error("Not implemented")

  has: (key, callback) ->
    throw new Error("Not implemented")
  
  keys: (pattern, callback) ->
    throw new Error("Not implemented")

  flush: (callback) ->
    throw new Error("Not implemented")


  #
  # Helper methods .. 
  # 

  getStringKey: (key) ->
    if typeof key is 'object'
      JSON.stringify(key) 
    else
      key


module.exports = ObjectStore

