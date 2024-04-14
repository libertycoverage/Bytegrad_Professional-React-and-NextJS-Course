import { useJobItemsContext } from "../contexts/JobItemsContextProvider";
import { SortBy } from "../lib/types";

// type SortingControlsProps = {
//   sortBy: SortBy;
//   onClick: (newSortBy: SortBy) => void; // function is not returning anything, even undefined (return; at the end of a function)
// };
//
// export default function SortingControls({
//   sortBy,
//   onClick,
// }: SortingControlsProps) {
// REPLACED DUE TO JobItemsContextProvider
export default function SortingControls() {
  const { sortBy, handleChangeSortBy: onClick } = useJobItemsContext();

  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>
      {/* <button
        onClick={() => onClick("relevant")} // it will set setSortBy to "relevant"
        // className="sorting__button sorting__button--relevant"
        className={`sorting__button sorting__button--relevant ${
          sortBy === "relevant" ? "sorting__button--active" : ""
        }`}
      >
        Relevant
      </button> */}
      {/* <button
        onClick={() => onClick("recent")} // it will set setSortBy to "recent"
        // className="sorting__button sorting__button--recent"
        className={`sorting__button sorting__button--recent ${
          sortBy === "recent" ? "sorting__button--active" : ""
        }`}
      >
        Recent
      </button> */}

      {/* THESE TWO BUTTONS HAVE BEEN REPLACED BY a SortingButton component, using children pattern */}
      <SortingButton
        onClick={() => onClick("relevant")}
        isActive={sortBy === "relevant"}
      >
        Relevant
      </SortingButton>
      <SortingButton
        onClick={() => onClick("recent")}
        isActive={sortBy === "recent"}
      >
        Recent
      </SortingButton>
    </section>
  );
}

// We could technically put state in SortingControls.tsx but we will need the state in App.tsx,
// based on the active sorting method we need to pass the jobItems to the JobList component,
// we need sorting method in App.tsx

// when we click on the button we want to update the state, we need an action or event handler

type SortingButtonProps = {
  children: React.ReactNode;
  onClick: () => void; // function that takes nothing, does something, does not return anything
  isActive: boolean;
};

function SortingButton({ children, onClick, isActive }: SortingButtonProps) {
  return (
    <button
      onClick={onClick} // it will set setSortBy to "recent"
      // className="sorting__button sorting__button--recent"
      className={`sorting__button sorting__button--recent ${
        isActive ? "sorting__button--active" : ""
      }`}
    >
      {children}
    </button>
  );
}
