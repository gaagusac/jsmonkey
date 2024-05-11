const testEval = require('./utilities').testEval;
const testIntegerObject = require('./utilities').testIntegerObject;
const RtError = require('../monkey_obj').RtError;

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
  new TestObj(`len("")`, 0),
  new TestObj(`len("four")`, 4),
  new TestObj(`len("hello world")`, 11),
  new TestObj(`len(1)`, "argument to 'len' not supported, got=INTEGER"),
  new TestObj(`len("one", "two")`, "wrong number of arguments. got=2, want=1"),
];

describe.each(tests)('Testing Builtin functions', t => {
  const evaluated = testEval(t.getInput());
  switch (typeof t.getExpected()) {
    case "number":
      testIntegerObject(evaluated, t.getExpected());
      break;
    case "string":
      const errObj = evaluated;
      test(`object is not Error. got=${evaluated}.`, () => {
        expect(evaluated).toBeInstanceOf(RtError);
        return;
      });
      test(`wrong error message. expected=${t.getExpected()}. got=${errObj.message}`, () => {
        expect(errObj.message).toBe(t.getExpected());
      });
      break;
  }
});
