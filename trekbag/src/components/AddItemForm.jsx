import React from "react";
import Button, { ButtonWithChildren } from "./Button";
import { useState } from "react";
import { useRef } from "react";

// export default function AddItemForm({ setItems }) {
// export default function AddItemForm({ handleAddItem }) {
//naming convention change
export default function AddItemForm({ onAddItem }) {
  const [itemText, setItemText] = useState("");

  const inputRef = useRef();

  const handleSubmit = (e) => {
    // console.log(e.target);
    // target of this event is not necessarily going to be this input below, we cannot grab input value like this, this won't work, we cannot get it from event object

    e.preventDefault();
    // this will prevent default reloading
    // 1****
    console.log(itemText);
    // now after putting value in the textfield and clicking button Add to list something unexpected happened and url changed to question mark
    // default functionality with the forms is if they get submitted the browser tries to send a network request to whatever you specify in the action="" attribute,
    // this is old school e.g. submit to php backend action="php/add-item.php", these days we don't let the browser submit it for us,
    // we do it ourselves in JS so we hook into submit event and do handle it ourselves, the browser still has this default behavior of trying to submit and reloading the page
    // we do not want that default behavior 1****

    //basic validation, if item text is still an empty string, if itemText is falsy, guard statement with an early return
    if (!itemText) {
      alert("Item cannot be empty");
      // it would be more professional to add toast message or error message than the alert

      //automatic focus to the input field again, after alert

      // in vanilla js would be like this:
      //document.querySelector("input").focus();

      // in Reacty way we need to get a reference to the underlying html element <input> sometimes called DOM note
      // we will use different hook in React useRef hook <input ref={inputRef} and const inputRef = useRef(); above
      inputRef.current.focus();
      return;
    }

    // now how to add itemText to this list, "Add an item" is in Sidebar component, We want to update setItems ItemList,
    // how to access that in AddItemForm() when the state is in ItemList?, we want to lift the state up the tree component from ItemList
    // we want to add new item based on the text input

    // we are already doing to much with newItem here below, function of AddItemForm should pass along text,
    // does not need to know about other elements, form does not need to know about id or packed, only needs to know about text
    // instead of passing along the objects will will pass the text, and somewhere else we will decide how the object should look like
    // const newItem = {
    //   id: new Date().getTime(),
    //   name: itemText,
    //   packed: false,
    // };

    // we want unique id on every added item

    // we want to add that item to the list of items, we need to get access to the previous items, we don't need a prop drilling with that items,
    // we only need a setter function, the setter function will give you the previous items (current items)

    // setItems((prev) => [...prev, newItem]);
    // prev here is an array of all the items we already have
    // we need to spread there previous items in the array [...prev, newItem]

    //handleAddItem(newItem);
    // naming convention of prop
    onAddItem(itemText);

    // clearing input field after clicking Add to list button (overwrite with an empty string)
    setItemText("");
  };

  return (
    // we want to hook into event submit event onSubmit to add an item with text form, we have event object e: onSubmit={(e) => { console.log(e.target);
    // target of this event is not necessarily going to be this input below, we cannot grab input value like this, this won't work, we cannot get it from event object
    // we are going to keep track the input value with useState
    <form action="" onSubmit={handleSubmit}>
      <h2>Add an item</h2>
      {/* controlled input */}
      <input
        ref={inputRef}
        value={itemText}
        onChange={(e) => {
          setItemText(e.target.value);
        }}
        autoFocus
        // we want the focus on that input field by default
        // in JSX when you have a boolean on attribute (HTML) in JSX it is a prop, JSX tag, you can write autoFocus={true} or only autoFocus which by default is true
      />
      {/* default input type is text, it can be also checkbox; <input type="text" */}

      <Button text="Add to list" />
    </form>
  );
}
