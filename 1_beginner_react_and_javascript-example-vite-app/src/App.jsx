import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
//import "./App.css";

import Count from "./Count";
import Button from "./Button";

/*
function App() {
  return (
    <h1 
      onClick={() => {
        console.log("test");
    }}
    > 
      Very cool 
    <h1/>
  );
}
*/

/*
function App() {
  return <h1>very cool {"test".toUppercase()}</h1>;
}
*/

function App() {
  const [number, setNumber] = useState(0);
  // this above is equal to destructuring an object {limit} = obj;

  // if the return doesn't have (), javascript engine put semicolon ; just after the return; and the div will be not executed
  return (
    <div
      className="app"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* self closing tag < /> or <Count></Count> */}
      {/* number={5} is prop, below are two props */}
      {/*<Count number={3} limit={false} />*/}

      {/* conditional rendering here, if a number < 3 then show count component, otherwise show nothing; if the value exceeds 3 component disappears*/}
      {number < 3 ? <Count number={number} /> : null}

      {/*<number as prop>*/}
      {/* <Count number={number} />*/}
      <Button setNumber={setNumber} />
    </div>
  );
}

function App() {
  const numbers = [5, 3, 10];

  const newNumbers = [...numbers, 50];
  //spread operator to get the numbers in console instead of "numbers object", 50
  console.log(newNumbers);

  //console.log(
  //  numbers.map((number) => {
  //    return number * 2;
  //  })
  //); // map will create a new array
  //console.log(numbers.forEach());
  //this will print twice in console because of strict mounting
  // very commonly in javascript we want to map over the array, maybe we want to use a component e.g <Count /> for each number in the array

  return (
    <div className="app">
      {numbers.map((number, index) => {
        return <Count key={index} number={number} />; //prop number
        // if you do the mapping here react wants you to use key prop, it has to be unique, this is how react internally keeps track which component is which one
        // using index as a key is not a best practice
      })}
      <Button />
    </div>
  );
}

export default App;
