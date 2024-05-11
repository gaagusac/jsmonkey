const testEval = require('./utilities').testEval;
const ErrorObj = require('../monkey_obj').RtError;

class TestObj {
  constructor(input, expectedMessage) {
    this.input = input;
    this.expectedMessage = expectedMessage;
  }

  getInput() {
    return this.input;
  }

  getExpectedMessage() {
    return this.expectedMessage;
  }
}

const tests = [
  new TestObj("5 + true;", "type mismatch: INTEGER + BOOLEAN"),
  new TestObj("5 + true; 5;", "type mismatch: INTEGER + BOOLEAN"),
  new TestObj("-true", "unknown operator: -BOOLEAN"),
  new TestObj("true + false;", "unknown operator: BOOLEAN + BOOLEAN"),
  new TestObj("5; true + false; 5", "unknown operator: BOOLEAN + BOOLEAN"),
  new TestObj("if (10 > 1) { true + false; }", "unknown operator: BOOLEAN + BOOLEAN"),
  new TestObj("if (10 > 1) { if (10 > 1) { return true + false; } return 1; }", "unknown operator: BOOLEAN + BOOLEAN"),
  new TestObj("foobar", "identifier not found: foobar"),
  new TestObj(`{"name": "Monkey"}[fn(x) {x}];`, "unusable as hash key: FUNCTION_OBJ"),
];

describe.each(tests)('Testing runtime error handling.', t => {
  const evaluated = testEval(t.getInput());
  it(`no error object returned. got=${typeof evaluated}`, () => {
    expect(evaluated).toBeInstanceOf(ErrorObj);
  });
  it(`wrong error message. expected=${t.getExpectedMessage()}`, () => {
    expect(evaluated.message).toMatch(t.getExpectedMessage());
  });
});
