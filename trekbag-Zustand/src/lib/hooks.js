import { useContext } from "react";
import { ItemsContext } from "../contexts/ItemsContextProvider";

export function useItemsContext() {
  const context = useContext(ItemsContext);

  if (!context) {
    throw new Error(
      "useItemsContext must be used within a ItemsContextProvider"
    );
  }

  return context;
}

/// this is custom hook

// creating custom hook for making less imports is somewhat weakly explainable
// there is another reason
// typically what you also wanna do when you use context you wanna make sure that you have wrapped a component tree
// with provided component e.g. <ItemsContextProvider> </ItemsContextProvider> in App.jsx
// typically when you use the context you wanna check for that
// if we would have to check for that every place where we use the context it also would be quite annoying
// good practice is to centralize that as well
