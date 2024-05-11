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
  new TestObj("if (true) { 10 }", 10),
  new TestObj("if (false) { 10  }", null),
  new TestObj("if (1) { 10 }", 10),
  new TestObj("if (1 < 2){ 10 }", 10),
  new TestObj("if (1 > 2) { 10 }", null),
  new TestObj("if (1 > 2) { 10 } else { 20 }", 20),
  new TestObj("if (1 < 2) { 10 } else { 20 }", 10),
];

describe.each(tests)('Testing if/else expression evaluation', t => {
  const evaluated = testEval(t.getInput());

  switch (typeof t.getExpected()) {
    case "number":
      testIntegerObject(evaluated, t.getExpected());
      break;
    default:
      testNullObject(evaluated);
      break;
  }
});
