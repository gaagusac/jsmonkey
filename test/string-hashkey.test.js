const StringObject = require('../monkey_obj').Str;

const hello1 = new StringObject("Hello World");
const hello2 = new StringObject("Hello World");
const diff1 = new StringObject("My name is Gustavo");
const diff2 = new StringObject("My name is Gustavo");

test(`strings with same content have different hash keys`, () => {
  expect(hello1.hashkey()).toStrictEqual(hello2.hashkey());
});

test(`strings with same content have different hash keys.`, () => {
  expect(diff1.hashkey()).toStrictEqual(diff2.hashkey());
});

test(`strings with different content have same hash keys`, () => {
  expect(hello1.hashkey()).not.toStrictEqual(diff1.hashkey());
});
