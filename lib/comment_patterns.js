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
  return commentPatterns[extension];
}

module.exports = getcommentPatterns;
