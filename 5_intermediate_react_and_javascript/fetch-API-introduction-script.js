// with fetch API we can make network requests, we can use that to get information from the server
// https://jsonplaceholder.typicode.com/todos
fetch("https://jsonplaceholder.typicode.com/todos").then(function (res) {});
// we are consuming the promise with then
// .then (when we get the response) we get access to it in the braces, response is often in json format

//today it is done with an arrow function mostly
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((res) => {
    if (!res.ok) {
      console.log("Problem");
    }
    // if a response (status code) is 404 etc. (is not 200 - OK)

    return res.json();
    // we are converting from json format to normal javascript,
    // json() method will wait for the data to be streamed in, it takes some additional time, we already got the response object as soon as we get the initial data back
    // since json() method will take some additional time (parsing the json, converting json to javascript object) this is another promise
    // we return that additional promise
    // the second then we get the data in the javascript format
  })
  .then((data) => {
    console.log(data[0].title);
  })
  // we get an array of 200, we choose the first element
  .catch((error) => {
    console.log(error);
  });

// you cannot do like this:
//const data = fetch("https://jsonplaceholder.typicode.com/todos");
// because fetch is asynchronous and promise-based (implemented with promises in javascript)
