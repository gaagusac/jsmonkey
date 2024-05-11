const parser = require('../monkeyParser').parser;
const HashLiteral = require('../monkey_node').HashLiteral;
const testInfixExpression = require('./utilities').testInfixExpression;
const StringLiteral = require('../monkey_node').StringLiteral;

const input = `
{ "one": 0 + 1, "two": 10 - 8, "three": 15 / 5 }
`;

const program = parser.parse(input);

const stmt = program.getChildren()[0];
const hash = stmt.expression;

test(`expr is not HashLiteral. got=${stmt}`, () => {
  expect(hash).toBeInstanceOf(HashLiteral);
});
test(`hash.pairs has the wrong length. got=${hash.pairs.size}`, () => {
  expect(hash.pairs.size).toBe(3);
});

const tests = {
  'one': (function (expr) { testInfixExpression(expr, 0, "+", 1); }),
  'two': (function (expr) { testInfixExpression(expr, 10, "-", 8); }),
  'three': (function (expr) { testInfixExpression(expr, 15, "/", 5); })
};

hash.pairs.forEach((value, key) => {
  test(`key is not StringLiteral. got=${key}`, () => {
    expect(key).toBeInstanceOf(StringLiteral);
  });
  const testFn = tests[key.string().slice(1, -1)];
  test(`no test function for key ${key.string()}`, () => {
    expect(testFn).not.toBeUndefined();
  });
  testFn(value);
});
