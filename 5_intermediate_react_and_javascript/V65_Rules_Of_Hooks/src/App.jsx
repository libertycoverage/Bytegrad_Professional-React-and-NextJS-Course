import { useEffect, useState } from "react";
import Count from "./Count";
import Button from "./Button";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
//import "./App.css";

// Vid63, now Vid64 Custom Hooks, we move useQuantity hook to hooks.js
//import { useQuantity } from "./hooks";

// in this project Vid65 hooks.js was deleted

function App() {
  const [quantity, setQuantity] = useState(0);

  //Rules about hooks

  //RULE 1

  // You cannot do hooks after some if statement like this, after the early return

  // ESLint linted useEffect as read underline, syntax error
  //React Hook "useEffect" is called conditionally.
  //React Hooks must be called in the exact same order in every component render.
  //Did you accidentally call a React Hook after an early return?

  //this is not allowed, you have to do it after hooks

  // if (quantity < 5) {
  //   return <span>Not enough products</span>;
  // }

  // RULE 2
  // You cannot also use hooks in the loop or something like that

  // use need to specify the function you want to run, and with the array you specify how often you want to run this function
  // when you fetch the data you usually want to fetch it once when you mount the component, when you load the app
  // use of https://dummyjson.com/products

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://dummyjson.com/products"); // await before promise
      const data = await response.json(); // .json gives us a promise
      console.log(data);
      setQuantity(data.total);
    };
    fetchProducts();
  }, []);

  //RULES ABOUT HOOKS
  //here, after hooks you can do early returns, not before hooks

  if (quantity < 5) {
    return <span>Not enough products</span>;
  }
  //RULES ABOUT HOOKS

  // RULE 3
  // You cannot use hooks in nested functions, as below
  // THIS IS NOT ALLOWED

  // const incrementNumber = () => {
  //   useEffect(() => {
  //     setQuantity(quantity + 1);
  //   });
  // };

  // useEffect can only be called on the top of level of the component, not within some function

  //
  // RULE 4
  //
  // You cannot also have a loop and call some hook in the loop,
  // that goes also for these UseState and UseEffect hooks
  // and also for your custom hooks

  // You could say, we had a function like below we are not allowed to do useEffect in a function,
  // but you are allowed to use useEffect in custom hooks as in hooks.js in Vid64 as in V63 project
  // if you add "use" in front of increment you create custom hook

  // You can do useEffect in the loop of custom hook

  const useIncrement = () => {
    setQuantity(quantity + 1);
    useEffect(); //is not allowed in the function
  };

  return (
    <div className="app">
      <Count quantity={quantity} />
      <Button setQuantity={setQuantity} />
    </div>
  );
}

export default App;
