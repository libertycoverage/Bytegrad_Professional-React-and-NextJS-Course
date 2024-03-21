// overview again

function addNumbers() {
  const newNumber = 100;
  console.log(newNumber);
};
//silly example, we have only specified the function thus we need to call a function

addNumbers();

//arrow function


function addNumbersArrow = () => {
    const newNumber = 100;
    console.log(newNumber);
};

addNumbersArrow();


// calling other functions in function body
//we want to call another function in here
const logHello = () =>{
    console.log("Hello");
    console.log('Hi');
};

function addNumberz = () => {
    const newNumber = 100;
    console.log(newNumber);
    logHello(); // it will run Hello and Hi and then 9999
    console.log(9999);
};

addNumberz();


// refactoring, silly example

// DRY, don't repeat yourself

const logGreeting = () => {
    console.log('hello');
    console.log('hi');
};

const doSomething = () => {
    console.log(43345);
    console.log(38498);
    logGreeting();
    // console.log('hello');
    // console.log('hi');
};


const logStuff = () => {
    console.log(true);
    console.log(false);
    console.log([1,4,5]);
    logGreeting();
    // console.log('hello');
    // console.log('hi');
};




// early return / stop function execution

const checkValidity = (number) => {
    if (number < 50) {
        console.log('Denied');
        return; //it will stop the function from running
    }
    console.log('Approved');
}

checkValidity(30);
checkValidity(50);
