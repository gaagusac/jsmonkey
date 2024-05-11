

class MonkeyToken {

  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }


  getType() {
    return this.type;
  }

  getValue() {
    return this.value;
  }

  getLine() {
    return this.line;
  }

  getColumn() {
    return this.column;
  }
}

module.exports = {
  MonkeyToken
};
