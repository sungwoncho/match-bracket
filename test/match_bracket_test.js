var fs = require('fs');
var expect = require('chai').expect;
var matchBracket = require('../lib/match_bracket');

describe("match-bracket", function(){
  it("matches brackets in different lines", function(){
    var sample = fs.readFileSync('test/fixture/sample.js', {encoding: 'utf8'});

    var result = matchBracket(sample, {line: 5, cursor: 16});
    expect(result.line).to.equal(8);
    expect(result.cursor).to.equal(3);
  });

  it("matches a simple pair", function(){
    var result = matchBracket('()', {line: 1, cursor: 1});
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(2);
  });

  it("matches a pair containing an unmatched bracket", function(){
    var result = matchBracket('({)', {line: 1, cursor: 1});
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(3);
  });

  it("matches a pair on different lines containing an unmatched bracket",
    function(){
      var sample = fs.readFileSync(
        'test/fixture/unmatched_sample.js', {encoding: 'utf8'});

      var result = matchBracket(sample, {line: 5, cursor: 16});
      expect(result.line).to.equal(8);
      expect(result.cursor).to.equal(3);
    }
  );

  it("returns null for line and cursor for unmatched bracket", function(){
    var result = matchBracket('({)', {line: 1, cursor: 2});
    expect(result.line).to.equal(null);
    expect(result.cursor).to.equal(null);
  });
});
