import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

export default function CountButton({ type, setCount, locked }) {
  const handleClick = (event) => {
    setCount((prev) => {
      if (type === "minus") {
        const newCount = prev - 1;
        if (newCount < 0) {
          return 0;
        }
        return newCount;
      } else {
        const newCount = prev + 1;
        if (newCount > 5) {
          return 5;
        }
        return newCount;
      }
    });
    // we want to unfocus the button
    // we take event object with information about the event ant it will give is a current target, we want to unfocus the thing that was recently clicked (button)
    // blur is the opposite of focus, we want to do the same with reset
    event.currentTagret.blur();
    console.log("clicked");
  };

  // we want to lock the number on 5 with buttons so when we got 5 a title changes it's name and we cannot decrement with a minus button, to start all over again we need to reset
  // we want to disable the buttons when the count is 5
  return (
    <button
      // html attribute disabled, if locked is true the button will be disabled, the browser will prevent the click event from occurring
      // we also want to change the background color to indicate that the app is locked
      disabled={locked}
      onClick={
        handleClick
        //setCount(count + 1);
        // instead of passing value like this setCount(count + 1); another way is to pass a function here
        //it has to be a function () => {setCount((prev) => prev + 1);} like this because a function awaits for the (event occurring) action of user, we do not want function to run immediately
        // setCount((prev) => prev + 1);
        // console.log("clicked");
      }
      className="count-btn"
    >
      {/* if the type is truthy (is minus) then , else */}
      {/* this is one way of doing it by ternary operator, the alternative is with logical end operator, 2 ways of conditional logic in react */}
      {/* {type === "minus" ? (
        <MinusIcon className="count-btn-icon" />
      ) : (
        <PlusIcon className="count-btn-icon" />
      )} */}
      {type === "minus" && <MinusIcon className="count-btn-icon" />}
      {type === "plus" && <PlusIcon className="count-btn-icon" />}
      {/* <PlusIcon className="count-btn-icon" /> */}
    </button>
  );
}

{
  /* <div className="button-container">
  <button
    onClick={() => {
      setCount((prev) => prev - 1);
    }}
    className="count-btn"
  >
    <MinusIcon className="count-btn-icon" />
  </button>
  </div> */
}
