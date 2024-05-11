const testEval = require('./utilities').testEval;
const StringObj = require('../monkey_obj').Str;

const input = `
"Hello" + " " + "World!"
`;

const evaluated = testEval(input);

test(`object is not String. got=${evaluated}`, () => {
  expect(evaluated).toBeInstanceOf(StringObj);
});

test(`String has wrong value. got=${evaluated.value}`, () => {
  expect(evaluated.value).toStrictEqual("Hello World!");
});
