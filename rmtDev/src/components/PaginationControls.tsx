import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { PageDirection } from "../lib/types";

type PaginationControlsProps = {
  currentPage: number;
  totalNumberOfPages: number;
  nextPage: number;
  previousPage: number;
  // onClick: (direction: "next" | "previous") => void; // function has one parameter, either, and function does not return anything
  // replaced with a separate type for "next" | "previous"
  onClick: (direction: PageDirection) => void;
};

export default function PaginationControls({
  currentPage,
  nextPage,
  previousPage,
  totalNumberOfPages,
  onClick,
}: PaginationControlsProps) {
  // export default function PaginationControls({ onChangePage }) {
  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PaginationButton
          direction="previous"
          previousPage={previousPage}
          onClick={() => onClick("previous")}
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          direction="next"
          nextPage={nextPage}
          onClick={() => onClick("next")}
        />
      )}
      {/* <PaginationButton direction="previous" previousPage={previousPage} /> */}
      {/* <PaginationButton
        direction="previous"
        previousPage={previousPage}
        onClick={() => onClick("previous")}
      /> */}
      {/* <PaginationButton direction="next" nextPage={nextPage} /> */}

      {/* migrated for totalNumberOfPages */}
      {/* <PaginationButton
        direction="next"
        nextPage={nextPage}
        onClick={() => onClick("next")}
      /> */}
      {/* migrated for totalNumberOfPages */}

      {/* <button onClick={onClick('previous')} // if you would call this like this you will call it whenever this component is rendering, so you want an arrow function to wait */}
      {/* <button
        onClick={() => onClick("previous")}
        className="pagination__button"
      >
        <ArrowLeftIcon />
        Page {previousPage} */}
      {/* Page {currentPage - 1} */}
      {/* </button>
      <button onClick={() => onClick("next")} className="pagination__button">
        Page {nextPage} */}
      {/* Page {currentPage + 1} */}
      {/* <ArrowRightIcon />
      </button> */}
    </section>
  );
}

type PaginationButtonProps = {
  // direction: "next" | "previous"; // moved to separate type for reusability
  direction: PageDirection;
  // currentPage: number;
  previousPage: number;
  nextPage: number;
  onClick: () => void; // function does not have input and does not return anything
};

function PaginationButton({
  direction,
  nextPage,
  previousPage,
  onClick,
}: PaginationButtonProps) {
  return (
    // <button onClick={onClick} className="pagination__button">
    <button
      onClick={(e) => {
        onClick();
        e.currentTarget.blur(); // blurring is the opposite of focus for button,
        //we want to defocus button of pagination after click, so the button do not appear constantly clicked (dark)
        // e.target.blur() would be the actual element that you click, if you happen to click on the icon (arrow here), that is e.target
        // we do not wanna blur the icon, we want to blur this button, we want to blur the actual element that has this event handler (e) running on that click event
        // remember a click event in a DOM it starts at the element you actually click, so if you click it on the icon,
        // the icon here <ArrowLeftIcon /> is a child element here, the event target will be this icon,
        // then in the DOM the event stay bubble up it will go from React Fragment one level up which is a button> element here,
        // and here we have attached event handle (e) - onClick with the click event, this event handler will run,
        // after this one it will continue bubbling up through out the DOM
        // whenever the element has some onClick event handler ti will also run
        // here if you run that -> onClick={(e) => { onClick(); and you actually want to target the element that is currently running that event handler
        // you have to use currentTarget
        // we do not have the focus anymore, but if we do tabbing here, also for accessibility, it is still in the focus state, that is what we want
        // now when we click we do not have annoying lingering focus state
      }}
      className={`pagination__button pagination__button--${direction}`}
    >
      {/* this is interpolation -> ${} ; additional styling to display single button Page 2 on the right side, not on the left (without that additional class)  */}
      {/* {direction === "previous" ? (
        <>
          <ArrowLeftIcon />
          Page {previousPage}
        </>
      ) : (
        <>
          Page {nextPage}
          <ArrowRightIcon />
        </>
      )} */}
      {direction === "previous" && (
        <>
          <ArrowLeftIcon />
          Page {previousPage}
        </>
      )}
      {direction === "next" && (
        <>
          Page {nextPage}
          <ArrowRightIcon />
        </>
      )}
      {/* // this will not work, without React Fragments, conditional rendering, we are trying to return two things actually, you always need to return one thing */}
      {/* ternary operator with question mark ? and colon : , if direction === "previous"  is truthy then the first, else second after colon */}
      {/* another way of doing that is using logical AND operator && */}
    </button>
  );
}

// To implement pagination we need to track the current page we are on, initially we are on Page 1,
// we could put the state in PaginationControls() component but we will need to know about the page up higher in hierarchy
// in App.tsx as well, based on the current page we are going to slice off the necessary part (7 in the list),
// when we are on Page 2 we are going to slice a different part of the list 8 + 7 (14), etc.

/// DESCRIPTION Client-Side Pagination Vs Server-Side Pagination
/// We have implemented client-side pagination,
/// we fetch all of the data, we store all of that in the browser, then we paginate through it,
/// we can do client-side pagination, when a number of results is still quite limited for performance reasons,
/// what if we have thousands, millions of results, we want to reduce number of stored number of objects in memory

/// Server-side pagination is when we do not get all of the data we make a network request for a limited list
/// e.g. 7, server will get back 7, then we make a request for a next 7 and server responds adequately,
/// each time we make a network request for a limited number from the range of a total number search results
