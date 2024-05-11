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
  new TestObj("!true", false),
  new TestObj("!false", true),
  new TestObj("!5", false),
  new TestObj("!!true", true),
  new TestObj("!!false", false),
  new TestObj("!!5", true),
];

describe.each(tests)('Testing boolean expression evaluation', t => {
  const evaluated = testEval(t.getInput());
  testBooleanObject(evaluated, t.getExpected());
});
