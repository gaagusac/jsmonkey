const testEval = require('./utilities').testEval;
const FuncObj = require('../monkey_obj').Function;

const input = `
fn(x) { x + 2; };
`;

const evaluated = testEval(input);

test(`object is not Function. got=${evaluated}`, () => {
  expect(evaluated).toBeInstanceOf(FuncObj);
});
const fn = evaluated;
test(`function has wrong parameters. ${fn.getParameters()}`, () => {
  expect(fn.getParameters().length).toBe(1);
});

test(`parameter is not 'x'. got=${fn.getParameters()[0]}`, () => {
  expect(fn.getParameters()[0].string()).toMatch("x");
});

const expectedBody = "(x + 2)";

test(`body is not ${expectedBody}. got=${fn.getBody().string()}`, () => {
  expect(fn.getBody().string()).toMatch(expectedBody);
});
