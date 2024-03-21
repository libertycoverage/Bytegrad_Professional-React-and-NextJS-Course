import { useState } from "react";

export default function Count({ count }) {
  // we are destructuring props from the props above
  console.log("Count component rendering");
  // originally this renders twice, React render more than you expect, React.Strictmode as in main.jsx renders components twice
  //const count = 0;
  //let count = 0;
  //const [count, setCount] = useState(0);
  // we need to use StateHook in React to rerender component

  return (
    <p
      // in html there is onclick (with a small case)
      // if you have an input field you have onChange
      onClick={() => {
        //count = count + 1;
        setCount(count + 1);
        // but we need to rerender component to se the change
        // we need to lift up the state in the tree of app to the Card component so that another components will use the state
        // but our Count component still need the count which is currently in Card component, we need to use props, input for the component
        console.log("clicked");
      }}
      className="count"
    >
      {count}
      {/*could be also {props.count} */}
    </p>
  );
}
