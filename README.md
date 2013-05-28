object-store
============

In Memory Object Store which supports redis, memcached, and lru-cache


## Install

    npm install object-store


## Create a store
===================

### Callback based

    var ObjectStore = require('object-store')
    var store = ObjectStore.create('redis'); // redis
    var store = ObjectStore.create('memcached'); // memcached
    var store = ObjectStore.create('memory'); // memory


### Deferred (based on Promise)
    
    var DeferredStore = require('object-store').DeferredStore;
    var store = new DeferredStore('redis');
    var store = new DeferredStore('memcached');
    var store = new DeferredStore('memory');


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

