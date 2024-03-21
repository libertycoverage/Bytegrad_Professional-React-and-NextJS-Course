const btnEl2 = document.querySelector(".btn-async-await-get");

//syntactical sugar in comparison with traditional
// async await to consume the promise
const clickHandler2 = async () => {
  // first,  what if there is a network issue which will cause promise to reject
  try {
    const res = await fetch("https://reqres.in/api/users"); //first promise
    const data = await res.json(); // we also get the second promise here

    //put after data on purpose, we are still going to parse response as json, even if the ok property is not true
    //the reason for this is let's say we get 404 error, the server will still send back the response,
    //usually that response si gonna have like a message, description of the problem, and that is still in JSON format,
    //we also want to parse the response body data as JSON in that case, in both cases when everything is fine and something is wrong we want to parse the response
    if (!res.ok) {
      //this is guard clause
      console.log(data.description);
      return;
    }
    console.log(data.data[3].first_name);
    // if the code is rejected go the catch block
  } catch (error) {
    console.log(error);
  }
};

btnEl2.addEventListener("click", clickHandler2);

// the second thing if the request-response cycle is still completed but we want to get a resource that does not exist, we get 404 error or 500 (something wrong on a server)
// in that case the ok property on the response objects will be false
