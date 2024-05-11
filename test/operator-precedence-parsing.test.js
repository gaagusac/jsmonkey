const parser = require('../monkeyParser').parser;

class TestObj {
  constructor(input, expected) {
    this.input = input;
    this.expected = expected;
  }

  getInput() {
    return this.input;
  }

  getExpected() {
    return this.expected;
  }
}

const tests = [
  new TestObj("-a * b;", "((-a) * b)"),
  new TestObj("!-a;", "(!(-a))"),
  new TestObj("a + b + c;", "((a + b) + c)"),
  new TestObj("a + b - c;", "((a + b) - c)"),
  new TestObj("a * b * c;", "((a * b) * c)"),
  new TestObj("a * b / c;", "((a * b) / c)"),
  new TestObj("a + b / c;", "(a + (b / c))"),
  new TestObj("a + b * c + d / e - f;", "(((a + (b * c)) + (d / e)) - f)"),
  new TestObj("3 + 4; -5 * 5;", "(3 + 4)((-5) * 5)"),
  new TestObj("5 > 4 == 3 < 4;", "((5 > 4) == (3 < 4))"),
  new TestObj("5 < 4 != 3 > 4;", "((5 < 4) != (3 > 4))"),
  new TestObj("3 + 4 * 5 == 3 * 1 + 4 * 5;", "((3 + (4 * 5)) == ((3 * 1) + (4 * 5)))"),
  new TestObj("3 + 4 * 5 != 3 * 1 + 4 * 5;", "((3 + (4 * 5)) != ((3 * 1) + (4 * 5)))"),
  new TestObj("true;", "true"),
  new TestObj("false;", "false"),
  new TestObj("3 > 5 == false;", "((3 > 5) == false)"),
  new TestObj("3 < 5 == true;", "((3 < 5) == true)"),
  new TestObj("1 + (2 + 3) + 4;", "((1 + (2 + 3)) + 4)"),
  new TestObj("(5 + 5) * 2;", "((5 + 5) * 2)"),
  new TestObj("2 / (5 + 5);", "(2 / (5 + 5))"),
  new TestObj("-(5 + 5);", "(-(5 + 5))"),
  new TestObj("!(true == true);", "(!(true == true))"),
  new TestObj("a + add(b * c) + d", "((a + add((b * c))) + d)"),
  new TestObj("add(a, b, 1, 2 * 3, 4 +5, add(6, 7 * 8))", "add(a, b, 1, (2 * 3), (4 + 5), add(6, (7 * 8)))"),
  new TestObj("add(a + b + c * d / f + g)", "add((((a + b) + ((c * d) / f)) + g))"),
  new TestObj("a * [1, 2, 3, 4][b * c] * d", "((a * ([1, 2, 3, 4][(b * c)])) * d)"),
  new TestObj("add(a * b[2], b[1], 2 * [1, 2][1])", "add((a * (b[2])), (b[1]), (2 * ([1, 2][1])))"),
];

describe.each(tests)('Testing operator parsing precedence', t => {
  const program = parser.parse(t.getInput());
  const actual = program.string();

  it(`expected=${t.getExpected()}, got=${actual}`, () => {
    expect(actual).toBe(t.getExpected());
  });
});
