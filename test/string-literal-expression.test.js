const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const testStringLiteral = require('./utilities').testStringLiteral;

const input = `
"hello world";
`;

const program = parser.parse(input);

test(`program.statement[0] not ExpressionStatement. got=${program.getChildren()[0]}`, () => {
  expect(program.getChildren()[0]).toBeInstanceOf(ExpressionStatement);
});

const stmt = program.getChildren()[0];
const literal = stmt.expression;
testStringLiteral(literal, "hello world");
