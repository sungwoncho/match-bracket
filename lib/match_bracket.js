var Tracker = require('./tracker');
var getCommentPatterns = require('./comment_patterns');

/**
 * Calculates the position of the matching bracket in the given code.
 * @param {String} code
 * @param {Object} bracketPos - position of the bracket
 *        e.g. {line: 2, cursor: 3}
 */
module.exports = function (code, bracketPos, extension) {
  const QUOTATION_PAIRS = {
    '\"': '\"',
    '\'': '\'',
    '\`': '\`'
  };
  const BRACKET_PAIRS = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  const COMMENT_PATTERNS = getCommentPatterns(extension);

  // Trims the portion of the code before the bracket appears
  // Returns a string against which we can scan for the matching bracket
  function trim(code, bracketPos) {
    var lines = code.split('\n').slice(bracketPos.line - 1);
    lines[0] = lines[0].substring(bracketPos.cursor - 1);

    return lines.join('\n');
  }

  var tracker = new Tracker(bracketPos);
  var trimmed = trim(code, bracketPos);
  var bracket = trimmed[0];
  var bracketStack = [];
  var activeComment = '';
  var activeQuotations = [];
  var commentPattern, candidate;

  for (var i = 0; i < trimmed.length; i++) {
    var char = trimmed[i];

    // Check for comments
    for (var j = 0; j < COMMENT_PATTERNS.length; j++) {
      if (activeComment.length === 0) {
        commentPattern = COMMENT_PATTERNS[j].start;
        candidate = trimmed.substring(i, i + commentPattern.length + 1);

        if (candidate === commentPattern) {
          activeComment = COMMENT_PATTERNS[j];
          tracker.moveCursor(candidate.length);
        }
      } else {
        commentPattern = COMMENT_PATTERNS[j].end;
        candidate = trimmed.substring(i, i + commentPattern.length + 1);

        if (candidate === commentPattern) {
          activeComment = '';

          if (COMMENT_PATTERNS[j].multiLine) {
            tracker.moveCursor(candidate.length);
          } else {
            trakcer.advancePosition(candidate);
          }
        }
      }
    }

    if (activeComment) {
      continue;
    }

    // Check for quotations
    if (QUOTATION_PAIRS[char]) {
      var latestQuotation = activeQuotations[activeQuotations.length - 1];

      if (latestQuotation === char) {
        activeQuotations.pop();
        tracker.advancePosition(char);
      } else {
        activeQuotations.push(char);
        tracker.advancePosition(char);
      }
    }

    if (activeQuotations.length > 0) {
      continue;
    }

    // If no comments or quotations are active, match brackets.
    if (char === BRACKET_PAIRS[bracket]) {
      bracketStack.pop();
    } else if (char === bracket) {
      bracketStack.push(char);
    }

    if (bracketStack.length === 0) {
      return {
        line: tracker.line,
        cursor: tracker.cursor
      };
    } else {
      tracker.advancePosition(char);
    }
  }

  // If for loop terminates without returning, the bracket is unmatched.
  return {
    line: null,
    cursor: null
  };
};
