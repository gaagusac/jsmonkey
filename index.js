const start = require("./monkey_relp").start;
const startBatch = require("./monkey_relp").startBatch;

// Start the repl or a source file

if (process.argv.length == 2) {
  start();
} else if (process.argv.length == 3) {
  startBatch(process.argv[2]);
} else {
  console.log("Usage: node index.js [source-file]");
}
