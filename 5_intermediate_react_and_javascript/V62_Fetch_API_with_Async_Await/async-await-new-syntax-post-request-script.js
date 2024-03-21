const btnElPost = document.querySelector(".btn-async-await-post");
const newUser = {
  name: "John",
  job: "Carpenter",
};

const clickHandlerPost = async () => {
  try {
    const res = await fetch("https://reqres.in/api/users", {
      // in PUT - await fetch("https://reqres.in/api/users/33" - replace a user with id 33 to user with new data
      // in DELETE - await fetch("https://reqres.in/api/users/33"
      method: "POST", // PUT here - we want to update or replace particular resource, users is a resource here
      // in "DELETE" we remove body and header section, also newUser
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
      // in "DELETE" we remove body and header section, also newUser
    }); //first promise
    const data = await res.json(); // we also get the second promise here

    if (!res.ok) {
      console.log(data.description);
      return;
    }
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

btnElPost.addEventListener("click", clickHandlerPost);
