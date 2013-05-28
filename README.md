object-store
============

In Memory Object Store which supports redis, memcached, and lru-cache


## Install

    npm install object-store


## Create a store
===================

### RedisStore
  
    var store = ObjectStore.create('redis');


### MemcachedStore

    var store = ObjectStore.create('memcached');


### MemoryStore

    var store = ObjectStore.create('memory');


## Store Methods
===================

### Get

    store.get("hello", function(err, resp) { ... })

### Set 

    store.set("hello", {hello: 'world'}, function(err, resp) { ... });

### Keys

    store.keys("*", function(err, resp) { ... });

### Delete

    store.del("hello", function(err, resp) { ... });

### Has 

    store.has("hello", function(err, resp) { ... });

### Delete all

    store.flush(function(err, resp) { ... });


## License

    MIT

