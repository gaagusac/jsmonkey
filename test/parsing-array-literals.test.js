const parser = require('../monkeyParser').parser;
const ArrayLiteral = require('../monkey_node').ArrayLiteral;
const testIntegerLiteral = require('./utilities').testIntegerLiteral;
const testInfixExpression = require('./utilities').testInfixExpression;

const input = `
[1, 2 * 2, 3 + 3]
`;

const program = parser.parse(input);

const stmt = program.getChildren()[0];
const arr = stmt.expression;

test(`expr not ArrayLiteral. got=${stmt}`, () => {
  expect(arr).toBeInstanceOf(ArrayLiteral);
});

test(`array length not 3. got=${arr.elements.length}`, () => {
  expect(arr.elements.length).toBe(3);
});

testIntegerLiteral(arr.elements[0], 1);
testInfixExpression(arr.elements[1], 2, "*", 2);
testInfixExpression(arr.elements[2], 3, "+", 3);
