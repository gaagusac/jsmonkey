const parser = require('../monkeyParser').parser;

input = `
let myVar = anotherVar;
`

const program = parser.parse(input);

test('parser.parse(input) should not return null or undefined', () => {
  expect(program).toBeTruthy();
});

const statements = program.getChildren();

test('There should be one statement on the list', () => {
  expect(statements.length).toBe(1);
});

const programString = program.string();

test(`program.string() wrong. got='${programString}'`, () => {
  expect(programString).toBe("let myVar = anotherVar;");
})
