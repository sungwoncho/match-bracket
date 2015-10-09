/**
 * Calculates the position of the matching bracket in the given code.
 * @param {String} code
 * @param {Object} bracketPos - position of the bracket
 *        e.g. {line: 2, cursor: 3}
 */
module.exports = function (code, bracketPos) {
  const BRACKET_BEGINNING = /[\(\{\[]/;
  const BRACKET_ENDING = /[\)\}\]]/;

  // Trims the portion of the code before the bracket
  // Returns a string against which we can scan for the matching bracket
  function trim(code, bracketPos) {
    var lines = code.split('\n').slice(bracketPos.line - 1);
    lines[0] = lines[0].substring(bracketPos.cursor - 1);

    return lines.join('\n');
  }

  function ensureMatched(bracket1, bracket2) {
    const BRACKET_MAPPING = {
      '(': ')',
      '{': '}',
      '[': ']'
    };

    return (BRACKET_MAPPING[bracket1] === bracket2 ||
            BRACKET_MAPPING[bracket2] === bracket1);
  }

  var currentLine = bracketPos.line;
  var currentCursor = bracketPos.cursor;
  var stack = [];

  var trimmed = trim(code, bracketPos);
  var bracket = trimmed[0];

  for (var i = 0; i < trimmed.length; i++) {
    var char = trimmed[i];

    if (BRACKET_BEGINNING.test(char)) {
      stack.push({char: char, line: currentLine, cursor: currentCursor});
    }

    // Keep track of the current position
    if (char === '\n') {
      currentLine++;
      currentCursor = 0;
    } else {
      currentCursor++;
    }

    if (BRACKET_ENDING.test(char)) {
      var b1 = stack.pop();
      var b2 = BRACKET_ENDING.exec(char)[0];

      if (! ensureMatched(b1.char, b2)) {
        throw new Error(`Unmatched bracket at (${b1.line}, ${b1.cursor})`);
      }

      if (stack.length === 0) {
        return {
          line: currentLine,
          cursor: currentCursor
        };
      }
    }
  }
};
