import { useState } from "react";
//import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
//import "./App.css";

import Card from "./Card";

function App() {
  // return <div> </div>;
  // we could use div, but div has no semantic meaning,
  // typically it is better to use semantic tags like <main></main> for the dominant content on the page
  return (
    <main>
      <Card />
    </main>
  );
}

export default App;
