var craziness = require('../index');
var assert = require('assert');
describe('Native', function() {
  it('should export native module correctly', function () {
    assert(craziness);
    assert(craziness.searchProcess);
    assert(craziness.searchProcess('node.exe'));
  });
});
