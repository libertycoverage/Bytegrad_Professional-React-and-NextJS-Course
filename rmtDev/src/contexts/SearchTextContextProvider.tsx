import React, { useState, createContext, useEffect, useContext } from "react";
import { useDebounce } from "../lib/hooks";

// type SearchTextContext = {
type SearchTextContext<T> = {
  //activeJobItemId: number | null; // when we hover (intellisense) on activeJobItemId: number | null // maybe that is not necessary here

  // there is a relationship between searchText and debouncedSearchText, we can use Type Parameter <T>, we make that generic Type
  //searchText: string;
  //debouncedSearchText: string;
  searchText: T;
  debouncedSearchText: T;
  handleChangeSearchText: (newSearchText: string) => void;
};

export const SearchTextContext = createContext<SearchTextContext | null>(null);

export default function SearchTextContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // We are calling useDebounce hook once, then when we want to use it in app, we use this context,
  // Context API will make sure we can transport around values in multiple places

  // You want to put things that are related to each other in the same Context Provider component
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 250);

  const handleChangeSearchText = (newSearchText: string) => {
    // suggestion from Github Copilot, temporary removed// setCurrentPage(1);
    setSearchText(newSearchText);
  };

  return (
    <SearchTextContext.Provider
      value={{
        // activeJobItemId,
        // consumer of the Context can access any of these
        searchText,
        debouncedSearchText,
        handleChangeSearchText,
      }}
    >
      {children}
    </SearchTextContext.Provider>
  );
}

// this can (should) be moved to hooks.ts but for organizational, convenience purposes it is not
/// GREEN UNDERLINE INTELLISENSE on useSearchTextContext -> Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.
export function useSearchTextContext() {
  const context = useContext(SearchTextContext);
  if (!context) {
    throw new Error(
      "useSearchTextContext -> useContext(SearchTextContext) must be within a SearchTextContextProvider"
    );
  }
  return context;
}
