import { useEffect, useState } from "react";
import { useSearchTextContext } from "../contexts/SearchTextContextProvider";

// type SearchFormProps = {
//   searchText: string;
//   setSearchText: (searchText: string) => void;
// we can use that type on setSearchText React.Dispatch<React.SetStateAction<string>>
// or we know it is a function returning nothing and takes a string as an argument
// };
//
// export default function SearchForm({
//   searchText,
//   setSearchText,
// }: SearchFormProps) {
// with the prop it could be more semantic if the name setSearchText was replaced here by onSearchTextChange

// useState searchText, jobItems and useEffect with fetch moved up the component tree to App.tsx

// Instead of using props we can use useSearchTextContext();
export default function SearchForm() {
  const { searchText, handleChangeSearchText } = useSearchTextContext();

  return (
    // when you press enter on the form there is some strange behavior of reloading after submission the form,
    // that is the default behavior of a browser,
    // by default browser will try to submit the form to whatever you specify in the action="" attribute
    // we can hook into submission by onSubmit attribute, we want to prevent the default behavior,
    // now when you press the enter with some text in the search bar form, nothing happens (as expected)
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      action="#"
      className="search"
    >
      <button type="submit">
        <i className="fa-solid fa-magnifying-glass"></i>
      </button>

      {/* we want a dynamic search as we input, we want to write something, and with every new text a new search occurs
      as you type there are change, we hook into that by onChange attribute, when you add a character, there is a change event ,
      input itself is managing that state, it is uncontrolled input
      let's make a controlled input*/}
      <input
        value={searchText}
        onChange={(e) => {
          // console.log(e.target.value);
          //setSearchText(e.target.value);  // because we use Context with changed name
          handleChangeSearchText(e.target.value);
          //onSearchTextChange(e.target.value); it could be more adequate naming but it will stay with the name of a row setter for now

          // we can use fetch here instead of useEffect as above (second option after useEffect())
          // in this project we will use later React-Query for data fetching, which won't work with event handler option
          // so better to use useEffect
          // fetch();
        }}
        spellCheck="false"
        type="text"
        required
        placeholder="Find remote developer jobs..."
      />
    </form>
  );
}
