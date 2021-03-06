// Generated by CoffeeScript 1.6.2
(function() {
  var LRU, MemoryStore, ObjectStore,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LRU = require('lru-cache');

  ObjectStore = require('./object_store');

  MemoryStore = (function(_super) {
    __extends(MemoryStore, _super);

    function MemoryStore(location) {
      if (location == null) {
        location = null;
      }
      this.cache = LRU();
    }

    MemoryStore.prototype.set = function(key, value, callback) {
      var ret, val;

      val = (function() {
        switch (typeof value) {
          case 'object':
            return ObjectStore.JSON_OBJECT_PREFIX + JSON.stringify(value);
          default:
            return value;
        }
      })();
      ret = this.cache.set(key, val);
      return callback(void 0, ret);
    };

    MemoryStore.prototype.get = function(key, callback) {
      var data, obj, prefix_len;

      prefix_len = ObjectStore.JSON_OBJECT_PREFIX.length;
      data = this.cache.get(key);
      if ((data != null ? data.substring(0, prefix_len) : void 0) === ObjectStore.JSON_OBJECT_PREFIX) {
        obj = JSON.parse(data.substring(prefix_len));
        return callback(void 0, obj);
      } else {
        return callback(void 0, data);
      }
    };

    MemoryStore.prototype.del = function(key, callback) {
      var val;

      val = this.cache.del(key);
      return callback(void 0, val);
    };

    MemoryStore.prototype.has = function(key, callback) {
      var val;

      val = this.cache.has(key);
      return callback(void 0, val);
    };

    MemoryStore.prototype.keys = function(pattern, callback) {
      var val;

      val = this.cache.keys();
      return callback(void 0, val);
    };

    MemoryStore.prototype.flush = function(callback) {
      this.cache.reset();
      return callback(null, true);
    };

    MemoryStore.prototype.clear = function() {
      return this.cache.reset();
    };

    MemoryStore.prototype.reset = function() {
      return this.cache.reset();
    };

    MemoryStore.prototype.size = function() {
      return this.cache.keys().length;
    };

    MemoryStore.prototype.quit = function() {};

    return MemoryStore;

  })(ObjectStore);

  module.exports = MemoryStore;

}).call(this);
