var Tracker = function (position) {
  this.line = position.line;
  this.cursor = position.cursor;
};

// Keep track of the current position
Tracker.prototype.advancePosition = function (char) {
  if (char === '\n') {
    this.line++;
    this.cursor = 1;
  } else {
    this.cursor++;
  }
};

Tracker.prototype.moveCursor = function (unit) {
  this.cursor += unit;
};

module.exports = Tracker;
