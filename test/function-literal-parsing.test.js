const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const FunctionLiteral = require('../monkey_node').FunctionLiteral;
const testLiteralExpression = require('./utilities').testLiteralExpression;
const testInfixExpresion = require('./utilities').testInfixExpression;

const input = `
fn (x, y) { x + y; }
`;

const program = parser.parse(input);
test(`program.body does not contain ${1} statements. got=${program.getChildren().length}`, () => {
  expect(program.getChildren().length).toBe(1);
});

const stmt = program.getChildren()[0];
test(`program.statements[0] is not ExpressionStatement. got=${typeof stmt}`, () => {
  expect(stmt).toBeInstanceOf(ExpressionStatement);
});

const fn = stmt.expression;
test(`stmt.expression is not FunctionLiteral. got=${fn}`, () => {
  expect(fn).toBeInstanceOf(FunctionLiteral);
});

test(`function literal parameters wrong. Want 2, got=${fn.getParameters().length}`, () => {
  expect(fn.getParameters().length).toBe(2);
});

testLiteralExpression(fn.getParameters()[0], "x");
testLiteralExpression(fn.getParameters()[1], "y");

test(`fn.body.statements nas not 1 statements. got=${fn.getBody().getChildren().length}`, () => {
  expect(fn.getBody().getChildren().length).toBe(1);
});

const bodyStmt = fn.getBody().getChildren()[0];

test(`function body stmt is not ExpressionStatement. got=${typeof bodyStmt}`, () => {
  expect(bodyStmt).toBeInstanceOf(ExpressionStatement);
});

testInfixExpresion(bodyStmt.expression, "x", "+", "y");
