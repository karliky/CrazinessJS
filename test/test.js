var craziness = require('../index');
var assert = require('chai').assert

describe('Native', function() {
  it('should export native module correctly', function () {
    assert(craziness);
    assert(craziness.searchProcess);
    assert.typeOf(craziness.searchProcess, 'function');
    assert(craziness.searchProcess('node.exe'));
  });

  it('should activate debug mode', function () {
    assert(craziness.setDebugMode);
    assert.typeOf(craziness.setDebugMode, 'function');
    assert(craziness.setDebugMode(true));
  });

  it('should deactivate debug mode', function () {
    assert(craziness.setDebugMode);
    assert.typeOf(craziness.setDebugMode, 'function');
    assert.notOk(false, craziness.setDebugMode(false));
  });

  it('should not be true if no boolean is provided', function () {
    assert(craziness.setDebugMode);
    assert.typeOf(craziness.setDebugMode, 'function');
    assert.notOk(false, craziness.setDebugMode('wololo'));
  });

  it('should read a memory address', function () {
    assert(craziness.readMemory);
    assert.typeOf(craziness.readMemory, 'function');
    console.log( craziness.readMemory(0x00400000) );
  });


});
