//import React from "react"; // 1 ****
//import { Fragment } from "react"; // 2 ****

// this is basically what react creates for you
// const props = {
//   number: 0,
//   size: "lg",
// };

// this is functional component
///previously we had class components as well, but now with hooks everything is very functional, react recommends using functional components
// we can have multiple components within the same file ***
export default function CountExplanation({ size, number }) {
  //import export it is modern syntax called ES modules
  // props holds all the inputs
  //   const countNumber = props.number;
  //   const size = props.size;

  // today we are destructuring immediately as above Count({size, number})
  // typically we do this by destructuring as follows, but this is not how we do this these days
  // const { size, number: countNumber } = props;
  // in Card.jsx we gave a number name <Count number={5} size="lg" />
  // you can rename when destructuring, if we want to give different name we use a colon, number: countNumber

  // return <p>{countNumber}</p>;

  return (
    // we can only return one thing so we use brackets
    // <div>
    //   <CountTitle />
    //   <p>{number}</p>
    // </div>
    // by using div here we altered html structure of index.html,
    // that can be a problem especially for styling, because flexbox and css grid they depend on the structure of the html
    // so if we change the structure of the html we may break our layout, don't want to unnecessarily add things to html

    // to address this problem react created the react fragment

    <>
      <CountTitle />
      <p>{number}</p>
    </>

    // 1 ****
    // <React.Fragment>
    //   <CountTitle />
    //   <p>{number}</p>
    // </React.Fragment>

    // 2 ****
    // <Fragment>
    //   <CountTitle />
    //   <p>{number}</p>
    // </Fragment>
  );
}

// we can have multiple components within the same file ***
function CountTitle() {
  return <h2>Current count is:</h2>;
}

// in arrow function you cannot export arrow function by writing in front of that export default

// const Count = () => {
//   return <p>0</p>;
// };

// export default Count;

/// if you like so you can make a function in a classical way, but the inner function can be arrow function

// function capitalizeText(text) {
//   const capitalizedText = text.toUpperCase();
//   return capitalizedText;
// }
