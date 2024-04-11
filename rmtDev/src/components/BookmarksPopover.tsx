import { forwardRef } from "react";
import { useBookmarksContext } from "../contexts/BookmarksContextProvider";
import JobList from "./JobList";
import { createPortal } from "react-dom";

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

    // return (
    //   <div ref={ref} className="bookmarks-popover">
    //     <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
    //   </div>
    // );

    // V179
    // Another thing that people commonly do when they work with popovers and modals is to solve an issue
    //
    // We have popover button with className bookmarks-btn an when we click on that,
    // in HTML in the section in the header comes up the popover with div with className bookmarks-popover, div is sitting in the header
    //
    // (in developer tools in the browser we click on ```<header>``` in HTML, then in Styles we edit element.style{z-index: -1} )
    // What happens when header has lower z-index (CSS) than another element on the site - container,
    // now the popover is below another object (container) and does not display properly
    // child elements of this header are also affected by the z-index,
    // because the bookmarks div is in the header and the header has a lower z-index, container will be displayed above bookmarks
    // (z-index describes level of CSS-displayed HTML elements in Z axis (XYZ) - something is displayed on level above or below another element)
    //
    // we would like to take a div connected to the popover and put that somewhere else in the DOM, so it won't be affected by other elements
    //
    // React will give us creation of a portal, we will port bookmarks-popover div over to another part of a DOM, where it will not be affected by all of parent elements
    // We wrap div with createPortal(first argument, second argument)
    // first argument - THIS IS WHAT WE WANTO TO HAVE IN THE DOM SOMEWHERE
    // second argument - WHERE WE WANT TO PUT THAT IN THE DOM,
    //
    // second argument (document.body) - we make that child element of the body element, so it won't be affected by any other elements that are in between in the DOM
    // now when we edit (in developer tools in the browser we click on ```<header>``` in HTML, then in Styles we edit element.style{z-index: -1} ), the popover is still on top
    return createPortal(
      <div ref={ref} className="bookmarks-popover">
        <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
      </div>,
      document.body
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
