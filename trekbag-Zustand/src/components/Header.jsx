import React from "react";
import Logo from "./Logo";
import Counter from "./Counter";
import { useContext } from "react";
import { ItemsContext } from "../contexts/ItemsContextProvider";
import { useItemsContext } from "../lib/hooks";

// export default function Header({ numberOfItemsPacked, totalNumberOfItems }) {
export default function Header({ children }) {
  //const { items } = useContext(ItemsContext);
  // annoying is to keep carrying around ItemsContext,
  // the best practice is to create custom hook for this
  const { items } = useItemsContext();

  return (
    <header>
      {/* children pattern in App.jsx to avoid prop drilling */}
      <Logo />
      <Counter
        numberOfItemsPacked={items.filter((item) => item.packed).length}
        totalNumberOfItems={items.length}
        //removed for ItemsContextProvider
        // numberOfItemsPacked={numberOfItemsPacked}
        // totalNumberOfItems={totalNumberOfItems}
      />
      {/* {children} */}
    </header>
  );
}
