import { useState } from "react";
import BackgroundHeading from "./BackgroundHeading";
import Footer from "./Footer";
import Header from "./Header";
import ItemList from "./ItemList";
import Sidebar from "./Sidebar";
import { initialItems } from "../lib/constants";
import { useEffect } from "react";
import Logo from "./Logo";
import Counter from "./Counter";
import AddItemForm from "./AddItemForm";
import ButtonGroup from "./ButtonGroup";
import ItemsContextProvider from "../contexts/ItemsContextProvider";

function App() {
  /// (AFTER ADDING LOCAL STORAGE) before we use initialItems we check if we have some values sorted in LocalStorage, if not then proceed with that
  //const itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"));
  /// if there is nothing in local storage itemsFromLocalStorage will be null actually
  //const [items, setItems] = useState(itemsFromLocalStorage || initialItems);
  /// if the first itemsFromLocalStorage is falsy it will give us initialItems, when the first is truthy it will stop on the first one, not evaluating the second,
  /// operator || is reverse of &&

  /// optimization for performance, every time app renders we are interacting with local storage this is not the best practice
  /// we can initialize with value useState(itemsFromLocalStorage || initialItems) it will result in array with objects useState([]);
  /// or we can initialize with a function, it will only run first time (initially), not every rerender of the component but only once when it (local storage functions as above) gets initialized

  /// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----
  // const [items, setItems] = useState(() => {
  //   return JSON.parse(localStorage.getItem("items")) || initialItems;
  // });
  ///since it is a one liner you can remove return key word and it will also work
  /// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----

  // 5**** any manipulation that we make on those items why not define here as well
  // we add to add an item to that array of items,
  // we can create a function for that that will semantically describe, what the function is gonna do, and that will pass to the form in this case
  // instead of passing setItems((prev) => [...prev, newItem]) in AddItemForm.jsx we lift that up as well, where the items already exist

  // this one is cleaner than spreading around setItems
  //const handleAddItem = (newItem) => {

  /// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----
  // const handleAddItem = (newItemText) => {
  //   // moved from AddItemForm
  //   const newItem = {
  //     id: new Date().getTime(),
  //     // name: itemText,
  //     name: newItemText,
  //     packed: false,
  //   };

  //   const newItems = [...items, newItem];
  //   setItems(newItems);
  //   // set new array  of items
  // };

  // const handleDeleteItem = (id) => {
  //   const newItems = items.filter((item) => item.id !== id);
  //   // filter is going to check each item and to compare id of each item with the id we want to remove, filter something from the array, returns filtered array
  //   setItems(newItems);
  // };

  // const handleToggleItem = (id) => {
  //   const newItems = items.map((item) => {
  //     if (item.id === id) {
  //       return { ...item, packed: !item.packed };
  //     }
  //     return item;
  //   });
  //   setItems(newItems);
  // };

  // // set the items so none are left, we are passing an empty array, everything in the previous array will be removed
  // const handleRemoveAllItems = () => {
  //   setItems([]);
  // };

  // const handleResetToInitial = () => {
  //   setItems(initialItems);
  // };

  // const handleMarkAllAsComplete = () => {
  //   const newItems = items.map((item) => {
  //     return { ...item, packed: true };
  //   });

  //   setItems(newItems);
  // };

  // const handleMarkAllAsIncomplete = () => {
  //   const newItems = items.map((item) => {
  //     return { ...item, packed: false };
  //   });

  //   setItems(newItems);
  // };
  /// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----

  /// Local storage
  /// we want to put items to local storage, every time items change we want to update that and accept that in local storage
  /// technically what we could do is for each event handler after setItems() we can add that to Local storage, this will be a lot of duplication
  /// Now in practice what people do is they use useEffect here, useEffect is what you wanna use when you deal with some external system e.g. local storage
  /// local store is managed by browser

  /// useEffect expects two things, we have a function and an array which determines how often we wanna run this function,
  /// every time the items change we wanna go to local storage, you need to store that in JSON format, JSON array in this case

  /// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----
  // useEffect(() => {
  //   localStorage.setItem("items", JSON.stringify(items));
  // }, [items]);
  // // now we can see items in Local storage for url http;//localhost:5173 tab
  /// ----- we want to move that from App.jsx to ItemsContextProvider - Context API usage -----

  //const totalNumberOfItems = items.length;
  //maintain implementation close to array of items

  return (
    <>
      <BackgroundHeading />

      <main>
        <ItemsContextProvider>
          {/* Zustand instead of Context API; this is simply commented out, with Zustand you do not have to wrap with component, different project */}

          {/* <Header totalNumberOfItems={totalNumberOfItems} /> */}
          <Header />
          {/* //removed for ItemsContextProvider
            // numberOfItemsPacked={items.filter((item) => item.packed).length}
            // totalNumberOfItems={items.length} */}
          {/* children pattern to avoid prop drilling in Header component */}
          {/* <Logo />
            <Counter
              numberOfItemsPacked={items.filter((item) => item.packed).length}
              totalNumberOfItems={items.length}
            /> */}

          {/* </Header> */}
          <ItemList
          //removed for ItemsContextProvider
          // items={items}
          // handleDeleteItem={handleDeleteItem}
          // handleToggleItem={handleToggleItem}
          />
          {/* <Sidebar setItems={setItems} /> */}
          <Sidebar
          //removed for ItemsContextProvider
          // handleAddItem={handleAddItem}
          // handleRemoveAllItems={handleRemoveAllItems}
          // handleResetToInitial={handleResetToInitial}
          // handleMarkAllAsComplete={handleMarkAllAsComplete}
          // handleMarkAllAsIncomplete={handleMarkAllAsIncomplete}
          />
          {/* // prop drilling children pattern solution for Sidebar, only for small apps because it bloats up App.jsx */}
          {/* <AddItemForm onAddItem={handleAddItem} />
            <ButtonGroup
              handleRemoveAllItems={handleRemoveAllItems}
              handleResetToInitial={handleResetToInitial}
              handleMarkAllAsComplete={handleMarkAllAsComplete}
              handleMarkAllAsIncomplete={handleMarkAllAsIncomplete}
            />
          </Sidebar> */}
          {/* // prop drilling */}

          {/* Zustand instead of Context API; this is simply commented out, with Zustand you do not have to wrap with component, different project */}
        </ItemsContextProvider>
      </main>
      <Footer />
    </>
  );
}

export default App;
