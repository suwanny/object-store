/*
  mocha -R spec spec/lib/memory_store_spec
 */

var should      = require("should");
var MemoryStore = require('../lib/memory_store');
var Async       = require('async');

describe('MemoryStore', function(){
  var cache   = new MemoryStore();

  describe('#flush()', function(){
    it('should invalidate all keys', function(done){
      cache.flush(function(err, res){
        res.should.be.true;
        done();
      });
    });
  });

  describe('#set() and #get()', function(){
    it('should store a string and get it with a key', function(done){
      var key = "test_string." + (new Date()).getTime();
      cache.set(key, 'hello, lru', function(err, res) {
        if (err) throw err;
        res.should.be.true;
        cache.get(key, function(err, res) {
          res.should.eql('hello, lru');
          done();  
        });
      });
    });

    it('should store an object and get it with a key', function(done){
      var key = "test_redis_object." + (new Date()).getTime();
      cache.set(key, {hello: 'lru'}, function(err, res) {
        if (err) throw err;
        res.should.be.true;
        cache.get(key, function(err, res) {
          res.should.have.property('hello', 'lru');
          done();  
        });
      });
    });

  });

  describe('#has()', function(){
    it('should check whether it exists or not', function(done){
      var key = 'has_test' + (new Date()).getTime();
      cache.set(key, 'hello, world', function(err, res){
        cache.has(key, function(err, result){
          result.should.be.true;
          cache.has("not_existing", function(err2, result2){
            result2.should.be.false;
            done();
          });
        });
      });
    });
  });

  describe('#keys()', function(){
    it('should get keys by pattern', function(done){
      var root_key = "keys_test." + (new Date()).getTime();
      var data_key = root_key + ":data";
      cache.set(data_key, {hello: 'nice to see you'}, function(e,r){
        cache.keys(root_key + "*", function(err, res){
          console.dir(res);
          res.should.include(data_key);
          done();    
        })
      });
    });
  });


});

