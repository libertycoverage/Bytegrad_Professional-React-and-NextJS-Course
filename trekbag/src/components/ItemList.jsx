import React from "react";
import Select from "react-select";
import { initialItems } from "../lib/constants";
import { useState } from "react";
import EmptyView from "./EmptyView";
import { useMemo } from "react";
import { useContext } from "react";
import ItemsContextProvider, {
  ItemsContext,
} from "../contexts/ItemsContextProvider";
import { useItemsContext } from "../lib/hooks";

// const item1 = {
//   name: "good mood",
//   packed: true,
// };

// const item2 = {
//   name: "passport",
//   packed: "false",
// };

// const item3 = {
//   name: "phone charger",
//   packed: "false",
// };

// options for Select componenet from "react-select"
const sortingOptions = [
  { label: "Sort by default", value: "default" },
  { label: "Sort by packed", value: "packed" },
  { label: "Sort by unpacked", value: "unpacked" },
];

//removed for ItemsContextProvider
// export default function ItemList({
//   items,
//   handleDeleteItem,
//   handleToggleItem,
// }) {

export default function ItemList() {
  // we have a problem with static variables in ItemList, we cannot change value checked with checkbox in the interface which is rendered upon the static file
  // we want a list that can change, when the list changes we want to rerender the components when the UI is updated, we need to use useState hook

  //const [items, setItems] = useState(initialItems);
  //initialItems here are initial values for the useState hook
  //lifting state up

  // for the Select from react-select, sortBy will store the correct sorting method
  const [sortBy, setSortBy] = useState("default");

  // we are consuming context 3/3, we use custom hook to make imports amount smaller
  const { items, handleDeleteItem, handleToggleItem } = useItemsContext();
  // = useContext(ItemsContext);
  // destructuring to get here only what we need

  // before we map over items map.items we need to sort items
  // what we get here is a new array of sorted items, unfortunatelly sort() will not return an array, we are creating a new array, spreading the elements
  // [...items] we are cloning the items into new array, [...items] this is the array we gonna sort()
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        // sorting the array is potentially also not great for performance, we are coping the array items and making a new array, then we sort that new array
        // two things that can potentially be an issue for performance, the problem is every time component ItemList renders it will do copying, spreading an array
        // and sorting it, every time this component renders, could be unrelated to sorting, could be other reasons for this component ItemList to render,
        // e.g. one of the parent components rerenders adn this component also rerenders, what you can do is useMemo, another hook in React, for calculation
        // and you do not want to make that calculation every time component rerenders
        // useMemo (() => {}, []) accepts the function and dependency array

        //it is better to have strict comparison === than lose comparison ==
        // if (sortBy == "packed") {
        if (sortBy === "packed") {
          return b.packed - a.packed;
          // we want to return either  -1 or 1, positive number or negative number, it will sort differently based on the outcome of positive and negative number
          // here b.packed and a.packed are boolean, how you can even substract this, this will be automatically converted to 1 or -1, so 1 - -1 and that will be 2
          // if that is positive number, "a" will be before "b", if b.packed is true and a.packed is false we are getting a positive result b.packed should be higher than a
          // if it is a positive number b will come first, b will be sorted higher than a
        }
        if (sortBy === "unpacked") {
          return a.packed - b.packed;
          // we want to have unpacked at the top, if a is not packed and b is packed, a.packed will be true and b.packed will be false whish is -1
        }

        //default case
        return;
      }),
    [items, sortBy]
    // (useMemo) here at the end, array with variables, when to run function with useMemo again, if you never rerun this there is a possibility that the values will be outdated
    // this will only run if items or sortBy change and will also run initially, but if there is for some other reason this component is rerendering,
    // which can happen for multiple reasons in practice we will not rerun this function again
  );
  // sort() is quite tricky method, it will go over each element in the array and will compare with the previous one,
  // it takes two elements of the array and compare them

  return (
    <ul className="item-list">
      {/* one way of doing conditional rendering */}
      {/* {items.length === 0 ? <EmptyView /> : null} */}
      {/* conditional rendering, based on condition (when array of elements is empty) showing EmptyView or nothing */}
      {/* with the ternary operator you are safer */}

      {/* second way of doing conditional rendering */}
      {items.length === 0 && <EmptyView />}
      {/* better to be explicit like this and not do short circuiting */}

      {/* if the first is truthy we will get whatever is the second to the && operator,  */}

      {/* this is called short circuiting, if the first is falsy it will not evaluate the second part, it will stop on the first one 
      you have to be careful with short circuiting it can be shorter here 
      e.g. {items.length && <EmptyView />} if the items.length will be zero it will be falsy, it will not evaluate the second part
      and if the items.length > 0 we will get an empty view, if items.length is zero first will be zero, it will be falsy, 
      it will not even go evaluate the second part, it will return the first operand zero, it is a common issue

      this will also work {!!items.length && <EmptyView />} returns false or true for the first operand */}

      {/* implementation for a react select (dropdown menu) */}
      {items.length > 0 ? (
        <section className="sorting">
          <Select
            // sortBy will be updated, if we click on packed it will run this function, and will setSortBy to packed
            onChange={(option) => setSortBy(option.value)}
            defaultValue={sortingOptions[0]}
            options={sortingOptions}
          />
          {/* before we hook into logic of "Sort by packed" and "- unpacked" we are basically going to keep track of the sorting method that the user has picked, 
          and this can change over time, and when it changes we wanna rerender the items, we want to rerender them in a different order, it is a good case for useState */}
        </section>
      ) : null}

      {/* we want to be sure we ar mapping over a sorted items */}
      {/* {items.map((item) => { */}
      {sortedItems.map((item) => {
        return (
          <Item
            key={item.id}
            item={item}
            onDeleteItem={handleDeleteItem}
            onToggleItem={handleToggleItem}
          />
        ); // we pass values to Item component; we are passing handleDeleteItem to individual item
        // we need that key property as well, we may change the order of elements in the list, key should uniquely identify each item,
        // name is not unique, technically it is possible that user will put the exact same name on a different element
      })}

      {/* <Item item={item1} /> */}
      {/* tricky bug with passing item Uncaught TypeError: Cannot read properties of undefined (reading 'name') it is because wea re not passing anything below in these two Item components*/}
      {/* it is trying to access for these two item.name but it will not pass anything there, if you are going to access property os something that is not defined you get an error, */}
      {/* program crashes, it is quite common in javascript, this is one of the biggest bugs you are going to prevent using typescript, typescript will warn multiple ways */}
      {/* <Item item={item2} /> */}
      {/* <Item item={item3} /> */}
      {/* to duplicate row: macos: shift + option + arrow key for creating new lines, windows: shift + alt + arrow key */}
    </ul>
  );
  // <ol> is ordered list, (probably better when you have championship ranking), <ul> unordered list is better for list with changeable order
}

function Item({ item, onDeleteItem, onToggleItem }) {
  return (
    <li className="item">
      {/* <input id="999" type="checkbox" />
      <label htmlFor="999"> good mood </label> */}
      {/* we can also put the input in the label omitting id solution */}
      <label>
        <input
          onChange={() => {
            onToggleItem(item.id);
          }}
          checked={item.packed}
          type="checkbox"
        />
        {item.name}
      </label>

      {/* this () => handleDeleteItem is because we don't want to execute the function immediatelly but with a click */}
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
      {/* emoji cross for x (delete) button */}
    </li>
    // we render ui based on passed values with prop

    // to move row up and down: option/ alt + arrow key

    // {/* <li> list item */}
    // {/* when you have a list like this it is very common to make items <li>good mood</li> their own component  */}
  );
}

// <label>: describes the input,
// we want to click anywhere in the field (click the label) to tick checkbox
// it does not work by default, it does not know which input this label is connected to
// we need to connect label and input, e.g. <input id="999" and  <label for="999"
// we have a red underline for="999", because "for" word is a reserved keyword in javascript (for loop, for of loop e.g.), "for" is changed to "htmlFor"
