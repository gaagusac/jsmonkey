const lexer = require('../monkey_lexer').monkey_lexer;
const getTokenList = require('../lexer_utils').getTokenList;


// The source code.
const input = `
let five = 5;
let ten = 10;

let add = fn(x, y) {
    x + y;
};

let result = add(five, ten);
!-/*5;
5 < 10 > 5;

if (5 < 10) {
  return true;
} else {
  return false;
}

10 == 10;
10 != 9;

"foobar";
"foo bar";

[1, 2];
{"foo": "bar"}
`;

// Mock object for the test.
class TestObj {
  constructor(expectedType, expectedLiteral) {
    this.expectedType = expectedType;
    this.expectedLiteral = expectedLiteral;
  }

  getType() {
    return this.expectedType;
  }

  getLiteral() {
    return this.expectedLiteral;
  }
}

const tests = [
  // let five = 5;
  new TestObj("LET", "let"),
  new TestObj("IDENT", "five"),
  new TestObj("ASSIGN", "="),
  new TestObj("INT", "5"),
  new TestObj("SEMICOLON", ";"),
  // let ten = 10;
  new TestObj("LET", "let"),
  new TestObj("IDENT", "ten"),
  new TestObj("ASSIGN", "="),
  new TestObj("INT", "10"),
  new TestObj("SEMICOLON", ";"),
  // let add = fn(x, y) {
  new TestObj("LET", "let"),
  new TestObj("IDENT", "add"),
  new TestObj("ASSIGN", "="),
  new TestObj("FUNCTION", "fn"),
  new TestObj("LPAREN", "("),
  new TestObj("IDENT", "x"),
  new TestObj("COMMA", ","),
  new TestObj("IDENT", "y"),
  new TestObj("RPAREN", ")"),
  new TestObj("LBRACE", "{"),
  // x + y; };
  new TestObj("IDENT", "x"),
  new TestObj("PLUS", "+"),
  new TestObj("IDENT", "y"),
  new TestObj("SEMICOLON", ";"),
  new TestObj("RBRACE", "}"),
  new TestObj("SEMICOLON", ";"),
  // let result = add(five, ten);
  new TestObj("LET", "let"),
  new TestObj("IDENT", "result"),
  new TestObj("ASSIGN", "="),
  new TestObj("IDENT", "add"),
  new TestObj("LPAREN", "("),
  new TestObj("IDENT", "five"),
  new TestObj("COMMA", ","),
  new TestObj("IDENT", "ten"),
  new TestObj("RPAREN", ")"),
  new TestObj("SEMICOLON", ";"),
  // !-/*5;
  new TestObj("BANG", "!"),
  new TestObj("MINUS", "-"),
  new TestObj("SLASH", "/"),
  new TestObj("ASTERISK", "*"),
  new TestObj("INT", "5"),
  new TestObj("SEMICOLON", ";"),
  // 5 < 10 > 5;
  new TestObj("INT", "5"),
  new TestObj("LT", "<"),
  new TestObj("INT", "10"),
  new TestObj("GT", ">"),
  new TestObj("INT", "5"),
  new TestObj("SEMICOLON", ";"),
  // if (5 < 10) {
  new TestObj("IF", "if"),
  new TestObj("LPAREN", "("),
  new TestObj("INT", "5"),
  new TestObj("LT", "<"),
  new TestObj("INT", "10"),
  new TestObj("RPAREN", ")"),
  new TestObj("LBRACE", "{"),
  // return true; }
  new TestObj("RETURN", "return"),
  new TestObj("TRUE", "true"),
  new TestObj("SEMICOLON", ";"),
  new TestObj("RBRACE", "}"),
  // else { return false; }
  new TestObj("ELSE", "else"),
  new TestObj("LBRACE", "{"),
  new TestObj("RETURN", "return"),
  new TestObj("FALSE", "false"),
  new TestObj("SEMICOLON", ";"),
  new TestObj("RBRACE", "}"),
  // 10 == 10;
  new TestObj("INT", "10"),
  new TestObj("EQ", "=="),
  new TestObj("INT", "10"),
  new TestObj("SEMICOLON", ";"),
  // 10 != 9;
  new TestObj("INT", "10"),
  new TestObj("NOT_EQ", "!="),
  new TestObj("INT", "9"),
  new TestObj("SEMICOLON", ";"),
  // "foobar";
  new TestObj("STRING", '"foobar"'),
  new TestObj("SEMICOLON", ";"),
  // "foo bar";
  new TestObj("STRING", '"foo bar"'),
  new TestObj("SEMICOLON", ";"),
  // [1, 2];
  new TestObj("LBRACKET", "["),
  new TestObj("INT", "1"),
  new TestObj("COMMA", ","),
  new TestObj("INT", "2"),
  new TestObj("RBRACKET", "]"),
  new TestObj("SEMICOLON", ";"),
  // {"foo": "bar"}
  new TestObj("LBRACE", "{"),
  new TestObj("STRING", '"foo"'),
  new TestObj("COLON", ":"),
  new TestObj("STRING", '"bar"'),
  new TestObj("RBRACE", "}"),
  // EOF Token
  new TestObj("EOF", ""),
];

// give the lexer some input.
lexer.setInput(input);
// get the token list from the lexer.
const tokenList = getTokenList(lexer);

// there should be n tokens in the list.
test(`There should be ${tests.length} tokens in the input.`, () => {
  const tokenFromInput = tests.length;
  const tokenFromLexer = tokenList.length;
  expect(tokenFromLexer).toBe(tokenFromInput);
});

let currentTestIndex = 0;

// Test each token.
describe.each(tests)('Testing list of tokens', (t) => {
  const ttype = tokenList[currentTestIndex].type;
  const tliteral = tokenList[currentTestIndex].literal;
  it(`${t.getType()} should be equal to ${ttype}`, () => {
    expect(t.getType()).toBe(ttype);
  });
  it(`${t.getLiteral()} should be equal to ${tliteral}`, () => {
    expect(t.getLiteral()).toBe(tliteral);
  });
  currentTestIndex += 1;
});
