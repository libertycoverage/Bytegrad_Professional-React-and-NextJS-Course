import React, { useState, createContext, useEffect, useContext } from "react";
import { useActiveJobItemId } from "../lib/hooks";

type ActiveIdContext = {
  activeJobItemId: number | null; // when we hover (intellisense) on activeJobItemId: number | null
};

export const ActiveIdContext = createContext<ActiveIdContext | null>(null);

export default function ActiveIdContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // We are calling hook once, then when we want to use it in app, we use this context,
  // Context API will make sure we can transport around, access useActiveJobItemId() in multiple places
  const activeJobItemId = useActiveJobItemId();

  return (
    <ActiveIdContext.Provider
      value={{
        activeJobItemId,
      }}
    >
      {children}
    </ActiveIdContext.Provider>
  );
}

// this can (should) be moved to hooks.ts but for organizational, convenience purposes it is not
/// GREEN UNDERLINE INTELLISENSE on useActiveIdContext -> Fast refresh only works when a file only exports components. Use a new file to share constants or functions between components.
export function useActiveIdContext() {
  const context = useContext(ActiveIdContext);
  if (!context) {
    throw new Error(
      "useActiveIdContext -> useContext(ActiveIdContext) must be within a ActiveIdContextProvider"
    );
  }
  return context;
}

// hooks.tsx -> useActiveJobItemId()
// useActiveJobItemId() uses useState, active id is what we have in URL,
// Hook will look into URL, it is gonna take a hash from the URL and it is gonna be id, it is gonna set that as active id if there is one.
// Then we are attaching event listener to the window object
//
// Problem with React hooks is wherever you use this hook, you are going to instantiate all of this (internal of hook) again.
// If you use this hook useActiveJobItemId() in 10 different places you are going to get 10 different useStates
// and it also means you get 10 different useEffect calls, you gonna have 10 event listeners (attach 10 times).
// With React hook it is really important to understand whenever you use it, when it it used by some component,
// when it gets called it is gonna create new useState and it is going to run this useEffect and attach event listener to window object,
// when it used by another component it creates these (useState, useEffect, event listener) again.
//
// When you use the hook it is going to run code in there in isolation from the other instances where you use that hook.
//
// Is it bad we have different useStates, not really, is it so bad we are going to attach the event listener multiple times to the window object?
// Also not the end of the world, but technically if you add a lot of event listeners it could become a performance problem, it is not god habit to get into.
//
// If you do not want to have that issue of instantiating it every time we use it, you want to run this once but still use it in multiple components,
// we can use Context API. Context Provider component can be the one component that we use this hook (useActiveJobItemId()),
// and then we need to use it in other components, we can easily transport it around with Context API
// (Context API is for easy transport around certain values without prop drilling)
//
// These components (JobList.tsx, JobItemContent.tsx) are getting this active job item ID value from the context,
// in context useActiveJobItemId() hook is run once, it is only gonna run this hook for Context Provider component,
// it is only going to attach once this event listener on "hashchange".
///It is only gonna create instance of this useState once -> const [activeJobItemId, setActiveJobItemId] = useState<number | null>(null);
// and then we make this available for the context value (activeJobItemId) so we can still use it on the places in our app, we can transport it around with Context API
//
// When you want to use Context API you have to provide it first,
// you need to specify what part of the app gets access to the ActiveJobItemId,
// we will wrap the entire app with the context (main.tsx)
// <BookmarksContextProvider> <ActiveIdContextProvider> <App /> </ActiveIdContextProvider> </BookmarksContextProvider>
// We provided the App with the value, so we are able to consume the value
// It works the same as using hook, but should be a little bit better for performance,
// we are not going to attach event listeners to the window object whenever we use it in some component
