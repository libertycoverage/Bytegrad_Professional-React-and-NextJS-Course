// primitives vs reference values

console.log(5 === 5);
//true, numbers are primitives in javascript

console.log("hi" === "hi");
// true, strings are also primitives, you can compare them like this

console.log(true === true);
//true booleans

console.log([1, 2] === [1, 2]);
// false, they are two different arrays, Javascript compares objects according to the pointer, not the actual value
// you don't get an actual array, you get the pointer where the array is stored
//indirect, reference value

const numbers1 = [1, 2];
// numbers is not an actual array essentially, it is storing a reference, an address where the actual array is stored
const numbers2 = [1, 2];
// these are two different arrays, it is a different pointer, a different value, different references

console.log({ name: "John" } === { name: "John" });
//false, Javascript compares objects according to the pointer, not the actual value
// two objects have two different pointers
// they are not also loosely equal, they are different
