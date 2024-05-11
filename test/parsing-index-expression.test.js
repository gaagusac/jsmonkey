const parser = require('../monkeyParser').parser;
const IndexExpression = require('../monkey_node').IndexExpression;
const testIdentifier = require('./utilities').testIdentifier;
const testInfixExpression = require('./utilities').testInfixExpression;

const input = `
myArray[1 + 1]
`;

const program = parser.parse(input);

const stmt = program.getChildren()[0];
const indexExpr = stmt.expression;

test(`expr not IndexExpression. got=${indexExpr}`, () => {
  expect(indexExpr).toBeInstanceOf(IndexExpression);
});

testIdentifier(indexExpr.left, "myArray");
testInfixExpression(indexExpr.index, 1, "+", 1);
