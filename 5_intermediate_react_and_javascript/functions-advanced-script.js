// callback functions

//standalone functions

function doSomething() {}

const calculatePrices = () => {};

calculatePrices();

//with an array you can call a method
[5, 9, 10].some(() => {});

//traditional way of callback function (within some)
[5, 9, 10].some(function () {});

//some() heck if at least one value satisfies some condition, this also expects a function

//this type of functions are called callback functions, these function usually don't have names, they are anonymous
// these are throw away functions only needed in some place, you don't need to call them later, you don't use them again

// methods
// method is when you call a function, some functions are called methods, a function you call on something

const arr = [5, 9, 15];
arr.push();

//push is a method here, some() etc.

//methods called on objects

const obj = {
  name: "John",
  hobbies: ["golf", "skiing"],
  //function in object
  calculate: () => {
    return 30 + hobbies.length;
  },
};

console.log(obj.calculate());
// with hobbies.length calculate() returns an error, hobbies is not defined, it does not know what hobbies are

//we need to use a word "this" with this hobbies length, we also need to change arrow function into a traditional function

const obj2 = {
  name: "John",
  hobbies: ["golf", "skiing"],
  //traditional function to use this.
  calculate: function () {
    return 30 + this.hobbies.length;
  },
};

console.log(obj2.calculate());
// method called on the object obj2

///

// default parameters
const calculatePrice = (sqMeters) => {
  return 5000 + sqMeters;
};

const result = calculatePrice(2000);

console.log(result);

// when we won't specify arguments
//const result = calculatePrice();
// we get NaN, not a number
//if we won't pass anything parameters will be undefined, tries add 500 to undefined

//default parameter 10000, to omit a problem of NaN with undefined input
const calculatePrice2 = (sqMeters = 10000) => {
  return 5000 + sqMeters;
};

const result2 = calculatePrice2();

console.log(result2);
