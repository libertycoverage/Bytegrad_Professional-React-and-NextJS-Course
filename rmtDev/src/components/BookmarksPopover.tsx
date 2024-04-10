import { forwardRef } from "react";
import { useBookmarksContext } from "../contexts/BookmarksContextProvider";
import JobList from "./JobList";

// this is only for syntax demonstration purposes
type BookmarksPopoverProps = {
  isOpen: boolean;
};

// export default function BookmarksPopover() {
// arrow function
// HTMLDivElement is typed Ref here (first type parameter), optionally when we want to pass props also, the second typed is props e.g. BookmarksPopoverProps
// you first type the Ref, but you get as the second argument; props is the second type parameter, but is the first
const BookmarksPopover = forwardRef<HTMLDivElement, BookmarksPopoverProps>(
  // function (props, ref) {
  // function ({ isOpen }, ref) {
  function (_, ref) {
    // if you never gonna use props you can write _ underscore
    const { bookmarkedJobItems, isLoading } = useBookmarksContext();
    // bookmarkedJobItems is an object or an array of objects

    return (
      <div ref={ref} className="bookmarks-popover">
        <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
      </div>
    );
  }
);

export default BookmarksPopover;

// We want also a function that when we open the popover, we can close that popover clicking anywhere, not only on the same button "Bookmarks"

// there could be no JobItems initially (before the search),
// we cannot use already existing jobItems array to pull out actual jobItems for bookmarks popup because it is initially empty,
// we want to see bookmarked jobItems in the popup, this feature is independent from the search and listing jobItems on the left side of the application

// Based on the IDs in the localStorage we are going to fetch the data from the server again

// Why we are storing only the IDs in localStorage and not the entire objects that store jobItems?
// When we click on the offer bookmarked on the popover we want the offer to load from the server in the view of the jobItem (here we have longer version of a jobItem).
// In the list on the left we have a shorter version of a jobItem.
