// spread operator

const numbers1 = [5, 10, 15];
const numbers2 = [20, 30, 40];

const newNumbers = [...numbers1, ...numbers2];
//we spread elements of these two arrays into a new variable storing a new array

console.log(newNumbers);
