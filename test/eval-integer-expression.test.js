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
  new TestObj("5", 5),
  new TestObj("10", 10),
  new TestObj("-5", -5),
  new TestObj("-10", -10),
  new TestObj("5 + 5 + 5 + 5 - 10", 10),
  new TestObj("2 * 2 * 2 * 2 * 2", 32),
  new TestObj("-50 + 100 + -50", 0),
  new TestObj("5 * 2 + 10", 20),
  new TestObj("5 + 2 * 10", 25),
  new TestObj("20 + 2 * -10", 0),
  new TestObj("50 / 2 * 2 + 10", 60),
  new TestObj("2 * (5 + 10)", 30),
  new TestObj("3 * 3 * 3 + 10", 37),
  new TestObj("3 * (3 * 3) + 10", 37),
  new TestObj("(5 + 10 * 2 + 15 / 3) * 2 + -10", 50),
];

describe.each(tests)('Testing integer expression evaluation', t => {
  const evaluated = testEval(t.getInput());
  testIntegerObject(evaluated, t.getExpected());
});
