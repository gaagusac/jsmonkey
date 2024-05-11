const LetStatement = require('../monkey_node').LetStatement;
const parser = require('../monkeyParser').parser;

input = `
let x = 5;
let y = 10;
let foobar = 838383;
`
// get an AST from the parse method.
const result = parser.parse(input);

class TestObj {

  constructor(expectedIdentifier) {
    this.expectedIdentifier = expectedIdentifier;
  }

  getExpectedIdentifier() {
    return this.expectedIdentifier;
  }

}
const tests = [
  new TestObj("x"),
  new TestObj("y"),
  new TestObj("foobar"),
];


// Parse result shoudln't be null or undefined.
test('result should not be null or undefined', () => {
  expect(result).toBeTruthy();
});

// List of statements in the root node (Program)
const statements = result.getChildren();

// There should be three let statements.
test(`There should be ${statements.length} equal to three.`, () => {
  expect(statements.length).toEqual(3);
});

// There shoud be a better way to this.
let index = 0;

describe.each(statements)('Testing list of let statements', (stmt) => {
  testLetStatement(stmt, tests[index].getExpectedIdentifier());
  index++;
});

// helper function to test a let statement.
function testLetStatement(s, name) {
  test(`s.tokenLiteral() not 'let'. got=${s}`, () => {
    expect(s.tokenLiteral()).toBe('let');
  });
  const letStmt = s;
  test(`s not LetStatement. got=${typeof s}`, () => {
    expect(s instanceof LetStatement).toBe(true);
  });
  test(`letStmt.name.value not ${name}. got=${letStmt.name.value}`, () => {
    expect(letStmt.name.value).toEqual(name);
  });
  test(`s.name not ${name}. got=${letStmt.name}`, () => {
    expect(letStmt.name.tokenLiteral()).toEqual(name);
  });
}
