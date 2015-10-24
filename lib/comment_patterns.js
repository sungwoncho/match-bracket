var commentPatterns = {
  js: [
    {
      start: '//',
      end: '\n',
      multiLine: false
    },
    {
      start: '/*',
      end: '*/',
      multiLine: true
    }
  ]
};

function getcommentPatterns(extension) {
  var patterns = commentPatterns[extension];

  if (patterns) {
    return patterns;
  } else {
    return [];
  }
}

module.exports = getcommentPatterns;
