import { useEffect, useState } from "react";
import Count from "./Count";
import Button from "./Button";
//import reactLogo from "./assets/react.svg";
//import viteLogo from "/vite.svg";
//import "./App.css";

// Vid63, now Vid64 Custom Hooks, we move useQuantity hook to hooks.js
import { useQuantity } from "./hooks";

function App() {
  const { quantity, setQuantity } = useQuantity();
  //destructuring an object immediately

  // const [quantity, setQuantity] = useState(0);

  // use need to specify the function you want to run, and with the array you specify how often you want to run this function
  // when you fetch the data you usually want to fetch it once when you mount the component, when you load the app
  // use of https://dummyjson.com/products

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const response = await fetch("https://dummyjson.com/products"); // await before promise
  //     const data = await response.json(); // .json gives us a promise
  //     console.log(data);
  //     setQuantity(data.total);
  //   };
  //   fetchProducts();
  // }, []);

  return (
    <div className="app">
      <Count quantity={quantity} />
      <Button setQuantity={setQuantity} />
    </div>
  );
}

export default App;
