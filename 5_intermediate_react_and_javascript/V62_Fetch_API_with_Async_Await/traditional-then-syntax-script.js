console.log("From .then() to async/await with fetch()...");
// async/await is a modern syntax, syntax where await is in front of the promise

// traditional syntax promise.then()
const btnEl = document.querySelector(".btn-trad"); //btnEl - html element is stored in there

const clickHandler = () => {
  console.log("button clicked");
  // specify address for GET request, GET is default, so we do not need to specify GET
  //console.log(fetch("https://reqres.in/api/users"));

  fetch("https://reqres.in/api/users")
    //this is promise.then()
    .then((response) => {
      if (!response.ok) {
        //this is guard clause
        console.log("Problem");
        return; //return will stop the function
        // 404, or 500 (generic error on the server)
      }

      //console.log(response);
      return response.json(); //this method takes time, it is giving us a promise
    })
    .then((data) => {
      console.log(data.data[3].first_name);
    })
    .catch((error) => {
      console.log(error);
    });
  //error handling, there could be an issue with the connection, promise on fetch will be rejected
  // in real world we want to show an error component or output a message

  // another error, if we want to access resource that does not exist,
  // server will answear with 404 error, in that case the request-response cycle is completed

  // we get a promise with fetch, we can create promises, we can consume promises
  // the vast majority of time we need to consume promises
};

btnEl.addEventListener("click", clickHandler);

/// if there are multiple fetch calls with multiple .then blocks things tend to get messy very quickly
