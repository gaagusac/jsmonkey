const testEval = require('./utilities').testEval;
const StringObject = require('../monkey_obj').Str;
const HashObject = require('../monkey_obj').MonkeyHash;
const testIntegerObject = require('./utilities').testIntegerObject;
const IntegerObject = require('../monkey_obj').Integer;
const TRUE = require('../monkey_evaluator').TRUE;
const FALSE = require('../monkey_evaluator').FALSE;

const input = `
let two = "two";
{
    "one": 10 - 9,
    two: 1 + 1,
    "thr" + "ee": 6 / 2,
    4: 4,
    true: 5,
    false: 6
}
`;

const evaluated = testEval(input);
const result = evaluated;

test(`Eval didn't return Hash. got=${result.constructor.name}`, () => {
  expect(evaluated).toBeInstanceOf(HashObject);
});

const expected = new Map();
expected.set(new StringObject("one").hashkey(), 1);
expected.set(new StringObject("two").hashkey(), 2);
expected.set(new StringObject("three").hashkey(), 3);
expected.set(new IntegerObject(4).hashkey(), 4);
expected.set(TRUE.hashkey(), 5);
expected.set(FALSE.hashkey(), 6);

test(`Hash has wrong number of pairs. got=${result.pairs.size}`, () => {
  expect(result.pairs.size).toBe(expected.size);
});

for (entry of expected) {
  const expectedKey = entry[0];
  const expectedValue = entry[1];
  const pair = result.pairs.get(expectedKey.value);
  test(`no pair for given key in pairs`, () => {
    expect(pair).not.toBeUndefined();
  });
  testIntegerObject(pair.value, expectedValue);
}
