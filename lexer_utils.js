
function getSourceListing(source) {
  const source_dict = source.split("\n").reduce((acc, item, i) => {
    acc[++i] = item;
    return acc;
  }, {});
  return source_dict;
}

function showSourceCode(sourceDict) {
  for (const [key, value] of Object.entries(sourceDict)) {
    console.table(`${key.toString().padStart(4, "0")}\t${value}`);
  }
}

function getTokenList(lexer) {
  const tokenList = [];
  while ((tok = lexer.lex()) != 1) {
    tokenList.push({
      "type": tok,
      "literal": lexer.yytext,
      "line": lexer.yylineno + 1,
      "column": lexer.yylloc.first_column + 1
    });
  }
  return tokenList;
}

function displayTokenList(tokenList) {
  console.table(tokenList, ["type", "literal", "line", "column"]);
}

module.exports = {
  getSourceListing,
  showSourceCode,
  getTokenList,
  displayTokenList,
}
