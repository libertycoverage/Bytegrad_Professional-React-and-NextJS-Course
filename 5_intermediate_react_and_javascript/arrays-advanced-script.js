const number = [10, 100, 500, 1000];

// push()
number.push(5000);

console.log(numbers);

// forEach(), we don't receive a new array back
number.forEach(function (nr) {
  console.log(nr);
});

number.forEach(function (number) {
  console.log(number + 10);
});

//arrow function
number.forEach((numero) => {
  console.log(numero);
});

// map(), we actually get a new array back, almost the same as forEach, mapping a function for every element in the array, result is a new array
const newNumbers = numbers.map(function (n) {
  return n * 2;
});

console.log(newNumbers);
//newNumbers is a new array

// some(), sometimes we want to know if an element in the array has some condition
const result = numbers.some(function (number) {
  return number > 100000;
});
//returns single true or single false according to the condition for every element of the original array
// "at least one"

console.log(result);

// find ()
// we want to find an element that satisfies some condition

const findresult = numbers.find((number) => {
  return number > 800;
});

console.log(findresult);
// we get back an element that satisfies the condition

// filter()
// we want a new array but only of elements that passed some condition

const newNumbers = numbers.filter((number) => {
  return number > 400;
});

console.log(newNumbers);
