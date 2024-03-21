// short-circuting with &&
//&&

const price = 1000;

if (price > 500 && price < 2000) {
  console.log("hello");
}
// two conditions are true, if only one is two and the second condition is false, this is false, we don't get an answear

//in React there could be some construction like this

price > 500 && console.log(9999);
//first condition this is true, then it has to execute the second condition which is logging something
// as long as first is true it runs the second condition

// short-circuting with ||
const price2 = 2000;

price2 > 500 || console.log(999);
// we need only one of two conditions to be true to execute the second condition
// if the first is true, the function will stop, the second condition won't be run
// if the first is false, it will run the second condition always
