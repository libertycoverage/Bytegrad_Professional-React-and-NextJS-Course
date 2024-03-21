//you can export default before declaration
//export default function Count() {
//  return <span>0</span>;
//}

import { useEffect, useState } from "react";

//props object
/*
{
  number: 5;
  limit: true;
}
*/

/*
export default function Count(props) {
  //destruct something from props object, extract number and limits from props, so you don't have to invoke props.limit and props.number
  const { number, limit } = props;

*/

//destructuring in the parameter list
//export default function Count({ number, limit }) {
//destruct something from props object, extract number and limits from props, so you don't have to invoke props.limit and props.number

/*
export default function Count() {
  const number = 0;

  //hooks, useState Hook
  //const [number, setNumber] = useState(4);

  //return <span>0</span>;
  //return <span>{props.limit ? "Limit reached" : props.number}</span>;
  // return <span>{limit ? "Limit reached" : number}</span>;
  // event handlers with question mark and colon

  //you click not the button, but the number itself, and it changes to proper value
  return (
    <span
      onClick={() => {
        setNumber(5);
      }}
    >
      {number}
    </span>
  );
}

*/

/*
// arrow function
const Count = () => {
  // you can only return one thing so you can return one div:
  return (
    <div>
      <CountLabel></CountLabel>
      <span>0</span>
    </div>
  );
};


// you export at the bottom in case of an arrow function

function CountLabel() {
  return <p>The current count is:</p>;
}

export default Count;
*/

// this won't work you cannot reassign to a constant
/*
export default function Count() {
    const number = 0;

    return <span onClick={() => {
        number = number +1;
    }} className="count">{number}</span>;
*/

// this works (changes variable by number++) but by clicking on the number, nothing will change on website because a component is not rerendered,
// we need to use useState hook
/*
export default function Count() {
    let number = 0;

    return <span onClick={() => {
        number = number +1;
        console.log(number);
    }} className="count">{number}</span>;
*/

/*
export default function Count() {
  const [number, setNumber] = useState(0);

  return (
    <span
      onClick={() => {
        setNumber(number + 1);
      }}
      className="count"
    >
      {number}
    </span>
  );
}
*/

//lifting state up instead of defining in count:  const [number, setNumber] = useState(0); we loot at the common parent, App.js
//importing number as props

/*
export default function Count({ number }) {
  // useEffect hook, is just a function you can call, you want to specify the function, event handlers, arrow functions,
  // and then you set how often you want to use this functions
  //useEffect(() => {}, []);
  // if use effect is an empty array it means you only want to run it the first time this component is on a page, first time this component renders
  //useEffect(() => {}); //if there is no array we want to run this function every render which is basically you never want to do

  // sometimes you need to interact with something outside the app, for example the document title (on the tab)
  // or external server, or with the window object e.g. pressing spacebar incrementing number, event on the window object
  useEffect(() => {
    document.title = `You clicked ${number} times`;

    // the return function is run when you unmount the component
    return () => {
      document.title = "Standard website title";
    };
  }, [number]);
  //every time number changes, also runs on the first mount of the component

  /// sometimes we want to do the clean up of useEffect, we want ot go to another page and flush or change the title of the page

  return <span className="count">{number}</span>;
}
*/

// template literals, e.g. manipulating the css by changing a className
// template literals

/* 
export default function Count() {
  const value = 5;
  //const text = "The current count is value " + value;
  // concatenation ""
  // if you want multiple lines in concatenation convert it to temp literal with backtakes ``
  //const text = `The current count is value ${value}`;

  // this is early return statement, we have 2 returns:
  //if (value > 3) {
  //  return <span>Limit reached!</span>;
  //in a javascript function as soon as there is a 'return' keyword, that's where function stops
  //}

  // truthy and false values, number is a truthy value
  //const value = 5;
  // also string
  //const value = "test";
  // also truthy
  //const value = [5, 2];
  // also truthy
  //const value = {test: 3};
  //if (value) {
  //  <span>Hello</span>;
  //}
  //return <span className="count">{text}</span>;

  // if value > 3 is truthy we display text otherwise we display value if value is not truthy
  //const value = 5;
  //return <span className="count">{value > 3 ? "Limit reached!" : value}</span>; //ternary operator (conditional)
  //return <span className="count">{value === 5 ? "Five" : "not five"}</span>;
  //return <span className="count">{value === 5 && "five"}</span>;
  // ampersand both have to be true, if value is not truthy (is falsy) it doesn't go to the second step; if the second condition is false entire thing is false
  //return <span className="count">{value && "five"}</span>;
}
*/

/*
//prop number
export default function Count(number) {
    return <span className="count">{number}</span>;
}
*/

/* objects

export default function Count(){
    const limit = 10;
    const currentCount = 4;
    const info = {
        currentCount,
        //limit : limit // in js when you have the same name for the property as the property value you can simply write limit
        limit,
    };
    return <span className="count">0</span>;
}

*/

/* objects destructuring, extracting property of an object

export default function Count(){
    const info = {
        currentCount: 4,
        limit: 10,
    };

    //const limit = info.limit;
    //const currentCount = info.currentCount
    //destructuring
    //const {limit, currentCount} = info;
    //console.log(limit, currentCount);

    //const newInfo = {
        //spread operator
    //    ...info,
    //    newCount: true,
    //}

    const newInfo = {
        //spread operator
        ...info,
        // we want to override
        limit: 20,
    }

    console.log(newInfo);

    return <span className="count">0</span>;
}

*/

/*

function Count(){
    const info = {
        currentCount: 4,
        limit 10,
    };

    const newInfo = {
        ...info,
        limit: 20,
    };

    console.log(newInfo);
    return <span className="count">0</span>;

}

export default Count;

*/

/* this will give errors, you cannot have export in the same line as arrow function

export default const Count = () => {
    return <span className="count">0</span>
}

///you have to export like this:

const Count = () => {
    return <span className="count">0</span>
}
export default Count;

*/

/* export as a name function, not as default
export function Count() {
    return <span className="count">0</span>

}

// in the App.jsx you need to add 
import {Count} from "./Count";
// when you don't use default
*/

/* we can 
export const number = 5;


*/

// this syntax of import and export is called ES modules, it is a modern format for import and export, also for NodeJS

// sometimes you gonna see common js
// require("./App.css"); // for imports
// module.exports = { } // for exports

/* CSS Count.css

export default function Count(){
    // two sets of curly braces, specify javascript {} object {}
    return <span style={{
        color: 'green',
        fontSize: '50px' 
    }}>0</span>;
    //inline styles
}


// CSS Count.css

import "./Count.css";

export default function Count(){
    return <span className="count">0</span>
}

/// .count from Count.css is scoped globally, what to do if we want also have .count for Button.css
/// Button.jsx 

export default function Button() {
    return <button>+
    <span className="count">Increase count</span></button>;
}



/// Count.module.css scope to component
/// today it is not done like that but tailwind.css is used

import styles from "./Count.module.css";

export default function Count(){
    return <span className={styles.count}>0</span>
}



*/

/* CSS in JS, syntax is strange

export default function Count() {
    const span = span`
        color: green;
        font-size: 10px;
    `
}


export default function Count(){
    const number = 5;

    return <span className="count">{number}</span>
}

//now look into index.css

//how do we change the class name, we want to convert className="count" to so called template literal

export default function Count(){
    const number = 5;

    return <span className={`count ${number === 5 ? 'count--limit' : "" }`}>{number}</span>
}

// if number is five call count limit otherwise anything else


// in Tailwind css we don't have to come up with the creative class name for CSS
// we can use class-like

export default function Count(){
    return <span className="tex-green text-xl">0</span>
}

*/

/*
// the most important in css is flex box

export default function Count(){
    return <span className="count">0</span>
}


// let's look into App.jsx below
// inline styles "app"
// for majority of layout problems you want to use flexbox
// to use flexbox you need to identify the parent element

import Button from "./Button";
import Count from "./Count";

function App() {
    return (
        <div className="app">
        <Count />
        <Button />
        </div>
    );
}

export default App;

// look into index.css .app

// flex container direct child elements become a flex items

*/
