// object in object

const user = {
  name: "Emily",
  age: 30,
  hobbies: ["knitting", "programming"],
  address: {
    city: "Miami",
    state: "Florida",
  },
};

console.log(user.name);
console.log(user.hobbies[1]); // second element of the array hobbies
console.log(user.address.city);

// property name is sometimes same as property value
const username2 = input.value;
const password2 = input.value;

const newUser = {
  username: username,
  password: password2,
};
// send to server (newUser)

//passing object as argument to function
function logUser(userme) {
  console.log(userme.name);
  console.log(userme.age);
}

//arrow function
function logUser2 = user => {
    console.log(user.name);
    console.log(user.age);
 };

const user = {
  name: "Emily",
  age: 30,
};

logUser(user); //user object passed as an argument of a function
//userme will work, this is just a name
