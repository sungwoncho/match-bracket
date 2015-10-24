# Match-Bracket

[![Build Status](https://travis-ci.org/sungwoncho/match-bracket.svg?branch=master)](https://travis-ci.org/sungwoncho/match-bracket)

Find the matching bracket's position for a bracket in a code.


## Install

    npm install match-bracket


## Usage

Given this code:

**sample.js**
```javascript
File.prototype.getExtension = function() {
  var re = /[A-Za-z]*(\.[a-z]+)$/g;
  var matched = re.exec(this.path);

  if (matched) {
    var ext = matched[1];
    return ext;
  } else {
    return 'none';
  }
};
```

We can find the matching bracket for the first `{` by doing:

```javascript
var matchBracket = require('match-bracket');

var code = require('fs').readFileSync('./sample.js');
var bracketPos = {line: 1, cursor: 42};

var result = matchBracket(code, bracketPos);
console.log(result);
// => {line: 11, cursor: 1}
```


## API

### matchBracket(code, bracketPos, extension)

Returns the position of the matching bracket of the bracket given by
`bracketPos` from the `code`.

`extension` is an optional argument. It allows match-bracket to recognize
comments in the code and get more accurate results.

Both `bracketPos` and `result` are in the format of:

```javascript
{
  line: // line number,
  cursor: // cursor number
}
```

`line` is the line number in which the bracket appears. `cursor` denotes order
in which the bracket appears in the line. Most IDEs display this.


## Rules

* Unmatched bracket returns results with null as properties.

```javascript
matchBracket('({)', {line: 1, cursor: 2});
// => {line: null, cursor: null}
```

* In ambiguous matches, brackets closest to each other are matched.

```javascript
matchBracket('(()', {line: 1, cursor: 1});
// => {line: null, cursor: null}

matchBracket('(()', {line: 1, cursor: 2});
// => {line: 1, cursor: 3}
```


## License

MIT
