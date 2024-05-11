const testEval = require('./utilities').testEval;
const testBooleanObject = require('./utilities').testBooleanObject;

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
  new TestObj("true", true),
  new TestObj("false", false),
  new TestObj("1 < 2", true),
  new TestObj("1 > 2", false),
  new TestObj("1 < 1", false),
  new TestObj("1 > 1", false),
  new TestObj("1 == 1", true),
  new TestObj("1 != 1", false),
  new TestObj("1 == 2", false),
  new TestObj("1 != 2", true),
  new TestObj("true == true", true),
  new TestObj("false == false", true),
  new TestObj("true == false", false),
  new TestObj("true != false", true),
  new TestObj("false != true", true),
  new TestObj("(1 < 2) == true", true),
  new TestObj("(1 < 2) == false", false),
  new TestObj("(1 > 2) == true", false),
  new TestObj("(1 > 2) == false", true),
];

describe.each(tests)('Testing boolean expression evaluation', t => {
  const evaluated = testEval(t.getInput());
  testBooleanObject(evaluated, t.getExpected());
});
