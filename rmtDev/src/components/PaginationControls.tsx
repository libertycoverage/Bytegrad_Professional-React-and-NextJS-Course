import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

type PaginationControlsProps = {
  onClick: (direction: "next" | "previous") => void; // function has one parameter, either, and function does not return anything
};

export default function PaginationControls({
  currentPage,
  nextPage,
  previousPage,
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
      {/* <PaginationButton direction="previous" previousPage={previousPage} /> */}
      {/* <PaginationButton
        direction="previous"
        previousPage={previousPage}
        onClick={() => onClick("previous")}
      /> */}
      {/* <PaginationButton direction="next" nextPage={nextPage} /> */}
      <PaginationButton
        direction="next"
        nextPage={nextPage}
        onClick={() => onClick("next")}
      />
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
  direction: "next" | "previous";
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
      onClick={onClick}
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
