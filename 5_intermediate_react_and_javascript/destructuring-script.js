// destructuring

const user = {
  name: "John",
  age: 45,
  hobbies: ["golf", "tennis"],
  city: "NYC",
};

const { name } = user;
// we are pulling out the name only and that is a variable instantly

console.log(name);
// crossed out in VS code is a bug

const { age } = user;

console.log(age + 5);

const { age, city } = user;

console.log(age, city);

//destructuring in react is very often with the useState hook

const number = [5, 10, 15, 20, 25];

const [a] = numbers;
//this will pull the first value from array numbers and store that in variable "a"

console.log(a);

const [b, c, d] = numbers;
// this will pull out of the array first 3 numbers and store them accordingly in 3 variables

console.log(b, c, d);
