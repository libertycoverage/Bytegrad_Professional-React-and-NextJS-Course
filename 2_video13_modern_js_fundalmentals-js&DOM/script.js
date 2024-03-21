// 1) -- variables (var/let/const) & data types/structure (strings/numbers/booleans/arrays/objects) --

//var description = "We need a new floor.";
//var squareMeters = 100;
// assign string to variable, after every statement we use semicolon at the end
// in js when you have to words meaning variable you write lowercase and the second upper case: squareMeters (camel case)
// in other programming languages you write square_metres (snake case with underscore) or "kbap case" square-metres with hyphen (-)

// People used to use var for variables

// in modern javascript we have two nuances, let and const
//let description = "We need a new floor.";
//const squareMeters = 100;
// when should you use let, and when const

/// what is wrong with var
//var test = 5;
// you could accidentally write something like this, we don't want to accidentally overwrite our variables
//var test = 10;

// if I have a
//const test = 5;
// if I try to do the following:
//const test = 10;
// this will actually give us an error, we cannot reassign this

// we can reassign with let
//let description = "We need a new floor.";
//let description = "We need a new window.";
// we can overwrite that let

// There are more subtle differences between const let and var

//booleans, true false, text without quotation marks
const specialCoating = true;

//list, array of elements, new array within an array, objects
const floorOptions = [
  "carpet",
  "hardwood",
  "tiles",
  99,
  true,
  false,
  ["lol"],
  { thisisobject: 5 },
];

//object,
const renovationJob1 = {
  // property with property name and property value
  ownerName: "John",
  maximumPrice: 5000,
  category: "bathroom",
  newShower: true,
  colorOptions: ["seagreen", "oceanblue", "cyan"],
  //object can have a function inside also
  calculatePrice: () => 2000 * sqMeters,
};

//object,
const renovationJob11 = {
  // property with property name and property value
  owner: {
    name: "John",
    address: "Some street 55",
    city: "Vancouver",
  },
  maximumPrice2: 5000,
  category: "bathroom",
  newShower: true,
};

// we want to pass that to a server or a database

// error object

const error = {
  statusCode: 404,
  description: "...",
  retry: false,
};

//also console.error etc.
// we are calling a function log with input
console.log(5);
console.log(floorOptions);
console.log(floorOptions[0]);
console.log(renovationJob1);
console.log(renovationJob1.maximumPrice);

// 2) -- traditional functions vs arrow functions --

function calculatePrice(sqMetres) {
  const price = 1000 + sqMetres;
  console.log(price);
  console.log("price");
  return price;
}
//we don't use semicolon at the end of a function

calculatePrice(10000);
/// 10000 is passed as an argument of a function
const result = calculatePrice(10000);
console.log(result);

// this is anonymous function assigned to a variable
var calculatePrice2 = function (sqMetres) {
  const price = 1000 + sqMetres;
  return price;
};
//here we use semicolon at the end of a function

const result2 = calculatePrice2(5000);
console.log(result2);
console.log(calculatePrice2(5000));

// arrow functions
// this is anonymous function
//arrow function assigned to a variable
const calculatePriceArrowFunction = (sqMetres) => {
  const price = 1000 + sqMetres;
  return price;
};

console.log(calculatePriceArrowFunction(7000));

// this is anonymous function
// you can remove parenthesis around sqMetres, but prettier addon corrects syntax here
const calculatePriceArrowFunction2 = (sqMetres) => 1000 + sqMetres;

//since this is on the same line, browser will know we intend to return this, so we don't have to explicitly write return, this is implicit

// name for functions are verbs e.g. make, destroy, drive

// 3) -- string concatenation vs template literals --

// we want to create a string with variables
// string concatenation
const price = 9000;
const result_1 = "The total cost will be:" + price;

console.log(result_1);

// we have more modern way of doing this named template literals, syntax especially useful if we have multiple lines
//use back ticks

const result_template_literals = `The total cost will be: ${price}`;

// 4) -- if-else vs ternary operator --

const price2 = 5000;
const pricetext = "The floor has an area of about 5000 square metres";

if (price2 > 2000) {
  console.log("hello");
} else {
  console.log("blabla");
}

const price3 = 5000;

if (price3 < 1000) {
  console.log("hello");
} else {
  console.log("blabla");
}

// = one equals for assignment, to check that something is actually equal to something == not strict equals === strict equals

// == this evaluates to true because of conditions, event the types are not equal

// we compare string type to number type, this is loose comparison, it does not take to the account the type

// usually being strict to yourself is a best practice, whenever we have an option to be loose or strict, be strict

//if we want to be strict with our types, take the type to the account we now === triple equal
// this is strict equality operator
if (price3 === 5000) {
  console.log("hello");
} else {
  console.log("blabla");
}

// more compact way of writing this is by using the ternary operator
// : otherwise
// you can use single quotation also with the string

const theprice = 5000;

theprice > 3000 ? console.log("hello") : console.log("blabla");

const price4 = 5000;

if (price4) {
  console.log("hello");
} else {
  console.log("blabla");
}

// it evaluates 5000 to true, we have a concept of truthy and falsy values

// if the const price = 0; we actually get blabla
// it evaluates zero fo false and other number to true
// this is concept of truthy and falsy values

// now the difference between var and let

if (5000) {
  let hello = 5;
  console.log(hello);
} else {
  let hi = 10;
}

console.log(hello);
// it returns error hello is not defined, we cannot access that variable outside the block

// hello is scoped to the block, we can access it only inside of
// if (5000) {
//  let hello = 5;
//  console.log(hello);
// }

// now with var

if (5000) {
  var hello = 9;
  console.log(hello);
} else {
  var hi = 10;
}

console.log(hello);
// we can access the var outside the block
// var is not scoped to the block, but with let is always scoped to the block

function calculatePriceWithVar(sqMetres) {
  var ok1 = 100;
  console.log(ok1);
  const price = 1000 + sqMetres;
  return price;
}

//console.log(ok1);
// Uncaught ReferenceError: ok is not defined
// we can access var only in the function body (var is scoped to the function body)
//with var inside the arrow function we can access var only inside of the body of function

function calculatePriceWithLet(sqMetres) {
  let ok2 = 100;
  console.log(ok2);
  const price = 1000 + sqMetres;
  return price;
}

//console.log(ok2);

//let is also scoped to the function body, because it's the block {}, and we cannot access that from the outside in a simple way
// let is also scoped to any other block you gonna have in a code, var will be only scoped to the function block, not any other block

// let is going to be easier to use, any time you have a block it is clear that let would be scoped

// const is always scoped to the nearest block

// 5) -- manipulating html and CSS --

//Browser always creates "console" object you invoke like console.log();

// In JS we use . notation to access elements (properties) in an object

let renovationElementVariable = renovationJob1.category;
console.log(renovationElementVariable);

// we can use console.error or console.warn

// Browser gives us another object document

console.log(document.images);

// returns all images of the project

console.log(document.forms);

// historically it was like this
// this returns one particular element

document.getElementById("");

document.getElementsByClassName("");

// modern way is by using document.querySelector(), mostly used these days (2023/2024)

//document.querySelector("");

// here any query will work, by id (using #)

//console.log(document.querySelector("#byid"));

const headingEL = document.querySelector(".heading");
// these are css selectors by the way

//headingEL.textContent = 'Hello <span class="heading--big"> everyone</span>';
//this won't work, it treats span as a literal text

// if we want string parsed as html we use .innerHTML

headingEL.innerHTML = 'Hello <span class="heading--big">everyone</span>';

// accessing property textContent of objects

// maybe we don't want to replace thing, we want to add something after it

const headingEL2 = document.querySelector(".heading2");

// two inputs
headingEL2.insertAdjacentHTML(
  "beforebegin",
  'Hello <span class="heading--big">everyone</span>'
);

//manipulating the css

// we can set style.color, style.background-color
headingEL2.style.fontSize = "55px";

// it is not recommended to manipulate like this because you gonna have css values all over the place,
// your javascript file will be littered with css values, we want to have a clean separation in separate files

// to manipulate we are going to use second way mostly, we can change it's classes, we can add a class, we can remove the class

const headingEL3 = document.querySelector(".heading3");

//headingEL3.classList.remove
headingEL3.classList.add("heading--big");

// this is recommended way of changing things

// 6) -- events and functions for handling events (also called "event handlers") --

// every interaction on the page e.g. clicking mouse triggers an event,
// when you hover a mouse over an element and you leave from that there is actually a mouse leave event,
// when you enter a mouse there is a mouse enter event, even by moving a mouse there is a mouse move event
// when you type something with the keyboard there is also en event, scrolling the page is an event also

// there are multiple events

// the most common event is a click event

const headingEL4 = document.querySelector(".heading4");

const clickHandler = () => {
  // this is not a usual way of changing colors, but here can be
  headingEL4.style.color = "green";
  console.log("changed color");
};

//clickHandler();

// we need to specify two things in addEventListener(what event, what to do), it can be mouse enter event, or mouse leave event
headingEL4.addEventListener("click", clickHandler);
// it is not clickHandler() inside but without a braces, function awaits to be triggered;
