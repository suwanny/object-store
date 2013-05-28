/*
  mocha -R spec spec/lib/memcached_store_spec
 */

var should          = require("should");
var MemcachedStore  = require('../lib/memcached_store');
var Async           = require('async')

describe('MemcachedStore', function(){

  var cache = new MemcachedStore();

  describe('#flush()', function(){
    it('should invalidate all keys', function(done){
      cache.flush(function(err, results){
        results[0].should.be.true;
        done();
      });
    });
  });

  describe('#get and #set()', function(){
    it('should store and retrive a string with a key and expire time', function(done){
      cache.set('hello_string', 'hello, world', function(err, res){
        if(err) throw err;
        res.should.be.true;

        cache.get('hello_string', function(err2, res2){
          if(err2) throw err2;
          res2.should.eql('hello, world');
          done();
        });
      });
    });

    it('should store and retrive an object with a key and expire time', function(done){
      cache.set('hello_obj', {hello: 'world'}, function(err, res){
        if(err) throw err;
        res.should.be.true;

        cache.get('hello_obj', function(err2, res2){
          if(err2) throw err2;
          res2.should.have.property('hello', 'world');
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
        cache.get(key, callback)
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
    it('should retrive all keys', function(done){
      var root_key = "keys_test." + +(new Date());
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


  describe('#items()', function(){
    it('should retrieve items info', function(done){
      cache.set('hello', 'world', function(err, res){
        should.exist(res);
        res.should.be.true;
        cache.items(function(err, res){
          if (err) throw err;

          info = res[0]['1'];
          info.should.have.property('number');
          info.should.have.property('age');
          info.should.have.property('outofmemory');
          info.should.have.property('reclaimed');
          done();
        });
      });
    });
  });

});



