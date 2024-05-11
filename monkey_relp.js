const prompt = require('prompt-sync')({ sigint: true });
const lexer = require('./monkey_lexer').monkey_lexer;
const getTokenList = require('./lexer_utils').getTokenList;
const displayTokenList = require('./lexer_utils').displayTokenList;
const parser = require('./monkeyParser').parser;
const evaluator = require('./monkey_evaluator').Eval;
const newEnvironment = require('./monkey_env').newEnvironment;
const fs = require('fs');

function start() {
  console.log(`Hello ${require('os').userInfo().username}! This is the Monkey programming language!`);
  console.log('Feel free to type in commands.');
  const env = newEnvironment();
  while (true) {
    let line = prompt(">> ");
    if (line === "" || line.trim() === "") continue;
    const program = parser.parse(line);
    const evaluated = evaluator(program, env);
    if (evaluated) {
      console.log(evaluated.inspect());
    }
  }
}

function startBatch(path) {
  const input = fs.readFileSync(path).toString();
  const env = newEnvironment();
  const program = parser.parse(input);
  const evaluated = evaluator(program, env);
  if (evaluated) {
    console.log(evaluated.inspect());
  }
}

module.exports = { start, startBatch };
