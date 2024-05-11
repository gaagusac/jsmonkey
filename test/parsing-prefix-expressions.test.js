const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const PrefixExpression = require('../monkey_node').PrefixExpression;
const testIntegerLiteral = require('./utilities').testIntegerLiteral;
class TestObj {
  constructor(input, operator, integerValue) {
    this.input = input;
    this.operator = operator;
    this.integerValue = integerValue;

  }

  getInput() {
    return this.input;
  }

  getOperator() {
    return this.operator;
  }

  getIntegerValue() {
    return this.integerValue;
  }
}

const prefixTests = [
  new TestObj("!15;", "!", 15),
  new TestObj("-15;", "-", 15),
];

describe.each(prefixTests)('Testing parsing prefix expressions.', (t) => {
  let program = parser.parse(t.getInput());
  it(`program.statements does not contain {1} statements. got=${program.getChildren().length}`, () => {
    expect(program.getChildren().length).toBe(1);
  });
  const stmt = program.getChildren()[0];
  it(`program.statements[0] is not ExpressionStatement. got=${typeof stmt}`, () => {
    expect(stmt).toBeInstanceOf(ExpressionStatement);
  });
  const expr = stmt.expression;
  it(`stmt is not PrefixExpression. got=${typeof expr}`, () => {
    expect(expr).toBeInstanceOf(PrefixExpression);
  });
  it(`expr.operator it not ${t.getOperator()}. got=%{expr.operator}`, () => {
    expect(expr.operator).toMatch(t.getOperator());
  });
  testIntegerLiteral(expr.right, t.getIntegerValue());
});
