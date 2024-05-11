
const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const IfExpression = require('../monkey_node').IfExpression;
const testInfixExpression = require('./utilities').testInfixExpression;
const testIdentifier = require('./utilities').testIdentifier;

const input = `
if (x < y) { x } else { y }
`;

const program = parser.parse(input);

test(`program.body does not contain ${1} statements. got=${program.getChildren().length}`, () => {
  expect(program.getChildren().length).toBe(1);
});

const stmt = program.getChildren()[0];
test(`program.statements[0] is not ExpressionStatement. got=${typeof stmt}`, () => {
  expect(stmt).toBeInstanceOf(ExpressionStatement);
});

const expr = stmt.expression;
test(`stmt.expression is not IfExpression. got=${typeof expr}`, () => {
  expect(expr).toBeInstanceOf(IfExpression);
});

testInfixExpression(expr.condition, "x", "<", "y");

test(`consequence is not 1 statements. got=${expr.consequence.getChildren().length}`, () => {
  expect(expr.consequence.getChildren().length).toBe(1);
});

const consequence = expr.consequence.getChildren()[0];
test(`statements[0] is not ExpressionStatement. got=${typeof consequence}`, () => {
  expect(consequence).toBeInstanceOf(ExpressionStatement);
});

testIdentifier(consequence.expression, "x");

const alternative = expr.alternative.getChildren()[0];

test(`alternative is not 1 statement. got=${expr.alternative.getChildren().length}`, () => {
  expect(expr.alternative.getChildren().length).toBe(1);
});

testIdentifier(alternative.expression, "y");
