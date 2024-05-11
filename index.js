
const start = require('./monkey_relp').start;
const startBatch = require('./monkey_relp').startBatch;

// Start the repl

// function exec(input) {
//   return parser.parse(input);
// }
if (process.argv.length == 2) {
  start();
} else if (process.argv.length == 3) {
  startBatch(process.argv[2]);
} else {
  console.log("Usage: node index.js [source-file]");
}
// const parse_result = exec("let y = 33; let x = 42; let foobar = 929292; return 42; return 33;");
// tree = JSON.stringify(parse_result, null, 4);
// console.log(tree);
