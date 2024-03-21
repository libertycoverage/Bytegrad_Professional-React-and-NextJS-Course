import React, { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";

type FeedbackFormProps = {
  onAddToList: (text: string) => void;
};

export default function FeedbackForm({ onAddToList }: FeedbackFormProps) {
  const [text, setText] = useState("");

  const [showValidIndicator, setShowValidIndicator] = useState(false);

  const [showInvalidIndicator, setShowInvalidIndicator] = useState(false);

  const charCount = MAX_CHARACTERS - text.length;

  //typescript benefit, if you hover over text there is a string type for a text variable initialized with an empty string, we did not declare that ourselves
  //then we want some;;; const shorterText = text.slice(); // typescript does not complain about the type,
  //but it will complain for such;;;  const numberToFixed = text.toFixed(); // because toFixed() is reserved for numbers and not a string type

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length > MAX_CHARACTERS) {
      return;
    }
    setText(newText);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // one thing here when we submit something like this "this is a test bytegrad" without a hashtag nothing appears on the list, when we submit we do not get any feedback
    // we want a red outline on the textfield on that kind of submission and when oit is ok we want green outline on the frame of text field, we want a validation when the user submit the form
    // we want to add basic validation before we add text to the list, we can solve this multiple ways, we use showValidIndicator
    if (text.includes("#") && text.length >= 5) {
      setShowValidIndicator(true);
      setTimeout(() => {
        setShowInvalidIndicator(false);
      }, 2000);
    } else {
      setShowInvalidIndicator(true);
      setTimeout(() => setShowInvalidIndicator(false), 2000);
      return;
      //we return out of the function so the rest will not execute and text won't be submitted, text field won't reset
    }

    onAddToList(text);
    setText(""); //cleaning after submitting the text
  };
  //now after submitting we se a reload and question mark http://localhost:5173/?
  //this is because by default browser tries to submit this form to some action address you specify <form action="/add-item.php" onSubmit={handleSubmit}
  //these day we want to do it ourselves in js, we do not want that default behavior
  //TypeScript now gives error on that event, we need to specify type of the event, to know what is the type of the event we should do
  // onSubmit={e => handleSubmit} and hover over e element to get to know the type, here it is: e: React.FormEvent<HTMLFormElement>
  //

  return (
    // <form onSubmit={handleSubmit} className={"form"}>
    <form
      onSubmit={handleSubmit}
      className={`form ${showValidIndicator ? "form--valid" : ""} ${
        showInvalidIndicator ? "form--invalid" : ""
      }`}
    >
      <textarea
        value={text}
        // onChange={(event) => {
        //   const newText = event.target.value;
        //   if (newText.length > MAX_CAHRACTERS) {
        //     return;
        //   }
        //   setText(newText);
        // }}
        // onChange={(e) => {}}
        // we need to copy this from intellisense on e -> e: React.ChangeEvent<HTMLTextAreaElement></HTMLTextAreaElement> to alter handleOnChange type
        onChange={handleOnChange}
        id="feedback-textarea"
        placeholder="blabla"
        spellCheck={false}
        // maxLength={150} -> we will do this ourselves
        //maxLength={MAX_CAHRACTERS}
      />
      {/* when user will write something and click the button this form will be submitted */}

      {/* initial value for placeholder is overwritten with this, advanced css trick: textarea:not(:placeholder-shown) + label { */}
      <label htmlFor="feedback-textarea">
        Enter your feedback here, remember to #hashtag the company
      </label>

      <div>
        <p className="u-italic">{charCount}</p>
        <button>
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}
