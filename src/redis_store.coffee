

redis         = require('redis')
ObjectStore   = require('./object_store')

class RedisStore extends ObjectStore
  
  constructor: (location='localhost:6379', database=7) ->
    [host, port]  = location.split(':')
    @client       = redis.createClient(parseInt(port), host)
    @client.on "error", @makeErrorHandler()
    @select database, ()->
      
  #
  # Common cache methods 
  # 
  
  # support JSON object
  get: (key, callback) ->
    prefix_len = ObjectStore.JSON_OBJECT_PREFIX.length
    @client.get key, (err, data) ->
      if data?.substring(0,prefix_len) is ObjectStore.JSON_OBJECT_PREFIX
        obj = JSON.parse(data.substring(prefix_len))
        callback(err, obj)
      else
        callback(err, data)

  # support JSON object
  set: (key, value, callback) ->
    val = switch (typeof value)
      when 'object' then ObjectStore.JSON_OBJECT_PREFIX + JSON.stringify(value)
      else value
    
    @client.set key, val, (err, res) ->
      ret = if res is 'OK' then true else false
      callback(err, ret)


  del: (key, callback) ->
    @client.del key, (err, res) ->
      ret = if res > 0 then true else false
      callback(err, ret)
  

  has: (key, callback) ->
    @client.exists key, (err, res) ->
      ret = if res is 1 then true else false
      callback(err, ret)
    

  keys: (filter="*", callback) ->
    @client.send_command "keys", [filter], callback
      

  # 
  # Redis specific methods .. 
  # 

  makeErrorHandler: () ->
    (err) => console.error("redis: #{err}")

  info: (callback) ->
    @client.info (err, resp) ->
      return callback(err) if err
      return callback(new Error("Undefined")) unless resp
      lines = resp.trim().split("\n")
      redis_info = _.map(lines, (val) ->
        kv = val.split(":")
        {key: kv[0], value: kv[1]?.trim()}
      ) 
      callback(err, redis_info)
  
  sendCommand: (command, args, callback) ->
    @client.send_command command, args, callback

  flushdb: (callback) -> @client.flushdb callback
  
  flush: (callback) -> @flushdb(callback)

  select: (db, callback) ->
    @client.select db, (err, res) ->
      ret = if res is 'OK' then true else false
      callback(err, ret)
    
  database: () -> @client.selected_db || 0

  quit: () -> @client.quit()
  

module.exports = RedisStore 




