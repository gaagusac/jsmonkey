/* Description: the lexer for the Monkey programming language */

/* Lexical grammar */

%lex

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
"while"                              return 'WHILE';
"break"                              return 'BREAK'
"continue"                           return 'CONTINUE';

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

\"[^\"]*\"                           return 'STRING';

{ident}                              return 'IDENT';
{digit}+                             return 'INT';

\s+                                  /* skip whitespace */

.                                    return 'INVALID';
<<EOF>>                              return 'EOF';

/lex

%{
    const LetStatement = require('./monkey_node').LetStatement;
    const ReturnStatement = require('./monkey_node').ReturnStatement;
    const Identifier = require('./monkey_node').Identifier;
    const IntegerLiteral = require('./monkey_node').IntegerLiteral;
    const BooleanLiteral = require('./monkey_node').BooleanLiteral;
    const PrefixExpression = require('./monkey_node').PrefixExpression;
    const InfixExpression = require('./monkey_node').InfixExpression;
    const ExpressionStatement = require('./monkey_node').ExpressionStatement;
    const MonkeyToken = require('./monkey_token').MonkeyToken;
    const IfExpression = require('./monkey_node').IfExpression;
    const FunctionLiteral = require('./monkey_node').FunctionLiteral;
    const CallExpression = require('./monkey_node').CallExpression;
    const BlockStatement = require('./monkey_node').BlockStatement;
    const StringLiteral = require('./monkey_node').StringLiteral;
    const ArrayLiteral = require('./monkey_node').ArrayLiteral;
    const IndexExpression = require('./monkey_node').IndexExpression;
    const HashLiteral = require('./monkey_node').HashLiteral;
    const Program = require('./monkey_node').Program;
    const WhileStatement = require('./monkey_node').WhileStatement;
    const BreakStatement = require('./monkey_node').BreakStatement;
    const ContinueStatement = require('./monkey_node').ContinueStatement;
%}

/* operator associations and precedence */

%nonassoc 'EQ' 'NOT_EQ'
%nonassoc 'LT' 'GT'
%left 'PLUS' 'MINUS'
%left 'ASTERISK' 'SLASH'
%right 'UMINUS' 'BANG'
%left 'LPAREN'
%left 'LBRACKET'

/* enable EBNF grammar syntax */
%ebnf

%start program

%%

program
  : statements EOF
        {  program = new Program($1); return program; }
;

statements
    : statements statement
        {  $1.push($2); $$ = $1; }
    | statement
        {  $$ = [$1]; }
    ;

statement
    : let_statement
        {  $$ = $1; }
    | return_statement
        {  $$ = $1; }
    | expression_statement
        { $$ = $1; }
    | while_statement
        { $$ = $1; }
    | break_statement
        { $$ = $1; }
    | continue_statement
        { $$ = $1; }
    ;

while_statement
    : WHILE LPAREN expression RPAREN block_statement
      {
         var token = new MonkeyToken('WHILE', 'while', @1.first_line, @1.first_column);
         $$ = new WhileStatement(token, $3, $5);
      }
      ;

break_statement
    : BREAK SEMICOLON?
    {
        var token = new MonkeyToken('BREAK', 'break', @1.first_line, @1.first_column);
        $$ = new BreakStatement(token);
    }
    ;

continue_statement
    : CONTINUE SEMICOLON?
    {
        var token = new MonkeyToken('CONTINUE', 'continue', @1.first_line, @1.first_column);
        $$ = new ContinueStatement(token);
    }
    ;

let_statement
    : LET IDENT ASSIGN expression SEMICOLON?
        {
            var token = new MonkeyToken('LET', 'let', @1.first_line, @1.first_column);
            var ident = new Identifier(new MonkeyToken('IDENT', $2, @2.first_line, @2.first_column), $2);
            $$ = new LetStatement(token, ident, $4);
        }
    ;

return_statement
    : RETURN expression SEMICOLON?
      {
            var token = new MonkeyToken('RETURN', 'return', @1.first_line, @1.first_column);
            $$ = new ReturnStatement(token, $2);
      }
    ;

expression_statement
    : expression SEMICOLON?
      {
        $$ = new ExpressionStatement($1.token, $1);
      }
    ;

block_statement
    : LBRACE statements RBRACE
      {
        var token = new MonkeyToken('LBRACE', $1, @1.first_line, @1.first_column);
        $$ = new BlockStatement(token, $2);
      }
      ;

param_list
    : param_list COMMA param
      {
        $1.push($3); $$ = $1;
      }
    | param
      {
        $$ = [$1];
      }
    ;

param
    : IDENT
      {
        var token = new MonkeyToken('IDENT', $1, @1.first_line, @1.first_column);
        $$ = new Identifier(token, $1);
      }
      ;

expression_list
    : expression_list COMMA expression
      {
        $1.push($3); $$ = $1;
      }
    | expression
      {
        $$ = [$1];
      }
    ;

expression_pairs
    : expression_pairs COMMA expression_pair
      {
        $1.set($3['key'], $3['value']);
        $$ = $1;
      }
    | expression_pair
      {
        const map = new Map();
        map.set($1['key'], $1['value']);
        $$ = map;
      }
;

expression_pair
    : expression COLON expression
    {
        $$ = {'key': $1, 'value': $3};
    }
;

expression
    : INT
      {
        var token = new MonkeyToken('INT', $1, @1.first_line, @1.first_column);
        $$ = new IntegerLiteral(token, Number($1));
      }
    | STRING
      {
        var token = new MonkeyToken('STRING', $1, @1.first_line, @1.first_column);
        $$ = new StringLiteral(token, $1.slice(1, -1));
      }
    | TRUE
      {
        var token = new MonkeyToken('TRUE', $1, @1.first_column, @1.first_column);
        $$ = new BooleanLiteral(token, true);
      }
    | FALSE
      {
        var token = new MonkeyToken('FALSE', $1, @1.first_column, @1.first_colun);
        $$ = new BooleanLiteral(token, false);
      }
    | IDENT
      {
        var token = new MonkeyToken('IDENT', $1, @1.first_line, @1.first_column);
        $$ = new Identifier(token, $1);
      }
    | LPAREN expression RPAREN
      {
        $$ = $2;
      }
    | expression PLUS expression
      {
        var token = new MonkeyToken('PLUS', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression MINUS expression
      {
        var token = new MonkeyToken('MINUS', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression ASTERISK expression
      {
        var token = new MonkeyToken('ASTERISK', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression SLASH expression
      {
        var token = new MonkeyToken('SLASH', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression EQ expression
      {
        var token = new MonkeyToken('EQ', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression NOT_EQ expression
      {
        var token = new MonkeyToken('NOT_EQ', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression LT expression
      {
        var token = new MonkeyToken('LT', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | expression GT expression
      {
        var token = new MonkeyToken('GT', $2, @2.first_line, @2.first_column);
        $$ = new InfixExpression(token, $1, $2, $3);
      }
    | MINUS expression %prec UMINUS
      {
        var token = new MonkeyToken('MINUS', $1, @1.first_line, @1.first_column);
        $$ = new PrefixExpression(token, $1, $2);
      }
    | BANG expression %prec BANG
      {
        var token = new MonkeyToken('BANG', $1, @1.first_line, @1.first_column);
        $$ = new PrefixExpression(token, $1, $2);
      }
    | IF LPAREN expression RPAREN block_statement
      {
        var token = new MonkeyToken('IF', $1, @1.first_line, @1.first_column);
        $$ = new IfExpression(token, $3, $5);
      }
    | IF LPAREN expression RPAREN block_statement ELSE block_statement
      {
        var token = new MonkeyToken('IF', $1, @1.first_line, @1.first_column);
        $$ = new IfExpression(token, $3, $5, $7);
      }
    | FUNCTION LPAREN param_list RPAREN block_statement
      {
        var token = new MonkeyToken('FUNCTION', $1, @1.first_line, @1.first_column);
        $$ = new FunctionLiteral(token, $3, $5);
      }
    | FUNCTION LPAREN RPAREN block_statement
      {
        var token = new MonkeyToken('FUNCTION', $1, @1.first_line, @1.first_column);
        $$ = new FunctionLiteral(token, [], $4);
      }
    | expression LPAREN expression_list RPAREN
      {
        var token = new MonkeyToken('LPAREN', $2, @2.first_line, @2.first_column);
        $$ = new CallExpression(token, $1, $3);
      }
    | expression LPAREN RPAREN
      {
        var token = new MonkeyToken('LPAREN', $2, @2.first_line, @2.first_column);
        $$ = new CallExpression(token, $1, []);
      }
    | LBRACKET expression_list RBRACKET
      {
        var token = new MonkeyToken('LBRACKET', $1, @1.first_line, @1.first_column);
        $$ = new ArrayLiteral(token, $2);
      }
    | LBRACKET RBRACKET
      {
        var token = new MonkeyToken('LBRACKET', $1, @1.first_line, @1.first_column);
        $$ = new ArrayLiteral(token, []);
      }
    | expression LBRACKET expression RBRACKET
      {
        var token = new MonkeyToken('LBRACKET', $2, @2.first_line, @2.first_column);
        $$ = new IndexExpression(token, $1, $3);
      }
    | LBRACE expression_pairs RBRACE
      {
        var token = new MonkeyToken('LBRACE', $1, @1.first_line, @1.first_column);
        $$ = new HashLiteral(token, $2);
      }
    | LBRACE RBRACE
      {
        var token = new MonkeyToken('LBRACE', $1, @1.first_line, @1.first_column);
        $$ = new HashLiteral(token, new Map());
      }
    ;
