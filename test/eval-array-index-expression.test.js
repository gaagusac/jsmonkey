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
  new TestObj("[1, 2, 3][0]", 1),
  new TestObj("[1, 2, 3][1]", 2),
  new TestObj("[1, 2, 3][2]", 3),
  new TestObj("let i = 0; [1][i];", 1),
  new TestObj("[1, 2, 3][1 + 1];", 3),
  new TestObj("let myArray = [1, 2, 3]; myArray[2];", 3),
  new TestObj("let myArray = [1, 2, 3]; myArray[0] + myArray[1] + myArray[2];", 6),
  new TestObj("let myArray = [1, 2, 3]; let i = myArray[0]; myArray[i];", 2),
  new TestObj("[1, 2, 3][3]", null),
  new TestObj("[1, 2, 3][-1]", null),
];

describe.each(tests)('Testing array index expression evaluation', t => {
  const evaluated = testEval(t.getInput());
  if (typeof t.getExpected() == "number") {
    testIntegerObject(evaluated, t.getExpected());
  } else {
    testNullObject(evaluated);
  }
})
