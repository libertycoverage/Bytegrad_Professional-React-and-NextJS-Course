import { BookmarkFilledIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";

type BookmarkIconProps = {
  id: number;
};
// we make id as required by TypeScript, in JobItemContent.tsx

export default function BookmarkIcon({ id }: BookmarkIconProps) {
  //const context = useContext(BookmarksContext);
  //console.log(context);
  const { bookmarkedIds, handleToggleBookmark } = useContext(BookmarksContext); // we can destructure immediately from the object

  return (
    <button onClick={() => handleToggleBookmark(id)} className="bookmark-btn">
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
