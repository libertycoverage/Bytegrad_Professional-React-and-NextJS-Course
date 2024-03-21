import React from "react";
import AddItemForm from "./AddItemForm";
import ButtonGroup from "./ButtonGroup";
import { useContext } from "react";
import { ItemsContext } from "../contexts/ItemsContextProvider";
import { useItemsContext } from "../lib/hooks";

// export default function Sidebar({ setItems }) {

//  prop drilling solution for Sidebar with children pattern
//removed for ItemsContextProvider
// export default function Sidebar({
//   handleAddItem,
//   handleRemoveAllItems,
//   handleResetToInitial,
//   handleMarkAllAsComplete,
//   handleMarkAllAsIncomplete,
// }) {
export default function Sidebar() {
  // export default function Sidebar({ children }) {

  //context
  // const { handleAddItem } = useContext(ItemsContext);
  const { handleAddItem } = useItemsContext();

  console.log("Sidebar rendering");

  return (
    <div className="sidebar">
      {/* <AddItemForm setItems={setItems} /> */}
      {/* prop drilling with setItems */}
      {/*  AddItemForm more specific name for a form, form is a common thing */}
      {/* <AddItemForm handleAddItem={handleAddItem} /> */}
      {/* naming convention, instead of handleAddItem prop, we call name of the prop onAddItem and function we gonna call we name handleAddItem */}
      {/* <AddItemForm onAddItem={handleAddItem} />  */}
      {/* typically if you have normal native tag e.g. <button onClick={handleClick}></button> you have onClick, 
      typically in React with the custom component we have here <AddItemForm />
      we do try to mimic what we have with normal native element */}

      {/* we pass setItems to button group so buttons can work on that, there is a cleaner way of doing that 5**** (in App.jsx) */}

      {/* prop drilling solution children pattern */}

      {/* //removed for ItemsContextProvider */}
      {/* <AddItemForm onAddItem={handleAddItem} /> */}
      <AddItemForm onAddItem={handleAddItem} />
      {/* <ButtonGroup
        handleRemoveAllItems={handleRemoveAllItems}
        handleResetToInitial={handleResetToInitial}
        handleMarkAllAsComplete={handleMarkAllAsComplete}
        handleMarkAllAsIncomplete={handleMarkAllAsIncomplete}
      /> */}
      <ButtonGroup />
      {/* {children} */}
    </div>
  );
}
