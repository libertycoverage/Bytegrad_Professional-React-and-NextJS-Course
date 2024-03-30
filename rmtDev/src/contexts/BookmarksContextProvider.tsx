import React, { useState, createContext } from "react";

export const BookmarksContext = createContext(null);

export default function BookmarksContextProvider({ children }) {
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
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
