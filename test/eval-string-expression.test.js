const testEval = require('./utilities').testEval;
const testStringObject = require('./utilities').testStringObject;

const input = `
"Hello World!"
`;

const evaluated = testEval(input);
testStringObject(evaluated, "Hello World!");
