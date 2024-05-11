const testEval = require('./utilities').testEval;
const testIntegerObject = require('./utilities').testIntegerObject;
const testNullObject = require('./utilities').testNullObject;

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
  new TestObj(`{"foo": 5}["foo"]`, 5),
  new TestObj(`{"foo": 5}["bar"]`, null),
  new TestObj(`let key = "foo"; {"foo": 5}[key]`, 5),
  new TestObj(`{}["foo"]`, null),
  new TestObj(`{5: 5}[5]`, 5),
  new TestObj(`{true: 5}[true]`, 5),
  new TestObj(`{false: 5}[false]`, 5),
];

describe.each(tests)('Testing hash index expression evaluation', (t) => {
  const evaluated = testEval(t.getInput());
  if (typeof t.getExpected() == "number") {
    testIntegerObject(evaluated, t.getExpected());
  } else {
    testNullObject(evaluated);
  }
});
