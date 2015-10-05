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
