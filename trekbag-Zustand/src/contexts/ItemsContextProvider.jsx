import React from "react";
import { useState } from "react";
import { initialItems } from "../lib/constants";
import { useEffect } from "react";
import { createContext } from "react";

/// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----

// we are creating context 1/3
export const ItemsContext = createContext();
// this will create context, an object that will house all of the data that we wanna pass around in the app
// we can have multiple contexts in the app

export default function ItemsContextProvider({ children }) {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem("items")) || initialItems;
  });
  ///since it is a one liner you can remove return key word and it will also work

  const handleAddItem = (newItemText) => {
    // moved from AddItemForm
    const newItem = {
      id: new Date().getTime(),
      // name: itemText,
      name: newItemText,
      packed: false,
    };

    const newItems = [...items, newItem];
    setItems(newItems);
    // set new array  of items
  };

  const handleDeleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    // filter is going to check each item and to compare id of each item with the id we want to remove, filter something from the array, returns filtered array
    setItems(newItems);
  };

  const handleToggleItem = (id) => {
    const newItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, packed: !item.packed };
      }
      return item;
    });
    setItems(newItems);
  };

  // set the items so none are left, we are passing an empty array, everything in the previous array will be removed
  const handleRemoveAllItems = () => {
    setItems([]);
  };

  const handleResetToInitial = () => {
    setItems(initialItems);
  };

  const handleMarkAllAsComplete = () => {
    const newItems = items.map((item) => {
      return { ...item, packed: true };
    });

    setItems(newItems);
  };

  const handleMarkAllAsIncomplete = () => {
    const newItems = items.map((item) => {
      return { ...item, packed: false };
    });

    setItems(newItems);
  };

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);
  // now we can see items in Local storage for url http;//localhost:5173 tab

  // we are 2/3 providing context
  return (
    <ItemsContext.Provider
      value={{
        items,
        handleAddItem,
        handleDeleteItem,
        handleToggleItem,
        handleRemoveAllItems,
        handleResetToInitial,
        handleMarkAllAsComplete,
        handleMarkAllAsIncomplete,
      }}
    >
      {children}
    </ItemsContext.Provider>
  );
  //  consumers of this context will get access to this object
  // everything wrapped in <ItemsContextProvider> </ItemsContextProvider> in App.jsx will get access to the value above
}

// React Context API is very handy, so why do we have Zustand and Redux, more dedicated state management libraries, why do not we use React context API only

// performance issue
// one major problem with React Context API is that it does not have so called selectors, that means, if any of  <ItemsContext.Provider value={{ values change
// even if only one thing changes every consumer, basically everyone using that context, even if not using it will rerender,
// e.g. in Sidebar we are using only handleAddItem but because it is using this context here which also has other things in value,
// if items change thew whole Sidebar will rerender, and by default the child components will also rerender, and their child components will rerender,
// even though it is using only handleAddItem, if any of values change Sidebar will rerender, rendering is running all the statements in the function body

// another issue is that React Context API is a little bit verbose here, there is a bit of boilerplate especially when we get to typescript
// there is quite a bit of boilerplate when you have to setup a context for one of your pieces of data, in bigger application you may have 10 or 20
// context providers, you gonna have a lot of boilerplate, if you wanna do something more advanced like setup middleware that will not come with
// support out of the box in React
