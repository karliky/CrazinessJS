var craziness = require('../index');
var assert = require('chai').assert

describe('Native', function() {
  it('should export native module correctly', function () {
    assert(craziness);
    assert(craziness.searchProcess);
    assert.typeOf(craziness.searchProcess, 'function');
    assert(craziness.searchProcess('node.exe'));
  });
});
