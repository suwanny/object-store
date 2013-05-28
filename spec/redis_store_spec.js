/*
  mocha -R spec spec/lib/redis_store_spec
 */

var should      = require("should");
var RedisStore  = require('../lib/redis_store');
var Async       = require('async');

describe('RedisStore', function(){
  var test_db = 12;
  var temp_db = 12;
  var cache   = new RedisStore(null, test_db);

  describe('#flushdb', function(){
    it('should delete all keys of the current db', function(done){
      cache.select(test_db, function(err2, res2) {
        cache.database().should.eql(test_db);
        cache.flushdb(function(err, res){
          cache.keys('*', function(err, res){
            res.should.be.empty
            done();
          });
        });
      });
    });
  });

  describe('#select() and database()', function(){
    it('should change the current database and get it', function(done){
      cache.select(temp_db, function(err, res){
        if (err) throw err;
        res.should.be.true;
        var cur_db = cache.database();
        cur_db.should.eql(temp_db);
        cache.select(test_db, function(err2, res2) {
          cache.database().should.eql(test_db);
          done();
        });
      });
    });
  });

  describe('#set() and get()', function(){
    it('should store a string and get it with a key', function(done){
      var key = "test_redis_string." + (new Date()).getTime();
      cache.set(key, 'hello, redis', function(err, res) {
        if (err) throw err;
        res.should.be.true;
        cache.get(key, function(err, res) {
          res.should.eql('hello, redis');
          done();  
        });
      });
    });

    it('should store an object and get it with a key', function(done){
      var key = "test_redis_object." + (new Date()).getTime();
      cache.set(key, {hello: 'redis'}, function(err, res) {
        if (err) throw err;
        res.should.be.true;
        cache.get(key, function(err, res) {
          res.should.have.property('hello', 'redis');
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


  describe('#del()', function(){
    it('should be able to set, get, del, and get nothing with the same key', function(done){
      var key = 'delete_test_' + (new Date()).getTime();
      var fn_set = function(callback) {
        cache.set(key, 'greeting!', callback);
      };

      var fn_get = function(res, callback) {
        should.exist(res);
        res.should.be.true;
        cache.get(key, callback);
      };

      var fn_del = function(res, callback) {
        should.exist(res);
        res.should.eql('greeting!');
        cache.del(key, callback);
      };

      var fn_verify = function(res, callback) {
        should.exist(res);
        res.should.be.true;
        cache.has(key, callback)
      };

      Async.waterfall([fn_set, fn_get, fn_del, fn_verify], 
        function(err, res){
          if(err) {
            console.info(err);
            throw err;
          }
          should.exist(res);
          res.should.be.false;
          done();
        }
      );
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

  

  describe('#sendCommand()', function(){
    it('should send any command to redis', function(done){
      cache.sendCommand("echo", ['hello, redis'], function(err, res) {
        res.should.eql('hello, redis');
        done();
      });
    });
  });

});


