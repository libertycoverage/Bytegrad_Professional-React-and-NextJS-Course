/*
export default function Button() {
  const handleClick = () => {
    console.log("clicked");
  };

  return <button onClick={handleClick}>+</button>;
  // {handleClick} specifies event (it waits for execution, click), if there was {handleClick()} function would be straight executed printing log without waiting for a click
}
*/

export default function Button({ setNumber }) {
  // setNumber here is a prop from App.jsx
  return (
    <button
      onClick={() => {
        // we have a problem with passing a number from App.jsx here
        //setNumber(number + 1);
        setNumber((prev) => {
          // console.log(prev);
          return prev + 1;
        });
      }}
      //className="count"
    >
      +
    </button>
  );
}

//lifting state up instead of defining in count:  const [number, setNumber] = useState(0); we loot at the common parent, App.js
