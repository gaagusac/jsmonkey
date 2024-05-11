const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const Identifier = require('../monkey_node').Identifier;

input = `
foobar;
`;

const program = parser.parse(input);

describe('Testing identifier expression', () => {
  it(`program has not enough statements. got=${program.getChildren().length}`, () => {
    expect(program.getChildren().length).toBe(1);
  });
  const stmt = program.getChildren()[0];
  it(`program.statements[0] is not ExpressionStatement. got=${typeof stmt}`, () => {
    expect(stmt).toBeInstanceOf(ExpressionStatement);
  });
  const expr = stmt.expression;
  it(`expr not Identifier. got=${Identifier}`, () => {
    expect(expr).toBeInstanceOf(Identifier);
  });
  const ident = expr;
  it(`ident.value not 'foobar'. got=${ident.value}`, () => {
    expect(ident.value).toBe("foobar");
  });
  it(`ident.tokenLiteral() not 'foobar'. got=${ident.tokenLiteral()}`, () => {
    expect(ident.tokenLiteral()).toBe("foobar");
  });
});
