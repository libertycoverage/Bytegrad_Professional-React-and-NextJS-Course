import React, { useState, createContext, useEffect } from "react";

export const BookmarksContext = createContext(null);

export default function BookmarksContextProvider({ children }) {
  // if you put read from localStorage in BookmarksContextProvider component,
  // it means it is gonna run this every time we render and re-render this component,
  // rendering essentially means it gonna run all the lines within function body in curly braces
  // running this every time it re-renders is not good for performance, ideally we do this once
  // technically we could use useEffect for that as well, and you would have empty array at the end so it will run once,
  // ** or what you could do with useState, you can provide a function as the initial value to useState,
  // ** and this will only run once as the component first mounts
  // const bookmarkedIdsFromLocalStorage = JSON.parse(
  //   localStorage.getItem("bookmarkedIds") || "[]"
  // ); // convert from JSON to Javascript // OR null, user at the beginning has no bookmarks

  // const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  // const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
  //   bookmarkedIdsFromLocalStorage
  // ); // data from localStorage as initial state

  // ** or what you could do with useState, you can provide a function as the initial value to useState,
  // ** and this will only run once as the component first mounts

  // const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(
  //   () => bookmarkedIdsFromLocalStorage
  // );
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() =>
    JSON.parse(localStorage.getItem("bookmarkedIds") || "[]")
  );

  console.log(bookmarkedIds);

  const handleToggleBookmark = (id: number) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds((prev) => prev.filter((item) => item !== id));
      // here substract id from the array
      // we take a previous array, then return a new array with only the items that are not the id you passed in , with filter we create a new array
      // practically it will filter out the one id we passed in
    } else {
      setBookmarkedIds((prev) => [...prev, id]);
      // here add id to the array of ids
    }
  };

  // We want bookmarks to be persisted in localStorage of the browser, we need to add bookmarkedIds to localStorage
  // Browser > DevTools > Application > Storage
  // we use useEffect to put in localStorage, whenever this bookmarkedIds changes, we add something or remove that, we also add that to localStorage
  // in localStorage this needs to be JSON format, we need to convert Javascript array to JSON format
  useEffect(() => {
    localStorage.setItem("bookmarkedIds", JSON.stringify(bookmarkedIds)); // ("bookmarkedIds" - this is a key, in what name you wanna store that
  }, [bookmarkedIds]); // useEffect accepts two things, function, and array that determines how often function should run; how often, whenever bookmarks change

  // with value we specify what we transport around, typically it is a javascript object,
  //return (<BookmarksContext.Provider value={{bookmarkedIds: bookmarkedIds, handleToggleBookmark: handleToggleBookmark}}>{children}</BookmarksContext.Provider>);
  // if you have the same key as the value you can use single name only
  return (
    <BookmarksContext.Provider value={{ bookmarkedIds, handleToggleBookmark }}>
      {children}
    </BookmarksContext.Provider>
  );
}

// App.tsx is a child here, belongs to children prop

// We create a context, wrap our app (or part of the app) with provider component, with value we specify what we transport around, typically it is a javascript object,
// last thing is to use that context in the component where you need it

// We want to pass handleToggleBookmark to BookmarkIcon.tsx

// React Context API is really handy for transporting around values without prop drilling
