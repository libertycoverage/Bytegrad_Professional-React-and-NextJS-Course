//

const user = {
  name: "John",
  age: 45,
};

console.log(user.name);

console.log(user["name"]);

//user = 1000;
//returns error, we cannot reassign something to a constant variable

// we can change individual properties within the object
user.name = "Emily";

console.log(user);

///
const numbers = [5, 10, 15];
numbers = "hi";
// this returns an error, you are reassigning something to a constant variable

numbers.push(100);
//this will push a value into array

numbers[0] = 111;
//this wil change a value of a first element in the array into 111
console.log(numbers);
