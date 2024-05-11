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
  new TestObj("let a = 5; a;", 5),
  new TestObj("let a = 5 * 5; a;", 25),
  new TestObj("let a = 5; let b = a; b;", 5),
  new TestObj("let a = 5; let b = a; let c = a + b + 5; c;", 15),
];

describe.each(tests)('Testing let statement enviroment binding', t => {
  const evaluated = testEval(t.getInput());
  testIntegerObject(evaluated, t.getExpected());
});
