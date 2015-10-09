var fs = require('fs');
var expect = require('chai').expect;
var matchBracket = require('../lib/match_bracket');

describe("match-bracket", function(){
  it("gets the correct matching bracket position", function(){
    var sample = fs.readFileSync('test/fixture/sample.js', {encoding: 'utf8'});

    var result = matchBracket(sample, {line: 5, cursor: 16});
    expect(result.line).to.equal(8);
    expect(result.cursor).to.equal(3);
  });

  it("throws an error when unmatched bracket exists", function(){
    var sample = fs.readFileSync('test/fixture/unmatched_bracket.js', {encoding: 'utf8'});

    expect(function () {
      matchBracket(sample, {line: 5, cursor: 16});
    }).to.throw(/(5\, 18)/);
  });
});
