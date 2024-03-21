// length (number of elements in array)

const numbers = [99, 5, 8, 16];

// very common things: how many things are in the array
console.log(numbers.length);

// push() method . function
numbers.push(100);
console.log(numbers);
//adding a number to the array

// includes ()
console.log(numbers.includes(5));
//check if numbers include an element

// forEach()
//most common loop in js
console.log(numbers[2] * 2);
//third element of the array multiply by 2
numbers.forEach(function (number) {
  console.log(number * 2);
});
//parameter (number) in the function, actual number in the array is an argument of a function

//arrow function
numbers.forEach((number) => {
  console.log(number * 2);
});

// since it is arrow function and this is one input we can remove parenthesis
numbers.forEach((number) => {
  console.log(number * 3);
});

// another example
const multiplyByFive = (number) => console.log(number * 5);
numbers.forEach(multiplyByFive);

// objects in array
const data = [
  {
    name: "John",
    age: 45,
  },
  {
    name: "Emily",
    age: 28,
  },
  {
    name: "Mike",
    age: 30,
  },
];

console.log(data);
console.log(data[1].age); //element of second object in the array
