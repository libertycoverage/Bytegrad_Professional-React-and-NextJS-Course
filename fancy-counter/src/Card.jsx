// using snippet rfc
import React, { useEffect } from "react";
import { useState } from "react";
import Title from "./Title";
import Count from "./Count";
import ResetButton from "./ResetButton";
//import CountButtons from "./CountButtons.jsx";
import ButtonContainer from "./ButtonContainer";

import CountButton from "./CountButton";

export default function Card() {
  const [count, setCount] = useState(0);

  // we want to lock the number on 5 with buttons so when we got 5 a title changes it's name and we cannot decrement with a minus button, to start all over again we need to reset
  // we want to disable the buttons when the count is 5
  // we are doing a prop drilling with locked={locked}
  //const [locked, setLocked] = useState(false); // we don't need additional state to know it's locked
  const locked = count === 5 ? true : false;

  // useEffect hook for a spacebar keybaord counting, we need to specify two things, a function and second we want define how often we want to run this function with the array
  // if the array is empty we want to run the function when the Card component mounts on the page (when it is first rendered on the page) useEffect(() => {}, []);,
  // or in a Strict Mode it will mount twice
  // if we leave that off to the useEffect(() => {}); without the array, it will run every time every time the current component renders
  useEffect(() => {
    const handleKeydown = (event) => {
      if (event.code === "Space") {
        // we want to make sure with spacebar we will not go above the limit
        const newCount = count + 1;
        if (newCount > 5) {
          setCount(5);
          return;
        }
        //setCount(count +1);
        setCount(newCount); // when it is less than five or it is five
      }
    };
    // there is also onchange for inputs, there is also an event when you type on the keyboard, for the click event you can do onClick because you have a visual element on the page
    // it stays stuck at 1, it has to go with the more advanced javascript concept called closures, it has to be count in the dependency array
    window.addEventListener("keydown", handleKeydown);
    //we have a bug with holding a space it stays where we are video 29 time -5:43, it is because these buttons can be focused
    //clean up function
    //this clean up function also runs when we unmount Card component itself
    //we don't wanna have any lingering event listeners, that ona a new page we don't wanna have these EventListener on the window object,
    //so the function below runs when the Card is unmounted
    // if we have a button element lets say CountButton.jsx there is a button tag,
    // if on a clean run we click on the button with the mouse it will be focused, focus stay on that pressed button, focus state has some styling
    // when you press a spacebar it actually increases by two, when you have a focused button and you press space that is the same as clicking on that button,
    // so eventually we trigger onClick={handleClick} as well and then also with the EventListener const handleKeydown = (event)
    // we run setCount(count + 1); We are essentially incrementing twice here,
    // the same is with minus, when we click minus one time and then press spacebar you can see it quickly goes up one time setCount(count + 1);
    // then it goes down because the minus button is still focused, there will be a click event onClick={handleClick} which decrement the count
    // that is why we don't wanna have lingering focus on the button, after a click we don't want a button to be focused, we want to get rid of focus state
    // button on handle click onClick={handleClick} we run handleClick function, and when you deal with events the Browser will also give you information
    // about the events that just occurs, we will do that in event object CountButton  const handleClick = (event) => {
    // we take event object with information about the event ant it will give is a current target
    //
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [count]);
  //dependency array above
  // here comes an error beyond 13-15, because an old event listener still exist, when we addEventListener we do this initially, we attach a function to this event
  // then we press space which changes count value, then it will run again, adding a new EventListener not removing the previous one,
  // with pressing the space we are adding more and more event handlers to the same event, and that is not what we want,
  // before we attach another one we want ot remove the previous one
  // that is why the event hook also has so called cleanup function return () => {}

  return (
    // we want to disable the buttons when the count is 5
    //<div className="card">
    // we are gonna use template literal
    <div className={`card ${locked ? "card--limit" : ""}`}>
      {/*we are passing locked prop to the title*/}
      <Title locked={locked} />
      {/*Title has to be with a capital letter actually*/}
      {/*CountExplanation just below */}
      {/* <CountExplanation number={5} size="lg" /> */}
      {/*Everything apart from string needs to be in curly braces e.g. numbers, there can be boolean {true} or array with data {[]} or another object {{}}*/}

      {/* but our Count component still need the count which is currently in Card component, we need to use props, input for the component*/}
      <Count count={count} />
      {/*<ResetButton />*/}
      <ResetButton setCount={setCount} />
      {/*<ButtonContainer setCount={setCount} locked={locked} /> */}
      {/*to address the prop drilling problem we paste here CountButtons from ButtonContainer, structure stays the same */}
      {/*just above we are doing prop drilling we do these two below, we are passing setCount to button container do we don't need these above <ButtonContainer setCount={setCount} locked={locked} />*/}
      <ButtonContainer>
        <CountButton type="minus" setCount={setCount} locked={locked} />
        <CountButton type="plus" setCount={setCount} />
      </ButtonContainer>
      {/* we also need to import above this: import CountButton from "./CountButton"; */}
      {/* after that our button do not work, why is that, ButtonContainer here it receives child elements here, it needs to accept this as a prop in ButtonContainer.jsx*/}
      {/* this is a standard prop called children, and what it need to do with these children, it need to put that in return <div className="button-container">{children}</div> */}
      {/* children is a standard name for whatever you put in the opening and closing tags, Children Composition Pattern */}
    </div>
  );
}
