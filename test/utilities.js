
const IntLit = require('../monkey_node').IntegerLiteral;
const Ident = require('../monkey_node').Identifier;
const InfixExpr = require('../monkey_node').InfixExpression;
const BooleanLiteral = require('../monkey_node').BooleanLiteral;
const StringLiteral = require('../monkey_node').StringLiteral;

const parser = require('../monkeyParser').parser;
const Eval = require('../monkey_evaluator').Eval;
const IntObj = require('../monkey_obj').Integer;
const BoolObj = require('../monkey_obj').Bool;
const StrObj = require('../monkey_obj').Str;
const NULL = require('../monkey_evaluator').NULL;
const newEnvironment = require('../monkey_env').newEnvironment;

function testIntegerLiteral(expression, value) {
  const integ = expression;
  test(`il not IntegerLiteral. got=${typeof integ}`, () => {
    expect(integ).toBeInstanceOf(IntLit);
  });
  test(`integ.value not ${value}. got=${integ.value}`, () => {
    expect(integ.value).toStrictEqual(value);
  });
  test(`integ.tokenLiteral() not ${value}. got=${integ.tokenLiteral()}`, () => {
    expect(integ.tokenLiteral()).toMatch(value.toString());
  });
}

function testBooleanLiteral(expr, value) {
  test(`expr not BooleanLiteral. got=${typeof expr}`, () => {
    expect(expr).toBeInstanceOf(BooleanLiteral);
  });
  const bo = expr;
  test(`bo.value not ${value}. got=${bo.value}`, () => {
    expect(bo.value).toBe(value);
  });
  test(`bo.tokenLiteral() not ${value}. got=${bo.tokenLiteral()}`, () => {
    expect(value).toMatch(bo.tokenLiteral());
  });
}

function testStringLiteral(expr, value) {
  test(`expr not StringLiteral. got=${typeof expr}`, () => {
    expect(expr).toBeInstanceOf(StringLiteral);
  });
  test(`expr.value not ${value}. got${expr.value}`, () => {
    expect(expr.value).toStrictEqual(value);
  });
  test(`expr.tokenLiteral() not ${value}. got=${expr.tokenLiteral()}`, () => {
    expect(expr.tokenLiteral()).toMatch(value);
  });
}

function testIdentifier(expr, value) {
  const ident = expr;
  test(`expr not Identifier. got=${typeof expr}`, () => {
    expect(expr).toBeInstanceOf(Ident);
  });
  test(`ident.value not ${value}. got=${ident.value}`, () => {
    expect(ident.value).toBe(value);
  });
  test(`ident.tokenLiteral() not ${value}. got=${ident.tokenLiteral()}`, () => {
    expect(ident.tokenLiteral()).toMatch(value);
  });
}

function testLiteralExpression(expr, expected) {
  switch (typeof expected) {
    case "number":
      testIntegerLiteral(expr, expected);
      break;
    case "string":
      testIdentifier(expr, expected);
      break;
    case "boolean":
      testBooleanLiteral(expr, expected);
      break;
    default:
      throw new Error(`type of expr not handled. got=${typeof expr}`);
  }
}

function testInfixExpression(expr, left, operator, right) {
  const opExpr = expr;
  test(`expr is not InfixExpression. got=${typeof expr}`, () => {
    expect(expr).toBeInstanceOf(InfixExpr);
  });
  testLiteralExpression(opExpr.left, left);
  test(`expr.operator is not ${operator}. got=${opExpr.operator}`, () => {
    expect(opExpr.operator).toMatch(operator);
  });
  testLiteralExpression(opExpr.right, right);
}

function testEval(input) {
  const program = parser.parse(input);
  const env = newEnvironment();
  return Eval(program, env);
}

function testIntegerObject(obj, expected) {
  const result = obj;
  test(`object is not Integer. got=${typeof obj}`, () => {
    expect(obj).toBeInstanceOf(IntObj);
  });
  test(`object has wrong value. got=${result.value}. want=${expected}`, () => {
    expect(result.value).toStrictEqual(expected);
  });
}

function testStringObject(obj, expected) {
  const result = obj;
  test(`object is not Str. got=${typeof obj}`, () => {
    expect(obj).toBeInstanceOf(StrObj);
  });
  test(`object has wrong value. got=${result.value}. want=${expected}`, () => {
    expect(result.value).toStrictEqual(expected);
  });
}

function testBooleanObject(obj, expected) {
  const result = obj;
  test(`object is not Boolean. got=${typeof obj}`, () => {
    expect(obj).toBeInstanceOf(BoolObj);
  });
  test(`object has wrong value. got=${result.value}. want=${expected}`, () => {
    // expect(result.value).toBe(expected);
    expect(result.value).toStrictEqual(expected);
  });
}

function testNullObject(obj) {
  test(`object is not NULL. got=${obj}`, () => {
    expect(obj).toBe(NULL);
  });
}

module.exports = {
  testIntegerLiteral,
  testIdentifier,
  testLiteralExpression,
  testInfixExpression,
  testBooleanLiteral,
  testEval,
  testIntegerObject,
  testBooleanObject,
  testNullObject,
  testStringLiteral,
  testStringObject,
};
