var Readable = stream.Readable;

/**
 * Calculates the position of the matching bracket in the given code.
 * @param {String} code
 * @param {Object} bracketPos - position of the bracket
 *        e.g. {line: 2, cursor: 3}
 * @param {Function} cb - Callback takes one argument (result) which is in the
 *        same form as the brakcetPos. e.g. {line: 5, cursor: 8}
 */
module.exports = function (code, bracketPos, cb) {
  const BRACKET_BEGINNING = /[\(\{\[<]/g;
  const BRACKET_ENDING = /[\)\}\]>]/g;
  var currentLine = bracketPos.line;
  var currentCursor = bracketPos.cursor;
  var stack = [];
  var done = false;

  // Trims the portion of the code before the bracket
  // Returns the 'source' against which we can scan for the matching bracket
  function getSource(code, bracketPos) {
    var lines = code.split('\n');
    var lineWithBracket = lines[bracketPos.line - 1];
    lines[bracketPos.line - 1] = lineWithBracket.substring(bracketPos.cursor - 1);
    var newLines = lines.slice(bracketPos.line - 1);

    return newLines.join('\n');
  }

  var source = getSource(code, bracketPos);
  var readable = new Readable();
  readable._read = function noop() {};
  readable.push(source);
  readable.push(null);

  readable.on('readable', function () {
    var chunk;
    while (null !== (chunk = readable.read(1))) {
      var char = chunk.toString('utf8');

      // Manage counter
      if (char === '\n') {
        currentLine++;
        currentCursor = 0;
      } else {
        currentCursor++;
      }

      // Find matching bracket
      if (BRACKET_BEGINNING.test(char)) {
        stack.push(char);
      }
      if (BRACKET_ENDING.test(char)) {
        stack.pop();

        if (stack.length === 0 && ! done) {
          done = true;
          var result = {
            line: currentLine,
            cursor: currentCursor
          };

          cb(result);
        }
      }
    }
  });
};
