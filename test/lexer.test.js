const lexer = require('../monkey_lexer').monkey_lexer;
const getTokenList = require('../lexer_utils').getTokenList;

const input = `
let five = 5 ;
let ten = 10 ;

let add = fn ( x , y ) {
  x + y ;
} ;

let result = add ( five , ten ) ;
! - / * 5 ;
5 < 10 > 5 ;

if ( 5 < 10 ) {
  return true ;
} else {
  return false ;
}

10 == 10 ;
10 != 9 ;
`;
// Give the lexer some input.
lexer.setInput(input);
const tokenList = getTokenList(lexer);
// Too lazy to count by hand how many tokens are there in the input...
const tokens = input.replace(/\n/g, " ").split(" ").filter(el => {
  return el != "";
});
test(`There should be ${tokens.length} in the list of tokens returned by the lexer.`, () => {
  const numberOfTokensFromTheLexer = tokenList.length;
  const numberOfTokensFromInput = tokens.length;
  // The lexer returns an EOF token which is not in the input.
  expect(numberOfTokensFromTheLexer).toBe(numberOfTokensFromInput + 1);
});
