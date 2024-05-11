
// Objects of the type system
const IntObj = require('./monkey_obj').Integer;
const BoolObj = require('./monkey_obj').Bool;
const NullOjb = require('./monkey_obj').Null;
const ReturnValObj = require('./monkey_obj').ReturnValue;
const ErrorObj = require('./monkey_obj').RtError;
const FunctionObj = require('./monkey_obj').Function;
const StrObj = require('./monkey_obj').Str;
const BuiltinObj = require('./monkey_obj').Builtin;
const ArrayObj = require('./monkey_obj').ArrayObject;
const HashObj = require('./monkey_obj').MonkeyHash;
const HashPair = require('./monkey_obj').HashPair;

// Types of expressions and statements
const Program = require('./monkey_node').Program;
const IntLit = require('./monkey_node').IntegerLiteral;
const BoolLit = require('./monkey_node').BooleanLiteral;
const ExpressionStatement = require('./monkey_node').ExpressionStatement;
const PrefixExpression = require('./monkey_node').PrefixExpression;
const InfixExpression = require('./monkey_node').InfixExpression;
const BlockStatement = require('./monkey_node').BlockStatement;
const IfExpression = require('./monkey_node').IfExpression;
const ReturnStatement = require('./monkey_node').ReturnStatement;
const LetStatement = require('./monkey_node').LetStatement;
const Identifier = require('./monkey_node').Identifier;
const FunctionLiteral = require('./monkey_node').FunctionLiteral;
const CallExpression = require('./monkey_node').CallExpression;
const StringLiteral = require('./monkey_node').StringLiteral;
const ArrayLiteral = require('./monkey_node').ArrayLiteral;
const IndexExpression = require('./monkey_node').IndexExpression;
const HashLiteral = require('./monkey_node').HashLiteral;

// The environment
const newEnvironment = require('./monkey_env').newEnvironment;
const newEnclosedEnvironment = require('./monkey_env').newEnclosedEnvironment;

const INTEGER = require('./monkey_obj').ObjectType.INTEGER;
const STRING = require('./monkey_obj').ObjectType.STRING_OBJ;
const ARRAY_OBJ = require('./monkey_obj').ObjectType.ARRAY_OBJ;
const HASH_OBJ = require('./monkey_obj').ObjectType.HASH_OBJ;

const RETURN_VALUE_OBJ = require('./monkey_obj').ObjectType.RETURN_VALUE;

const TRUE = new BoolObj(true);
const FALSE = new BoolObj(false);
const NULL = new NullOjb();

// The builtin functions
const builtins = new Map();

// This function returns the length of a string or array.
builtins.set("len", new BuiltinObj((function (...args) {
  if (args.length != 1) {
    return newError(`wrong number of arguments. got=${args.length}, want=1`);
  }
  const arg = args[0];
  if (arg instanceof StrObj) {
    return new IntObj(Number(arg.value.length));
  } else if (arg instanceof ArrayObj) {
    // return new IntObj(Number(0));
    return new IntObj(Number(arg.elements.length));
  } else {
    return newError(`argument to 'len' not supported, got=${arg.type()}`);
  }
})));

// This function returs the first element of the given array(a pretty name for array[0])
builtins.set("first", new BuiltinObj((function (...args) {
  if (args.length != 1) {
    return newError(`wrong number of arguments. got=${args.length}. want=${1}`);
  }
  if (args[0].type() != ARRAY_OBJ) {
    return newError(`argument to 'first' must be ARRAY. got ${args[0].type()}`);
  }

  const arr = args[0];
  if (arr.elements.length > 0) {
    return arr.elements[0];
  }

  return NULL;
})));

// This function returns the last element fo the given array(a pretty name for array[length-1])
builtins.set("last", new BuiltinObj((function (...args) {
  if (args.length != 1) {
    return newError(`wrong number of arguments. got=${args.length}, want=${1}`);
  }
  if (args[0].type() != ARRAY_OBJ) {
    return newError(`argument to 'last' must be ARRAY, got ${args[0].type()}`);
  }

  const arr = args[0];
  const length = arr.elements.length;
  if (length > 0) {
    return arr.elements[length - 1];
  }

  return NULL;
})));

// This function returns a NEW array containing all elements of the array passed as argument, except the first one.
builtins.set("rest", new BuiltinObj((function (...args) {
  if (args.length != 1) {
    return newError(`wrong number of arguments. got=${args.length}, want=${1}`);
  }
  if (args[0].type() != ARRAY_OBJ) {
    return newError(`argument to 'rest' must be ARRAY, got ${args[0].type()}`);
  }
  const arr = args[0];
  const length = arr.elements.length;
  if (length > 0) {
    return new ArrayObj(arr.elements.slice(1, length));
  }

  return NULL;
})));

// This function adds a new element to the end of the array. return a NEW array.
builtins.set("push", new BuiltinObj((function (...args) {
  if (args.length != 2) {
    return newError(`wrong number of arguments. got=${args.length}, want=${2}`);
  }
  if (args[0].type() != ARRAY_OBJ) {
    return newError(`argument to 'push' must be ARRAY. got ${args[0].type()}`);
  }

  const arr = args[0];
  const newElements = arr.elements.slice();
  newElements.push(args[1]);

  return new ArrayObj(newElements);
})));

// prints the given arguments on new ines to stdout.
builtins.set("puts", new BuiltinObj((function (...args) {
  args.forEach(arg => {
    console.log(arg.inspect());
  });

  return NULL;
})));

// return a string representation of the argument.
builtins.set("str", new BuiltinObj((function (...args) {
  if (args.length != 1) {
    return newError(`wrong number of arguments. got=${args.length}, want=${1}`);
  }
  const arg = args[0];
  if (arg.type() == INTEGER) {
    return new StrObj(arg.inspect());
  }

  return NULL;
})));

// Here come evaluation of the tree
function Eval(node, env) {

  switch (node.constructor) {
    case Program:
      return evalProgram(node, env);
    case ExpressionStatement:
      return Eval(node.expression, env);
    case IntLit:
      return new IntObj(node.value);
    case BoolLit:
      return nativeBooleanToBoolObject(node.value);
    case StringLiteral:
      return new StrObj(node.value);
    case PrefixExpression:
      const right = Eval(node.right, env);
      if (isError(right)) {
        return right;
      }
      return evalPrefixExpression(node.operator, right);
    case InfixExpression:
      const l = Eval(node.left, env);
      if (isError(l)) {
        return l;
      }
      const r = Eval(node.right, env);
      if (isError(r)) {
        return r;
      }
      return evalInfixExpression(node.operator, l, r);
    case BlockStatement:
      return evalBlockStatement(node, env);
    case IfExpression:
      return evalIfExpression(node, env);
    case ReturnStatement:
      const val = Eval(node.returnValue, env);
      if (isError(val)) {
        return val;
      }
      return new ReturnValObj(val);
    case LetStatement:
      const v = Eval(node.value, env);
      if (isError(v)) {
        return v;
      }
      env.Set(node.name.value, v);
      break;
    case Identifier:
      return evalIdentifier(node, env);
    case FunctionLiteral:
      return new FunctionObj(node.parameters, node.body, env);
    case CallExpression:
      const fn = Eval(node.fn, env);
      if (isError(fn)) {
        return fn;
      }
      const args = evalExpressions(node.args, env);
      if (args.length == 1 && isError(args[0])) {
        return args[0];
      }
      return applyFunction(fn, args);
    case ArrayLiteral:
      const elements = evalExpressions(node.elements, env);
      if (elements.length == 1 && isError(elements[0])) {
        return elements[0];
      }
      return new ArrayObj(elements);
    case IndexExpression:
      const leftExpr = Eval(node.left, env);
      if (isError(leftExpr)) {
        return leftExpr;
      }
      const indexExpr = Eval(node.index, env);
      if (isError(indexExpr)) {
        return indexExpr;
      }
      return evalIndexExpression(leftExpr, indexExpr);
    case HashLiteral:
      return evalHashLiteral(node, env);
  }
  return null;
}

function evalProgram(program, env) {
  let result = null;
  const stmts = program.getChildren();

  for (let stmt = 0; stmt < stmts.length; stmt++) {
    result = Eval(stmts[stmt], env);

    if (result instanceof ReturnValObj) {
      return result.value;
    }
    if (result instanceof ErrorObj) {
      return result;
    }
  }

  return result;
}

function evalBlockStatement(bs, env) {
  let result = null;
  const stmts = bs.getChildren();

  for (let stmt = 0; stmt < stmts.length; stmt++) {
    result = Eval(stmts[stmt], env);

    if (result != null) {
      if (result.type() == RETURN_VALUE_OBJ || result.type() == ErrorObj) {
        return result;
      }
    }
  }

  return result;
}

function evalExpressions(exprs, env) {
  const result = [];

  for (let expr = 0; expr < exprs.length; expr++) {
    const evaluated = Eval(exprs[expr], env);
    if (isError(evaluated)) {
      return [evaluated];
    }
    result.push(evaluated);
  }

  return result;
}

function evalIndexExpression(left, index) {
  if (left.type() == ARRAY_OBJ && index.type() == INTEGER) {
    return evalArrayIndexExpression(left, index);
  } else if (left.type() == HASH_OBJ) {
    return evalHashIndexExpression(left, index);
  } else {
    return newError(`index operator not supported: ${left.type()}`);
  }
}

function evalArrayIndexExpression(array, index) {
  const idx = index.value;
  const max = Number(array.elements.length - 1);

  if (idx < 0 || idx > max) {
    return NULL;
  }

  return array.elements[idx];
}

function evalHashLiteral(node, env) {
  const pairs = new Map();
  for (entry of node.pairs) {
    const key = Eval(entry[0], env);
    if (isError()) {
      return key;
    }
    if (!key.hashable()) {
      return newError(`unusable as hash key: ${key.type()}`);
    }
    const value = Eval(entry[1], env);
    if (isError(value)) {
      return value;
    }
    const hashed = key.hashkey();
    pairs.set(hashed.value, new HashPair(key, value));
  }
  return new HashObj(pairs);
}

function evalHashIndexExpression(hash, index) {

  if (!index.hashable) {
    return newError(`unusable as hash key: ${index.type()}`);
  }

  const pair = hash.pairs.get(index.hashkey().value);
  if (pair) {
    return pair.value;
  }

  return NULL;
}
function applyFunction(fn, args) {

  if (fn instanceof FunctionObj) {
    const extendedEnv = extendFunctionEnv(fn, args);
    const evaluated = Eval(fn.getBody(), extendedEnv);
    return unwrapReturnValue(evaluated);
  } else if (fn instanceof BuiltinObj) {
    return fn.fn(...args);
  } else {
    return newError(`not a function: ${fn.type()}`);
  }

  // return newError(`not a function: ${fn.type()}`);
  // const extendedEnv = extendFunctionEnv(fn, args);
  // const evaluated = Eval(fn.getBody(), extendedEnv);
  // return unwrapReturnValue(evaluated);
}

function extendFunctionEnv(fn, args) {
  const env = newEnclosedEnvironment(fn.env);
  fn.getParameters().forEach((arg, index) => {
    env.Set(arg.value, args[index]);
  });

  return env;
}

function unwrapReturnValue(obj) {
  if (obj instanceof ReturnValObj) {
    return obj.value;
  }

  return obj;
}
// function evalStatements(stmts) {
//   let result = null;

//   for (let i = 0; i < stmts.length; i++) {
//     result = Eval(stmts[i]);
//     if (result instanceof ReturnValObj) {
//       return result.value;
//     }
//   }

//   return result;
// }

function evalPrefixExpression(operator, right) {
  switch (operator) {
    case "!":
      return evalBangOperatorExpression(right);
    case "-":
      return evalMinusPrefixOperatorExpression(right);
    default:
      return newError(`unknown operator: ${operator}${right.type()}`);
  }
}

function evalInfixExpression(operator, left, right) {

  if (left.type() == INTEGER && right.type() == INTEGER) {
    return evalIntegerInfixExpression(operator, left, right);
  }

  if (left.type() == STRING && right.type() == STRING) {
    return evalInfixStringExpression(operator, left, right);
  }

  switch (operator) {
    case "==":
      return nativeBooleanToBoolObject(left == right);
    case "!=":
      return nativeBooleanToBoolObject(left != right);
  }

  if (left.type() != right.type()) {
    return newError(`type mismatch: ${left.type()} ${operator} ${right.type()}`);
  }

  return newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
}

function evalInfixStringExpression(operator, left, right) {
  if (operator != "+") {
    return newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
  }

  const leftValue = left.value;
  const rightValue = right.value;

  return new StrObj(leftValue + rightValue);
}

function evalIntegerInfixExpression(operator, left, right) {
  const leftValue = left.value;
  const rightValue = right.value;

  switch (operator) {
    case "+":
      return new IntObj(leftValue + rightValue);
    case "-":
      return new IntObj(leftValue - rightValue);
    case "*":
      return new IntObj(leftValue * rightValue);
    case "/":
      return new IntObj(leftValue / rightValue);
    case "<":
      return nativeBooleanToBoolObject(leftValue < rightValue);
    case ">":
      return nativeBooleanToBoolObject(leftValue > rightValue);
    case "==":
      return nativeBooleanToBoolObject(leftValue == rightValue);
    case "!=":
      return nativeBooleanToBoolObject(leftValue != rightValue);
    default:
      return newError(`unknown operator: ${left.type()} ${operator} ${right.type()}`);
  }
}

function evalBangOperatorExpression(right) {
  switch (right) {
    case TRUE:
      return FALSE;
    case FALSE:
      return TRUE;
    case NULL:
      return TRUE;
    default:
      return FALSE;
  }
}

function evalMinusPrefixOperatorExpression(right) {
  if (right.type() != INTEGER) {
    return newError(`unknown operator: -${right.type()}`)
  }

  return new IntObj(-right.value);
}

function nativeBooleanToBoolObject(value) {
  if (value) {
    return TRUE;
  }
  return FALSE;
}

function evalIfExpression(ie, env) {
  const condition = Eval(ie.condition, env);
  if (isError(condition)) {
    return condition;
  }
  if (isTruthy(condition)) {
    return Eval(ie.consequence, env);
  } else if (ie.alternative) {
    return Eval(ie.alternative, env);
  } else {
    return NULL;
  }
}

function isTruthy(obj) {
  if (obj === NULL) {
    return false;
  } else if (obj === TRUE) {
    return true;
  } else if (obj === FALSE) {
    return false;
  } else {
    return true;
  }
}

function newError(message) {
  return new ErrorObj(message);
}

function isError(obj) {
  if (obj != null) {
    return obj.type() == ErrorObj;
  }
  return false;
}

function evalIdentifier(node, env) {
  const val = env.Get(node.value);
  if (val) {
    return val;
  }
  // Maybe is a builtin function ?
  const builtFn = builtins.get(node.value);
  if (builtFn) {
    return builtFn;
  }

  return newError(`identifier not found: ${node.value}`);
}

module.exports = {
  Eval,
  TRUE,
  FALSE,
  NULL,
};
