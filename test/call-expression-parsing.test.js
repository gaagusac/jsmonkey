const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const CallExpression = require('../monkey_node').CallExpression;
const testIdentifier = require('./utilities').testIdentifier;
const testLiteralExpression = require('./utilities').testLiteralExpression;
const testInfixExpression = require('./utilities').testInfixExpression;

const input = `
add(1, 2 * 3, 4 + 5);
`

const program = parser.parse(input);

test(`program.statements does not contain ${1} statements. got=${program.getChildren().length}`, () => {
  expect(program.getChildren().length).toEqual(1);
});

const stmt = program.getChildren()[0];
test(`stmt is not ExpressionStatement. got=${typeof program.getChildren()[0]}`, () => {
  expect(stmt).toBeInstanceOf(ExpressionStatement);
});

const expr = stmt.expression;
test(`stmt.expression is not CallExpression. got=${typeof stmt.expression}`, () => {
  expect(expr).toBeInstanceOf(CallExpression);
});

testIdentifier(expr.fn, "add");

test(`wrong length of arguments, want ${3}. got=${expr.getArgs().length}`, () => {
  expect(expr.getArgs().length).toBe(3);
});

testLiteralExpression(expr.getArgs()[0], 1);
testInfixExpression(expr.getArgs()[1], 2, "*", 3);
testInfixExpression(expr.getArgs()[2], 4, "+", 5);
