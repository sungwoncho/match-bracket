var fs = require('fs');
var expect = require('chai').expect;
var matchBracket = require('../lib/match_bracket');

describe("match-bracket", function(){
  it("gets the correct matching bracket position", function(done){
    var sample = fs.readFileSync('test/fixture/sample.js', {encoding: 'utf8'});

    matchBracket(sample, {line: 5, cursor: 16}, function (result) {
      expect(result.line).to.equal(8);
      expect(result.cursor).to.equal(3);
      done();
    });
  });
});
