/* Description: the lexer for the Monkey programming language */

/* Lexical grammar */

digit                                [0-9]
ident                                [a-zA-Z_][a-zA-Z0-9_]*

%%

"fn"                                 return 'FUNCTION';
"let"                                return 'LET';
"true"                               return 'TRUE';
"false"                              return 'FALSE';
"if"                                 return 'IF';
"else"                               return 'ELSE';
"return"                             return 'RETURN';


"=="                                 return 'EQ';
"!="                                 return 'NOT_EQ';
"="                                  return 'ASSIGN';
"+"                                  return 'PLUS';
"-"                                  return 'MINUS';
"*"                                  return 'ASTERISK';
"!"                                  return 'BANG';
"/"                                  return 'SLASH';
"<"                                  return 'LT';
">"                                  return 'GT';
","                                  return 'COMMA';
";"                                  return 'SEMICOLON';
"("                                  return 'LPAREN';
")"                                  return 'RPAREN';
"{"                                  return 'LBRACE';
"}"                                  return 'RBRACE';
"["                                  return 'LBRACKET';
"]"                                  return 'RBRACKET';
":"                                  return 'COLON';

\s+                                  /* skip whitespace */

\"[^\"]*\"                           return 'STRING';

{ident}                              return 'IDENT';
{digit}+                             return 'INT';

.                                    return 'INVALID';
<<EOF>>                              return 'EOF';
