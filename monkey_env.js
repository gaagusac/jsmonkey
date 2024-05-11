
class Environment {
  constructor() {
    this.store = new Map();
    this.outer = null;
  }

  Get(name) {
    const obj = this.store.get(name);
    // Found the name in the current environment
    if (obj) {
      return obj;
    }
    // Look for the name in the outer environment
    if (this.outer) {
      return this.outer.Get(name);
    }
    // Not found
    return obj;
  }

  Set(name, obj) {
    this.store.set(name, obj);
    return obj;
  }
}

function newEnvironment() {
  return new Environment();
}

function newEnclosedEnvironment(outer) {
  const env = newEnvironment();
  env.outer = outer;
  return env;
}

module.exports = {
  newEnvironment,
  newEnclosedEnvironment,
};
