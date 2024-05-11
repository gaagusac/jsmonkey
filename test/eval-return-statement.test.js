const testEval = require('./utilities').testEval;
const testIntegerObject = require('./utilities').testIntegerObject;

class TestObj {
  constructor(input, expected) {
    this.input = input;
    this.expected = expected;
  }

  getInput() {
    return this.input;
  }

  getExpected() {
    return this.expected;
  }
}

const tests = [
  new TestObj("return 10;", 10),
  new TestObj("return 10; 9;", 10),
  new TestObj("return 2 * 5; 9;", 10),
  new TestObj("9; return 2 * 5; 9;", 10),
  new TestObj(`if (10 > 1) { if (10 > 1) { return 10; } return 1;}`, 10),
];

describe.each(tests)('Testing return value statements evaluation', t => {
  const evaluated = testEval(t.getInput());
  testIntegerObject(evaluated, t.getExpected());
});
