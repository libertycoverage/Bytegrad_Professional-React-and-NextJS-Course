import React from "react";

import { ButtonWithTextProp, ButtonWithChildren } from "./Button";
import { secondaryButtons } from "../lib/constants";
import { ItemsContext } from "../contexts/ItemsContextProvider";
import { useContext } from "react";
import { useItemsContext } from "../lib/hooks";

// it is good to move the array of unique keys before the actual component renders - ButtonGroup() - to not to generate the same variables each time component rerenders
// does not have to be recreated each time, define array outside the component if you can

// export default function ButtonGroup(handleRemoveAllItems) {
//removed for ItemsContextProvider
// export default function ButtonGroup({
//   handleRemoveAllItems,
//   handleResetToInitial,
//   handleMarkAllAsComplete,
//   handleMarkAllAsIncomplete,
// }) {
export default function ButtonGroup() {
  //context
  const {
    handleMarkAllAsComplete,
    handleMarkAllAsIncomplete,
    handleResetToInitial,
    handleRemoveAllItems,
    // } = useContext(ItemsContext);
  } = useItemsContext();

  // const secondaryButtons = [
  //   {
  //     text: "Mark all as complete",
  //     onClick: handleMarkAllAsComplete,
  //   },
  //   {
  //     text: "Mark all as incomplete",
  //     onClick: handleMarkAllAsIncomplete,
  //   },
  //   {
  //     text: "Reset to initial",
  //     onClick: handleResetToInitial,
  //   },
  //   {
  //     text: "Remove all items",
  //     onClick: handleRemoveAllItems,
  //   },
  // ];

  return (
    <section className="button-group">
      {/* <ButtonWithTextProp text="Mark as complete" /> */}
      {/* <ButtonWithTextProp type="secondary" text="Mark as complete" /> */}

      {/* {secondaryButtons.map((text) => {
        return (
          <ButtonWithChildren
            // handleRemoveAllItems={handleRemoveAllItems}
            key={text}
            // type="secondary"
            buttonType="secondary"
          >
            {text}
          </ButtonWithChildren>
        );

      })} */}

      {/* // we need to add key we can use text (unique descriptions) as a key key={text}, react needs to know which button is which
        // you could add a prop index map((text, index) => {} and  key={index}, but it is a bad practice, in the array there could be a change of order, e.g. list of items
        // we need to specify unique key which is stable, index is not a good choice, we need a unique valid stable key every time component rerenders
        // what you don't wanna do is key={Math.random()} every time this component rerenders (ButtonGroup) Math.random() will generate new numbers, it won't be tracked by React between renders */}

      <ButtonWithChildren
        onClick={handleMarkAllAsComplete}
        buttonType="secondary"
      >
        Mark all as complete
      </ButtonWithChildren>
      <ButtonWithChildren
        onClick={handleMarkAllAsIncomplete}
        buttonType="secondary"
      >
        Mark all as incomplete
      </ButtonWithChildren>
      <ButtonWithChildren onClick={handleResetToInitial} buttonType="secondary">
        Reset to initials
      </ButtonWithChildren>
      <ButtonWithChildren onClick={handleRemoveAllItems} buttonType="secondary">
        Remove all items
      </ButtonWithChildren>
      {/* 
      {secondaryButtons.map((button) => (
        <ButtonWithChildren
          key={button.text + button.onClick.toString()} // concatenation because relying on text alone is risky as a unique key
          buttonType="secondary"
          onClick={button.onClick}
        >
          {button.text}
        </ButtonWithChildren>
      ))} */}

      {/* <ButtonWithChildren type="secondary">
        Mark all as incomplete
      </ButtonWithChildren>
      <ButtonWithChildren type="secondary">Reset to initial</ButtonWithChildren>
      <ButtonWithChildren type="secondary">Remove all items</ButtonWithChildren> */}
    </section>
  );
  // section tag better than div, buttons within button group are semantically related
}
