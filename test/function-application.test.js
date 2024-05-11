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
  new TestObj("let identity = fn(x) { x; }; identity(5);", 5),
  new TestObj("let identity = fn(x) { return x; }; identity(5);", 5),
  new TestObj("let double = fn(x) { x * 2; }; double(5);", 10),
  new TestObj("let add = fn(x, y) { x + y; }; add(5, 5);", 10),
  new TestObj("let add = fn(x, y) { x + y; }; add(5 + 5, add(5, 5));", 20),
  new TestObj("fn(x) { x; }(5)", 5),
];

describe.each(tests)('Testing function evaluation test', t => {
  const evaluated = testEval(t.getInput());
  testIntegerObject(evaluated, t.getExpected());
});
