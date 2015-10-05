# Match-Bracket

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
matchBracket(code, {line: 1, cursor: 42}, function (result) {
  console.log(result);
});

// => {line: 11, cursor: 1}
```


## API

### matchBracket(code, bracketPos, callback)

Asynchronously gets the matching bracket of the bracket given by `bracketPos`
from the `code`. `callback` takes one argument `(result)`.

Both `bracketPos` and `result` are in the format of:

```javascript
{
  line: // line number,
  cursor: // cursor number
}
```

`line` is the line number in which the bracket appears. `cursor` denotes the
number of character in the line after which the bracket appears.


## License

MIT
