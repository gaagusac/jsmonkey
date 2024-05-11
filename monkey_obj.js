const crypto = require('crypto');

const ObjectType = Object.freeze(
  {
    "INTEGER": "INTEGER",
    "BOOLEAN": "BOOLEAN",
    "NULL": "NULL",
    "RETURN_VALUE": "RETURN_VALUE",
    "ERROR_OBJ": "ERROR_OBJ",
    "FUNCTION_OBJ": "FUNCTION_OBJ",
    "STRING_OBJ": "STRING_OBJ",
    "BUILTIN_OBJ": "BUILTIN",
    "ARRAY_OBJ": "ARRAY",
    "HASH_OBJ": "HASH",
  }
);

/*
 * class MonkeyObj
 *
 * @abstract
 * @class MonkeyObj
 */
class MonkeyObj {
  constructor() {
    if (this.constructor === MonkeyObj) {
      throw new Error("Abstract class MonkeyObj can't be instantiaded.");
    }
  }

  type() {
    throw new Error("Method 'type()' must be implemented.");
  }

  inspect() {
    throw new Error("Method 'inspect()' must be implemented");
  }
}

class Integer extends MonkeyObj {

  constructor(value) {
    super();
    this.value = Number(value);
  }

  type() {
    return ObjectType.INTEGER;
  }

  inspect() {
    return this.value.toString();
  }

  hashable() {
    return true;
  }

  hashkey() {
    return { type: this.type(), value: this.value.toString() };
  }
}

class Bool extends MonkeyObj {
  constructor(value) {
    super();
    this.value = Boolean(value);
  }

  type() {
    return ObjectType.BOOLEAN;
  }

  inspect() {
    return this.value.toString();
  }

  hashable() {
    return true;
  }

  hashkey() {
    let value = "";

    if (this.value) {
      value = "XXX";
    } else {
      value = "OOO";
    }

    return { type: this.type(), value: value };
  }
}

class Null extends MonkeyObj {
  constructor() {
    super();
  }

  type() {
    return ObjectType.NULL;
  }

  inspect() {
    return "null";
  }
}

class ReturnValue extends MonkeyObj {
  constructor(value) {
    super();
    this.value = value;
  }

  type() {
    return ObjectType.RETURN_VALUE;
  }

  inspect() {
    return this.value.inspect();
  }
}

class RtError extends MonkeyObj {
  constructor(message) {
    super();
    this.message = message;
  }

  type() {
    return ObjectType.ERROR_OBJ;
  }

  inspect() {
    return "ERROR: " + this.message;
  }
}

class Function extends MonkeyObj {
  constructor(parameters, body, env) {
    super();
    this.parameters = parameters;
    this.body = body;
    this.env = env;
  }

  getParameters() {
    return this.parameters;
  }

  getBody() {
    return this.body;
  }

  getEnv() {
    return this.env;
  }

  type() {
    return ObjectType.FUNCTION_OBJ;
  }

  inspect() {
    let out = "";

    const params = [];

    this.parameters.forEach(param => {
      params.push(param.string());
    });

    out += "fn";
    out += "(";
    out += params.join(", ");
    out += ") {\n";
    out += this.body.string();
    out += "\n}"

    return out;
  }
}

class Str extends MonkeyObj {
  constructor(value) {
    super();
    this.value = value;
  }

  type() {
    return ObjectType.STRING_OBJ;
  }

  inspect() {
    return this.value;
  }

  hashable() {
    return true;
  }

  hashkey() {
    return { type: this.type(), value: crypto.createHash('sha256').update(this.value).digest('hex') };
  }
}

class Builtin extends MonkeyObj {

  constructor(fn) {
    super();
    this.fn = fn;
  }

  type() {
    return ObjectType.BUILTIN_OBJ;
  }

  inspect() {
    return "builtin function";
  }
}

class ArrayObject extends MonkeyObj {
  constructor(elements) {
    super();
    this.elements = elements;
  }

  type() {
    return ObjectType.ARRAY_OBJ;
  }

  inspect() {
    let out = "";

    const elements = [];

    this.elements.forEach(element => {
      elements.push(element.inspect());
    });

    out += "[";
    out += elements.join(", ");
    out += "]";

    return out;
  }
}

class HashPair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class MonkeyHash extends MonkeyObj {
  constructor(pairs) {
    super();
    this.pairs = pairs;
  }

  type() {
    return ObjectType.HASH_OBJ;
  }

  inspect() {
    let out = "";

    const pairs = [];

    for (entry of this.pairs) {
      let k = entry[1].key.type() == ObjectType.STRING_OBJ ? `"${entry[1].key.inspect()}"` : `${entry[1].key.inspect()}`;
      let v = entry[1].value.type() == ObjectType.STRING_OBJ ? `"${entry[1].value.inspect()}"` : `${entry[1].value.inspect()}`;
      pairs.push(`${k}: ${v}`);
    }

    out += "{";
    out += pairs.join(", ");
    out += "}";

    return out;
  }
}

module.exports = {
  ObjectType,
  Integer,
  Bool,
  Null,
  ReturnValue,
  RtError,
  Function,
  Str,
  Builtin,
  ArrayObject,
  MonkeyHash,
  HashPair,
};
