const parser = require('../monkeyParser').parser;
const ReturnStatement = require('../monkey_node').ReturnStatement;

input = `
return 5;
return 10;
return 993322;
`

const parseResult = parser.parse(input);

const returnStatements = parseResult.getChildren();

test(`program.statements does not contain 3 statements. got=${returnStatements.lenght}`, () => {
  expect(returnStatements.length).toEqual(3);
});

describe.each(returnStatements)('Testing return statemens', (rs) => {
  test(`rs not ReturnStatement. got=${rs.constructor.name}`, () => {
    expect(rs).toBeInstanceOf(ReturnStatement);
  });
  const returnStmt = rs;
  test(`returnStmt.tokenLiteral not 'return', got=${returnStmt.tokenLiteral()}`, () => {
    expect(returnStmt.tokenLiteral()).toEqual('return');
  });
});
