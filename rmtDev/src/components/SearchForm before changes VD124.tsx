import { useEffect, useState } from "react";

export default function SearchForm() {
  // useState initially is an empty string
  const [searchText, setSearchText] = useState("");

  // it does not have sense that we are having a jobItems in a component SearchForm
  // we are not using jobItems in this form (in the SearchForm in the Header component), we want to have jobItems in the Container component in the sidebar on the left
  // SearchForm is int the Header component, we are lifting the state up the component tree to the App.tsx
  const [jobItems, setJobItems] = useState([]);
  // setter function for setJobItems can still be used in the SearchForm
  // the issue here is that setJobItems is closely related to searchText, it actually makes sense
  // to colocate up the component tree to App.tsx so the logic is not scattered through multiple components,
  // it will simplify the transition to React-Query later

  // we get two empty arrays in the beginning, in React strict mode component is mounted once, unmounted and then mounted the second time
  console.log(jobItems);

  // on every onChange of input we want a query, here query parameters
  // on base URL we get NOT FOUND, as expected https://bytegrad.com/course-assets/projects/rmtdev/api/data
  // we want to specify the query parameters (also called search parameters, or search query parameters )
  // to get results, browser will make a GET request, we may specify more filters for the data we have
  // https://bytegrad.com/course-assets/projects/rmtdev/api/data?search=react&sortby=recent&limit=10
  // this is one way of specifying a sep resource, being a more specific about the data you want
  // another way is a path parameter https://bytegrad.com/course-assets/projects/rmtdev/api/data/react
  // in this example server is not specified this way, it is using the first format with query parameters
  // https://bytegrad.com/course-assets/projects/rmtdev/api/data?search=react this is what we will pass

  // whatever we put here (in this place) in this document will automatically rerender
  // if we put a fetch() here   it will run every time the component renders
  // no, we want fetch() every time we search the form
  // we also do not want to use useEffect with fetch() function inside to fetch the data every time the component mounts
  // (typically we use useEffect() when we deal with some external system),
  // array in useEffect will determine how often the function is gonna run
  // we want to fetch() when the user searches with a text form

  // this is one way of implementing that, to make a fetch call to get the data
  // we want an early return when we do not have a searchText
  // using useEffect to fetch the data is actually how you would do this most of the time,
  // typically when you first load the app that is when you want the data, typically when the component first mounts
  // you wanna get the data

  // in our case however whe want to get the data when user performs some action (searches with search bar form)
  // we want to run that in response to an event, React recommends not to use useEffect in that case
  // but to use the event handler function onChange and to use fetch() there

  // however in this project we will use later React-Query for data fetching, which won't work with event handler option onChange={}
  // so better to use useEffect (first option)

  // we cannot use async useEffect(async () => { in the function because you cannot use that on useEffect function like this,
  // we need to create a separate function inside const fetchData = async () => {}
  useEffect(() => {
    if (!searchText) return; // you can do this in one line or use {return;} curly brackets

    const fetchData = async () => {
      // in front of a promise fetch() we want to use await,
      // because if we do not do that, when you run a function all of the statements will just run
      // here because fetch() is asynchronous it will not wait for the fetch call to basically complete
      // it will immediately continue to the const data = response.json();
      // before we get to const data = response.json(); we want to wait for the promise to resolve
      // because const data = response.json(); will also give us a promise we also want to await here
      const response = await fetch(
        `https://bytegrad.com/course-assets/projects/rmtdev/api/data?search=${searchText}` //back ticks - temp literals
        // for this example project server is written this way so that when we type a character it will return
        // a random number of object in the jobItems array it returns e.g. 45, 50 even if we type the same character
      );
      const data = await response.json();
      console.log(data.jobItems);
      // when we get the data we want to use that in state -> jobItems in useState, an empty initial array []
      setJobItems(data.jobItems);
    };
    // we invoke function in there
    fetchData();
  }, [searchText]);
  // it will run every time searchText changes
  // now with developer tools in the browser in the network tab you will see the requests

  // fetch will actually get us a promise, we want to obtain streamed data

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
          setSearchText(e.target.value);
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
