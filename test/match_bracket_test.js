var fs = require('fs');
var expect = require('chai').expect;
var matchBracket = require('../lib/match_bracket');

describe("match-bracket", function(){
  it("matches brackets in different lines", function(){
    var sample = fs.readFileSync('test/fixture/sample.js', {encoding: 'utf8'});

    var result = matchBracket(sample, {line: 5, cursor: 16}, 'js');
    expect(result.line).to.equal(8);
    expect(result.cursor).to.equal(3);
  });

  it("matches a simple pair", function(){
    var result = matchBracket('()', {line: 1, cursor: 1}, 'js');
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(2);
  });

  it("matches a pair containing an unmatched bracket", function(){
    var result = matchBracket('({)', {line: 1, cursor: 1}, 'js');
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(3);
  });

  it("matches a pair on different lines containing an unmatched bracket",
    function(){
      var sample = fs.readFileSync(
        'test/fixture/unmatched_sample.js', {encoding: 'utf8'});

      var result = matchBracket(sample, {line: 5, cursor: 16}, 'js');
      expect(result.line).to.equal(8);
      expect(result.cursor).to.equal(3);
    }
  );

  it("returns null for line and cursor for unmatched bracket", function(){
    var result = matchBracket('({)', {line: 1, cursor: 2}, 'js');
    expect(result.line).to.equal(null);
    expect(result.cursor).to.equal(null);
  });

  it("matches brackets cloest to each other in an ambiguous match", function(){
    var sample = '(()';

    var result1 = matchBracket(sample, {line: 1, cursor: 1}, 'js');
    expect(result1.line).to.equal(null);
    expect(result1.cursor).to.equal(null);

    var result2 = matchBracket(sample, {line: 1, cursor: 2}, 'js');
    expect(result2.line).to.equal(1);
    expect(result2.cursor).to.equal(3);
  });

  it("ignores brackets inside multi line comments", function(){
    var sample = 'while (notFound /* loop until ) char found ) */) {...}';
    var result = matchBracket(sample, {line: 1, cursor: 7}, 'js');
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(31);
  });

  it("ignores brackets appearing inside \"\"", function(){
    var result = matchBracket('if (str === ")") {}', {line: 1, cursor: 4}, 'js');
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(16);
  });

  it("ignores brackets appearing inside quotations inside comments", function(){
    var result = matchBracket('(/* "("*/)', {line: 1, cursor: 1}, 'js');
    expect(result.line).to.equal(1);
    expect(result.cursor).to.equal(10);
  });
});
