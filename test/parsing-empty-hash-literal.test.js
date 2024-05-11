const parser = require('../monkeyParser').parser;
const HashLiteral = require('../monkey_node').HashLiteral;
const input = `{}`;

const program = parser.parse(input);

const stmt = program.getChildren()[0];
const hash = stmt.expression;

test(`expr is not HashLiteral. got=${stmt.expression}`, () => {
  expect(stmt.expression).toBeInstanceOf(HashLiteral);
});

test(`hash.pairs has wrong length. got=${hash.pairs.size}`, () => {
  expect(hash.pairs.size).toBe(0);
});
