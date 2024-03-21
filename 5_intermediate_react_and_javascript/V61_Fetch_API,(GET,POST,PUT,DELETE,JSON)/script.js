console.log("Learn fetch() quickly - GET/POST/PUT/DELETE ");

//POST request when we want to submit data
//submit object with fetch we need additional argument which is gonna be the object with the following property
const newUser = {
  name: "Maria",
  job: "Teacher",
};

fetch("https://reqres.in/api/users", {
  method: "POST", //default is GET, for POST we need to specify POST, then we need to let the server know what the data format will be with headers
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newUser), //the actual data we want to submit with body
})
  .then((res) => {
    //this is guard clause
    if (!res.ok) {
      console.log("Problem");
      return; //return to stop the function
    }

    return res.json();
  })
  .then((data) => {
    // data parsed as json, it is a normal js object
    console.log(data);
    console.log("Success"); //<- Data we get back from POST-request is different than from GET-request, so changing this to something else
  })
  .catch((error) => {
    console.log(error);
  });

// -------------------------------------------------------------------------------------------------------------------------------------------------
// GET //
// fetch("https://reqres.in/api/users").then((res) => {
//   console.log(res);
//   return res.json();
// });
//this method will wait till the complete data has been downloaded;  then convert json to javascript format,
//it gives us a promise, because it takes an additional time before we have all the data, we wanna return that promise,
// we can write that on one line since it an arrow function, an remove return keyword since there will be implicit return on one line

//this is a GET request
fetch("https://reqres.in/api/users")
  .then((res) => {
    //this is guard clause
    if (!res.ok) {
      console.log("Problem");
      return; //return to stop the function
    }

    return res.json();
  })
  .then((data) => {
    // data parsed as json, it is a normal js object
    console.log(data);
    console.log(data.data[0].first_name);
  })
  .catch((error) => {
    console.log(error);
  });
// error handling: two things can go wrong, there could be a network problem,
// 1) while making a request internet falls out let's say in that case the request response cycle cannot be completed and promise we get from fetch here will be rejected
// we immediately go to the catch block
// 2) second thing what can go wrong, if we try to access resource on the server that does not exist, server will respond with 404 error,
// in that case the request-response cycle is completed, just the server is letting us know the resource does not exist
// if res.ok is not in 200 range we want to log problem

// -------------------------------------------------------------------------------------------------------------------------------------------------
// PUT //

const newUserPUT = {
  name: "Maria",
  job: "Teacher",
};

fetch("https://reqres.in/api/users/55", {
  // <- With PUT we have to specify which specific resource we want to update
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newUserPUT), //the actual data we want to submit with body
})
  .then((res) => {
    //this is guard clause
    if (!res.ok) {
      console.log("Problem");
      return; //return to stop the function
    }

    return res.json();
  })
  .then((data) => {
    // data parsed as json, it is a normal js object
    console.log(data);
    console.log("Success"); //<- With a GET-request we want to get data, however with POST/PUT etc. we usually also get some data as response (e.g. success message) in JSON
  })
  .catch((error) => {
    console.log(error);
  });

// -------------------------------------------------------------------------------------------------------------------------------------------------
// DELETE //

const newUserDELETE = {
  name: "Maria",
  job: "Teacher",
};
// <- THE OBJECT IS NOT NECESSARY FOR DELETE

fetch("https://reqres.in/api/users/55", {
  // <- Specify which specific resource to DELETE
  method: "DELETE",
})
  .then((res) => {
    //this is guard clause
    if (!res.ok) {
      console.log("Problem");
      return; //return to stop the function
    }

    return res.json();
  })
  .then((data) => {
    // data parsed as json, it is a normal js object
    console.log(data);
    console.log("Success"); //<- With a GET-request we want to get data, however with POST/PUT etc. we usually also get some data as response (e.g. success message) in JSON
  })
  .catch((error) => {
    console.log(error);
  });
