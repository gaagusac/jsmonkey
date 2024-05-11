const parser = require('../monkeyParser').parser;
const testIntegerLiteral = require('./utilities').testIntegerLiteral;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const InfixExpression = require('../monkey_node').InfixExpression;

class TestObj {
  constructor(input, leftValue, operator, rightValue) {
    this.input = input;
    this.leftValue = leftValue;
    this.operator = operator;
    this.rightValue = rightValue;
  }

  getInput() {
    return this.input;
  }

  getLeftValue() {
    return this.leftValue;
  }

  getRightValue() {
    return this.rightValue;
  }

  getOperator() {
    return this.operator;
  }
}

const infixTests = [
  new TestObj("5 + 5;", 5, "+", 5),
  new TestObj("5 - 5;", 5, "-", 5),
  new TestObj("5 * 5;", 5, "*", 5),
  new TestObj("5 / 5;", 5, "/", 5),
  new TestObj("5 > 5;", 5, ">", 5),
  new TestObj("5 < 5;", 5, "<", 5),
  new TestObj("5 == 5;", 5, "==", 5),
  new TestObj("5 != 5;", 5, "!=", 5),
];

describe.each(infixTests)('Testing infix expressions', (t) => {
  const program = parser.parse(t.getInput());
  it(`program.statements does not contain ${1} statements. got=${program.getChildren().length}`, () => {
    expect(program.getChildren().length).toBe(1);
  });
  const stmt = program.getChildren()[0];
  it(`program.statements[0] is not ExpressionStatement. got=${typeof stmt}`, () => {
    expect(stmt).toBeInstanceOf(ExpressionStatement);
  });
  const expr = stmt.expression;
  it(`expr is not InfixExpression. got=${stmt.expression}`, () => {
    expect(expr).toBeInstanceOf(InfixExpression);
  });
  testIntegerLiteral(expr.left, t.getLeftValue());
  it(`expr.operator is not ${t.getOperator()}. got=${expr.operator}`, () => {
    expect(expr.operator).toMatch(t.getOperator());
  });
  testIntegerLiteral(expr.right, t.getRightValue());
});
