import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import {
  BookmarksContext,
  useBookmarksContext,
} from "../contexts/BookmarksContextProvider";

type BookmarkIconProps = {
  id: number;
};
// we make id as required by TypeScript, in JobItemContent.tsx

export default function BookmarkIcon({ id }: BookmarkIconProps) {
  //const context = useContext(BookmarksContext);
  //console.log(context);

  // **** EXPORTED TO CUSTOM HOOK
  // const context = useContext(BookmarksContext);
  // if (!context) {
  //   throw new Error(
  //     "useContext(BookmarksContext) must be used within a BookmarksContextProvider"
  //   );
  // }
  //*****^^

  // const { bookmarkedIds, handleToggleBookmark } = useContext(BookmarksContext); // we can destructure immediately from the object
  // red underline for bookmarkedIds, handleToggleBookmark, we cannot destructure from something that could be null
  // ^^ we cannot destructure from something that could be null, to prevent that we need to check if used context could be null and throw an error in that case ^^
  // const { bookmarkedIds, handleToggleBookmark } = context;

  // **** CUSTOM HOOK
  const { bookmarkedIds, handleToggleBookmark } = useBookmarksContext(); // here is value={} -> useBookmarksContext -> we can destructure from that

  // ****
  // BookmarksContextProvider.tsx -> return ( <BookmarksContext.Provider value={{ bookmarkedIds, handleToggleBookmark }}> <- value is prop, value can be typed, red underline -> value is inferred as null
  // value is inferred on what you pass here -> export const BookmarksContext = createContext(null);
  // intellisense -> const BookmarksContext: React.Context<null>
  // -> createContext(null) <- this is just a default value, this is what will be used if you try to consume the context outside BookmarksContextProvider ->
  // <Test />  <BookmarksContextProvider> </BookmarksContextProvider> // if you try to use the context off the Bookmarks here you would get a null value, of course it needs to be in the App component as a default main component constructing the App
  // we should type Context value -> createContext(null);
  // it can be used outside the context provider, so it can be null
  // BookmarksContextProvider.tsx -> type BookmarksContext = { bookmarkedIds: number[]; handleToggleBookmark: (id: number) => void; }; // takes id of type number, does something and does not return anything
  // BookmarksContextProvider.tsx -> export const BookmarksContext = createContext<BookmarksContext | null>(null); // it can be used outside the context provider, so it can be null
  // we use that context here -> const { bookmarkedIds, handleToggleBookmark } = useContext(BookmarksContext); // red underline for bookmarkedIds, handleToggleBookmark,
  // *****^^ we cannot destructure from something that could be null, to prevent that we need to check if used context could be null and throw an error in that case
  // value here is an object -> BookmarksContextProvider.tsx -> <BookmarksContext.Provider value={{ bookmarkedIds, handleToggleBookmark }}>
  // when you use the const context it is gonna be an object
  // ----
  // Whenever you use any kind of context, we have to check if it is null, if it is true we have to throw an error, and only then we can destructure it,
  // And also whenever we use useContext() hook we need to specify which context we are gonna use e.g. useContext(BookmarksContext);
  // this is not great, we are going to make a custom hook implementation useBookmarksContext in BookmarksContextProvider.tsx

  return (
    <button
      onClick={(e) => {
        handleToggleBookmark(id);
        e.stopPropagation(); /// First issue V166 /// this will prevent the click event to bubble upwards
        e.preventDefault();
        /// Second issue V166, if you click on the icon in the list on the left, offer in the list is gonna fetch with a loading spinner even after implementation of this here -> e.stopPropagation();

        /// e.g. for a div with onClick e.stopPropagation(); is the only thing you need to prevent that bubbling upwards -> example if it would be like that, changed JobListItem.tsx ->
        /// <div onClick={} href={`#${jobItem.id}`} className="job-item__link"></div>
        /// but in this project we do not have that
        /// however with the anchor tag there is some default behavior, if there is a click inside the anchor tag that you navigate we also want e.preventDefault a swell

        /// First issue V166 /// when there is a click event on this one, we do not wanna have it bubbling upwards
        /// Issue if you click on multiple bookmarks in the list it loads (with the spinner animation) the offer (item) as it was clicked, we want to only click bookmark icon, not the whole offer.
        /// This often happen when you have a component over the other one,
        /// Here bookmark icon sits over the offer in the list (in JobListItem component we have BookmarkIcon component).
        /// What happens is if there is a click event in the DOM, you click on the button there is a onClick event, it is going to run any handlers that are attached to that event
        /// In the DOM it does not stop there, it will bubble upwards
        /// there was a click event here -> JobListItem.tsx -> <BookmarkIcon id={jobItem.id} />
        /// it will go up here -> JobListItem.tsx -> <a href={`#${jobItem.id}`} className="job-item__link">
        /// here we have an anchor tag there is gonna be a click event and in the anchor tag it going to navigate, this is similar as if we have something like this,
        /// it works similar like if we have a div instead of anchor tag -> <a onClick={} href={`#${jobItem.id}`} className="job-item__link">

        /// ^^ These are two common things you wanna do if it looks like other elements are affected by that event ^^
      }}
      className="bookmark-btn"
    >
      {/* arrow function is needed -> onClick={() => handleToggleBookmark(id)} so it won't run every time this component renders */}
      {/* we need to pass the id as a prop to the component to use this handleToggleBookmark function */}
      <BookmarkFilledIcon
        className={`${bookmarkedIds.includes(id) ? "filled" : ""}`}
      />
      {/* we want to add className "filled" when it is bookmarked, this will work for all the instances of BookmarkIcon */}
    </button>
  );
}

// We want to toggle bookmarks in the list and in the bookmarks list in the app (two places).

// We are going to track bookmarks not by the objects but with the IDs
// You wanna additional data you gonna need to fetch that

// To avoid prop drilling (bookmarks can be used all over the app) we use React Context API
