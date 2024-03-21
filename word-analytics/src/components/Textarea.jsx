import React, { useState } from "react";
import Warning from "./Warning";

export default function Textarea({ text, setText }) {
  //const [text, setText] = useState("");
  //const [showWarning, setShowWarning] = useState(false);
  const [warningText, setWarningText] = useState("");

  // we move these two states up the file hierarchy into Container.jsx so it can be passed into Stats.jsx
  //const [text, setText] = useState("");
  //const numberOfCharacters = text.length;
  // then we need to pass these text setText as props

  // this setNumberOfCharacters is not necessary because we already have useState of text and we can calculate the number of characters using text
  //const [numberOfCharacters, setNumberOfCharacters] = useState(0);

  //we derive from text, derived state or another words computed state

  //console.log(numberOfCharacters);

  const handleChange = (e) => {
    //console.log("change event...");
    //console.log(e.target.value);
    //when we do nothing with the output of a textarea it is uncontrolled text area; in React there is a concept of controlled input (controlled textarea) and uncontrolled input
    //controlled textarea we are gonna use

    //basic validation
    let newText = e.target.value;
    if (newText.includes("<script>")) {
      setWarningText("No script tag allowed!");
      //setShowWarning(true);
      //alert("No script tag allowed!");
      // early return will stop the function execution
      //return;
      newText = newText.replace("<script>", "");
      // regex example: else if (/@/.test(newText)) {}
    } else if (newText.includes("@")) {
      setWarningText("No @ symbol allowed!");
      //setShowWarning(true);
      newText = newText.replace("@", "");
    } else {
      setWarningText("");
    }

    setText(newText);

    // this setNumberOfCharacters is not necessary because we already have useState of text and we can calculate the number of characters using text
    //setNumberOfCharacters(newText.length);
    //we derive from text
  };
  // to handle warning in a prettier way without a blocking message we need to make a warning(.jsx) component we are going to display

  // <input> tag used for one line input, <textarea> for area, multiple lines; const newText = e.target.value; this method will work also with <input>
  // event of change will be assigned to e
  return (
    <div className="textarea">
      <textarea
        value={text}
        onChange={handleChange}
        //className="textarea"
        placeholder="Enter your text..."
        // browser won't do the spell checking
        spellCheck="false"
      />
      {/*//<WordSpellCheck text={text} /> */}
      {/*{showWarning ? <Warning warningText={warningText} /> : null} */}
      {/*{warningText ? <Warning warningText={warningText} /> : null} */}
      {<Warning warningText={warningText} />}
    </div>
    // in case of an error you can return only one thing,
    //returning a div our layout will change let's use react fragment then
    // one downside of using a fragment is you cannot use className
    // let's use div and we are moving className="textarea" up
  );
  // we need change event for the event of typing
}
