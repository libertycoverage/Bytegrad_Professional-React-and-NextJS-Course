import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

type PaginationControlsProps = {
  click: (direction: "next" | "previous") => void; // function has one parameter, either, and function does not return anything
};

export default function PaginationControls({
  // currentPage
  nextPage,
  previousPage,
  onClick,
}: PaginationControlsProps) {
  // export default function PaginationControls({ onChangePage }) {
  return (
    <section className="pagination">
      {/* <button onClick={onClick('previous')} // if you would call this like this you will call it whenever this component is rendering, so you want an arrow function to wait */}
      <button
        onClick={() => onClick("previous")}
        className="pagination__button"
      >
        <ArrowLeftIcon />
        Page {previousPage}
        {/* Page {currentPage - 1} */}
      </button>
      <button onClick={() => onClick("next")} className="pagination__button">
        Page {nextPage}
        {/* Page {currentPage + 1} */}
        <ArrowRightIcon />
      </button>
    </section>
  );
}

// To implement pagination we need to track the current page we are on, initially we are on Page 1,
// we could put the state in PaginationControls() component but we will need to know about the page up higher in hierarchy
// in App.tsx as well, based on the current page we are going to slice off the necessary part (7 in the list),
// when we are on Page 2 we are going to slice a different part of the list 8 + 7 (14), etc.
