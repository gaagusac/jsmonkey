const parser = require('../monkeyParser').parser;
const testLiteralExpression = require('./utilities').testLiteralExpression;

class TestObj {
  constructor(input, expectedParams) {
    this.input = input;
    this.expectedParams = expectedParams;
  }

  getInput() {
    return this.input;
  }

  getExpectedParams() {
    return this.expectedParams;
  }

}

const paramTest = [
  new TestObj("fn() { a + b; };", []),
  new TestObj("fn(x) { a + b; };", ["x"]),
  new TestObj("fn(x, y, z) { a + b; };", ["x", "y", "z"]),
];

describe.each(paramTest)('Testing function parameter parsing', t => {
  const program = parser.parse(t.getInput());

  const stmt = program.getChildren()[0];
  const fn = stmt.expression;

  test(`length parameters wrong. want ${t.getExpectedParams().length}, got=${fn.getParameters().length}`, () => {
    expect(fn.getParameters().length).toBe(t.getExpectedParams().length);
  });

  for (let i = 0; i < fn.getParameters().length; i++) {
    testLiteralExpression(fn.getParameters()[i], t.getExpectedParams()[i]);
  }
});
