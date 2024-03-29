export default function SortingControls({ sortBy, onClick }) {
  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>

      <button
        onClick={() => onClick("relevant")} // it will set setSortBy to "relevant"
        // className="sorting__button sorting__button--relevant"
        className={`sorting__button sorting__button--relevant ${
          sortBy === "relevant" ? "sorting__button--active" : ""
        }`}
      >
        Relevant
      </button>

      <button
        onClick={() => onClick("recent")} // it will set setSortBy to "recent"
        // className="sorting__button sorting__button--recent"
        className={`sorting__button sorting__button--recent ${
          sortBy === "recent" ? "sorting__button--active" : ""
        }`}
      >
        Recent
      </button>
    </section>
  );
}

// We could technically put state in SortingControls.tsx but we will need the state in App.tsx,
// based on the active sorting method we need to pass the jobItems to the JobList component,
// we need sorting method in App.tsx

// when we click on the button we want to update the state, we need an action or event handler
