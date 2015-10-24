/**
 * Calculates the position of the matching bracket in the given code.
 * @param {String} code
 * @param {Object} bracketPos - position of the bracket
 *        e.g. {line: 2, cursor: 3}
 */
module.exports = function (code, bracketPos) {
  const BRACKET_PAIRS = {
    '(': ')',
    '{': '}',
    '[': ']'
  };

  // Trims the portion of the code before the bracket appears
  // Returns a string against which we can scan for the matching bracket
  function trim(code, bracketPos) {
    var lines = code.split('\n').slice(bracketPos.line - 1);
    lines[0] = lines[0].substring(bracketPos.cursor - 1);

    return lines.join('\n');
  }

  var currentLine = bracketPos.line;
  var currentCursor = bracketPos.cursor;
  var stack = [];

  var trimmed = trim(code, bracketPos);
  var bracket = trimmed[0];

  for (var i = 0; i < trimmed.length; i++) {
    var char = trimmed[i];

    if (char === BRACKET_PAIRS[bracket]) {
      stack.pop();
    } else if (char === bracket) {
      stack.push(char);
    }

    if (stack.length === 0) {
      return {
        line: currentLine,
        cursor: currentCursor
      };
    } else {
      // Keep track of the current position
      if (char === '\n') {
        currentLine++;
        currentCursor = 1;
      } else {
        currentCursor++;
      }
    }
  }

  // If for loop terminates without returning, the bracket is unmatched.
  return {
    line: null,
    cursor: null
  };
};
