const testEval = require('./utilities').testEval;
const ArrayObj = require('../monkey_obj').ArrayObject;
const testIntegerObject = require('./utilities').testIntegerObject;

const input = `
[1, 2 * 2, 3 + 3]
`;

const evaluated = testEval(input);

const result = evaluated;

test(`object is not Array. got=${evaluated}.`, () => {
  expect(result).toBeInstanceOf(ArrayObj);
});

test(`array has wrong number of elements. got=${result.elements.length}`, () => {
  expect(result.elements.length).toBe(3);
});

testIntegerObject(result.elements[0], 1);
testIntegerObject(result.elements[1], 4);
testIntegerObject(result.elements[2], 6);
