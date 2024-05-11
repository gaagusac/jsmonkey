const parser = require('../monkeyParser').parser;
const ExpressionStatement = require('../monkey_node').ExpressionStatement;
const IntegerLiteral = require('../monkey_node').IntegerLiteral;

const input = `
5;
`;

const program = parser.parse(input);

describe('Testing integer literal expression', () => {
  it(`program has not enough statements. got=${program.getChildren().length}`, () => {
    expect(program.getChildren().length).toBe(1);
  });
  const stmt = program.getChildren()[0];
  it(`program.statements[0] is not ExpressionStatement. got=${stmt}`, () => {
    expect(stmt).toBeInstanceOf(ExpressionStatement);
  });
  const literal = stmt.expression;
  it(`exp not IntegerLiteral. got=%{literal}`, () => {
    expect(literal).toBeInstanceOf(IntegerLiteral);
  });
  it(`literal.value not {5}. got=${literal.value}`, () => {
    expect(literal.value).toStrictEqual(5);
  });
  it(`literal.tokenLiteral() not {"5"}. got=${literal.tokenLiteral()}`, () => {
    expect(literal.tokenLiteral()).toBe("5");
  });
})
