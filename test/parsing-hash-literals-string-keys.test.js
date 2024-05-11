const parser = require('../monkeyParser');
const HashLiteral = require('../monkey_node').HashLiteral;
const StringLiteral = require('../monkey_node').StringLiteral;
const testIntegerLiteral = require('./utilities').testIntegerLiteral;

const input = `
{"one": 1, "two": 2, "three": 3}
`;

const program = parser.parse(input);

const stmt = program.getChildren()[0];
const hash = stmt.expression;

test(`expr is not HashLiteral. got=${stmt.expression}`, () => {
  expect(hash).toBeInstanceOf(HashLiteral);
});

test(`hash.pairs has wrong length. got=${hash.size}`, () => {
  expect(hash.pairs.size).toBe(3);
});

const expected = {
  'one': 1,
  'two': 2,
  'three': 3,
};

hash.pairs.forEach((value, key) => {
  test(`key is not StringLiteral. got=${key}`, () => {
    expect(key).toBeInstanceOf(StringLiteral);
  });
  const expectedValue = expected[key.string().slice(1, -1)];
  testIntegerLiteral(value, expectedValue);
});
