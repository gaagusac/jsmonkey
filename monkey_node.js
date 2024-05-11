/*
 * Abstract class Node
 *
 * @class Node
 */
class MonkeyNode {

  constructor() {
    if (this.constructor === MonkeyNode) {
      throw new Error("Abstract class MonkeyNode can't be instantiaded.");
    }
  }
  tokenLiteral() {
    throw new Error("Method 'tokenLiteral()' must be implemented.");
  }

  string() {
    throw new Error("Method 'string()' must be implemented.");
  }
}

/*
 * Statement.
 *
 * @abstract
 * @class Statement
 * @extends {MonkeyNode}
 */
class Statement extends MonkeyNode {

  constructor() {
    super();
    if (this.constructor === Statement) {
      throw new Error("Abstract class Statement can't be instantiaded.");
    }
  }

  statementNode() {
    throw new Error("Method 'statementNode()' must be implemented.");
  }

}

/*
 * Expression
 *
 * @abstract
 * @class Expression
 * @extends {MonkeyNode}
 */
class Expression extends MonkeyNode {

  constructor() {
    super();
    if (this.constructor === Expression) {
      throw new Error("Abstract class Expression can't be instantiaded.");
    }
  }

  expressionNode() {
    throw new Error("Method 'expressionNode()' must be implemented.");
  }

}
/*
 * Program
 *
 * @class Program
 * @extends {MonkeyNode}
 */
class Program extends MonkeyNode {

  constructor(statements) {
    super();
    this.statements = statements;
  }

  getChildren() {
    return this.statements;
  }

  tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0].tokenLiteral();
    } else {
      return "";
    }
  }

  string() {
    let out = "";
    this.statements.forEach((stmt) => {
      out += stmt.string();
    });
    return out;
  }
}

/*
 * LetStatement
 *
 * @class LetStatement
 * @extends {Statement}
 */
class LetStatement extends Statement {

  constructor(token, name, value) {
    super();
    this.token = token;
    this.name = name;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.value;
  }

  statementNode() {
    return true;
  }

  string() {
    let out = "";

    out += (this.token.value + " ");
    out += (this.name.string());
    out += " = ";

    if (this.value) {
      out += this.value.string();
    }

    out += ";";

    return out;
  }
}


/*
 * Identifier
 *
 * @class Identifier
 * @extends {Expression}
 */
class Identifier extends Expression {

  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  tokenLiteral() {
    return this.token.value;
  }

  expressionNode() {
    return true;
  }

  string() {
    return this.value;
  }
}

/*
 * ReturnStatement
 *
 * @class ReturnStatement
 * @extends {Statement}
 */
class ReturnStatement extends Statement {

  constructor(token, expression) {
    super();
    this.token = token;
    this.returnValue = expression;
  }

  statementNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    out += this.token.value;

    if (this.returnValue) {
      out += this.returnValue.string();
    }

    out += ";";

    return out;
  }
}

class ExpressionStatement extends Statement {
  constructor(token, expression) {
    super();
    this.token = token;
    this.expression = expression;
  }

  statementNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    if (this.expression) {
      return this.expression.string();
    }

    return "";
  }
}

class IntegerLiteral extends Expression {

  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    return this.token.value;
  }
}

class PrefixExpression extends Expression {

  constructor(token, operator, right) {
    super();
    this.token = token;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    out += "(";
    out += this.operator;
    out += this.right.string();
    out += ")";

    return out;
  }
}

class InfixExpression extends Expression {

  constructor(token, left, operator, right) {
    super();
    this.token = token;
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    out += "(";
    out += this.left.string();
    out += (" " + this.operator + " ");
    out += this.right.string();
    out += ")";

    return out;
  }
}

class BooleanLiteral extends Expression {
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    return this.token.value;
  }

}

class IfExpression extends Expression {
  constructor(token, condition, consequence, alternative) {
    super();
    this.token = token;
    this.condition = condition;
    this.consequence = consequence;
    this.alternative = alternative;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    out += "if";
    out += this.condition.string();
    out += " ";
    out += this.consequence.string();

    if (this.alternative) {
      out += "else ";
      out += this.alternative.string();
    }

    return out;
  }
}

class BlockStatement extends Statement {

  constructor(token, stmts) {
    super();
    this.token = token;
    this.statements = stmts;
  }

  statementNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    this.statements.forEach(stmt => {
      out += stmt.string();
    });

    return out;
  }

  getChildren() {
    return this.statements;
  }
}

class FunctionLiteral extends Expression {
  constructor(token, parameters, body) {
    super();
    this.token = token;
    this.parameters = parameters;
    this.body = body;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  getParameters() {
    return this.parameters;
  }

  getBody() {
    return this.body;
  }

  string() {
    let out = "";

    let params = [];

    this.parameters.forEach(param => {
      params.push(param.string());
    });

    out += this.tokenLiteral();
    out += "(";
    out += params.join(", ");
    out += ")";
    out += this.body.string();

    return out;
  }
}

class CallExpression extends Expression {
  constructor(token, fn, args) {
    super();
    this.token = token;
    this.fn = fn;
    this.args = args;
  }

  expressionNode() {
    return true;
  }

  getArgs() {
    return this.args;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    let ars = [];

    this.args.forEach(arg => {
      ars.push(arg.string());
    });

    out += this.fn.string();
    out += "(";
    out += ars.join(", ");
    out += ")";

    return out;
  }
}

class StringLiteral extends Expression {
  constructor(token, value) {
    super();
    this.token = token;
    this.value = value;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    return this.token.value;
  }
}

class ArrayLiteral extends Expression {
  constructor(token, elements) {
    super();
    this.token = token;
    this.elements = elements;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    const elements = [];
    this.elements.forEach(element => {
      elements.push(element.string());
    });

    out += "[";
    out += elements.join(", ");
    out += "]";

    return out;
  }
}

class IndexExpression extends Expression {
  constructor(token, left, index) {
    super();
    this.token = token;
    this.left = left;
    this.index = index;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    out += "(";
    out += this.left.string();
    out += "[";
    out += this.index.string();
    out += "])";

    return out;
  }
}

class HashLiteral extends Expression {
  constructor(token, pairs) {
    super();
    this.token = token;
    this.pairs = pairs;
  }

  expressionNode() {
    return true;
  }

  tokenLiteral() {
    return this.token.value;
  }

  string() {
    let out = "";

    const pairs = [];

    this.pairs.forEach((value, key) => {
      pairs.push(key.string() + ":" + value.string());
    });

    out += "{"
    out += pairs.join(", ");
    out += "}";

    return out;
  }
}

class WhileStatement extends Statement {

  constructor(token, condition, body) {
    super();
    this.token = token;
    this.condition = condition;
    this.body = body;
  }

  tokenLiteral() {
    return this.token.value;
  }

  statementNode() {
    return true;
  }

  string() {
    return "TODO: implement string() in while ast node.";
  }
}

class BreakStatement extends Statement {

  constructor(token) {
    super();
    this.token = token;
  }

  tokenLiteral() {
    return this.token.value;
  }

  statementNode() {
    return true;
  }

  string() {
    return "break";
  }
}

class ContinueStatement extends Statement {
  constructor(token) {
    super();
    this.token = token;
  }

  tokenLiteral() {
    return this.token.value;
  }

  statementNode() {
    return true;
  }

  string() {
    return "continue";
  }
}

module.exports = {
  Program,
  LetStatement,
  Identifier,
  ReturnStatement,
  ExpressionStatement,
  BooleanLiteral,
  IntegerLiteral,
  InfixExpression,
  PrefixExpression,
  FunctionLiteral,
  IfExpression,
  CallExpression,
  BlockStatement,
  StringLiteral,
  ArrayLiteral,
  IndexExpression,
  HashLiteral,
  WhileStatement,
  BreakStatement,
  ContinueStatement,
};
