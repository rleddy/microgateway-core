const assert = require('assert');
const PluginsMiddleware = require('../lib/plugins-middleware');

describe('plugin behavior', () => {
  it('exposes _executePluginHandler', () => {
    assert.ok(PluginsMiddleware._executePluginHandler);
  });

  it('will provide three arguments to in req, res, next format', (done) => {
    var plugins = {
      'ondata_request': function(req, res, next) {
        assert.equal(req, 'foo');
        assert.equal(res, 'bar');
        assert.equal(typeof next, 'function');
        next(null, null);      
      }
    }

    var opts = {
      sourceRequest: 'foo',
      sourceResponse: 'bar',
    }

    PluginsMiddleware._executePluginHandler(plugins, 'data', opts)('foo', (arg1, arg2) =>{
      assert.equal(arg1, null);
      assert.equal(arg2, null);
      done(); 
    });
  });

  it('will provide three arguments to in req, res, data, next format', (done) => {
    var plugins = {
      'ondata_request': function(req, res, data, next) {
        assert.equal(req, 'foo');
        assert.equal(res, 'bar');
        assert.equal(data, 'foo');
        assert.equal(typeof next, 'function');
        next(null, null);
      }
    }

    var opts = {
      sourceRequest: 'foo',
      sourceResponse: 'bar',
    }

    PluginsMiddleware._executePluginHandler(plugins, 'data', opts)('foo', (arg1, arg2) =>{
      assert.equal(arg1, null);
      assert.equal(arg2, null);
      done(); 
    });
  });

  it('will provide three arguments to in req, res, targetRes, data,  next format', (done) => {
    var plugins = {
      'ondata_request': function(req, res, targetResponse, data, next) {
        assert.equal(req, 'foo');
        assert.equal(res, 'bar');
        assert.equal(data, 'foo');
        assert.equal(targetResponse, 'quux');
        assert.equal(typeof next, 'function');
        next(null, null); 
      }
    }

    var opts = {
      sourceRequest: 'foo',
      sourceResponse: 'bar',
      targetResponse: 'quux',
    }

    PluginsMiddleware._executePluginHandler(plugins, 'data', opts)('foo', (arg1, arg2) =>{
      assert.equal(arg1, null);
      assert.equal(arg2, null);
      done(); 
    });
  
  });
});
