import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import "./index.css";

// ReactDOM.createRoot waits for some HTML, after the root there is an exclamation mark letting TypesScript know we accept the risk of passing a null
// technically getElementById could be a null if we have wrong selector e.g. root or another here
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
