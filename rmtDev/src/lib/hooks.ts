import { useEffect, useState } from "react";
import { JobItemExpanded, jobItem } from "./types";
import { BASE_API_URL } from "./constants";
import { useQueries, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { handleError } from "./utils";

// custom hooks are basically utility functions

// we migrate to custom hook for ActiveJobItemId
export function useActiveJobItemId() {
  const [activeJobItemId, setActiveJobItemId] = useState<number | null>(null);
  // ** red underline in id (setActiveJobItemId(id);) argument of type string is not assignable to parameter of type SetStateAction<null>
  // TypeScript will infer what type is gonna be from the initial value that you pass in,
  // It will infer the type to be a null, it is only initially going to be null but then later we may set it using useEffect,
  // an id is expected to be a number, we need to use <number | null> initially

  // PART TWO/TWO
  // the second part is reading from the URL
  // when we load an app we wanna check if there is id in the URL
  // we can do that when the app renders in App.tsx we can use window object
  // browser will give us the window object and it will give us the information about the URL as well in the location,
  // in the location since we are using the hash as well it will give us the hash
  // hash is only preventing a weird refresh, and is also makes is easier to work with whatever comes after hash

  // console.log(window.location.hash) gives us #9967898989857690 , then we slice from index 1 (we wan to remove hashtag sign in console.log)
  // Now whenever we click on a listed offer (another one) we want another id,
  // also with the refresh with base URL http://localhost:5173/ when we click on offer it does not log id, it only changes the URL
  // How to make it work when the id in URL changes how we can pick up on that,
  // there is actually an event happening, when hash in the URL changes there is also an event,
  // and we can hook into that event
  // URL is managed here by the browser, not by us, if you communicate with external system you may consider useEffect() hook
  // we will subscribe (listen to) that event, we want attach that event listener once, when the component first mounts,
  // we have an empty array as dependency array

  // Now on clean base URL http://localhost:5173/  (without hash in URL) when we click we get an id in console log

  useEffect(() => {
    const handleHashChange = () => {
      console.log(window.location.hash.slice(1));
      // we want to assign that to the variable, we want to assign this to state after all
      // we want to keep track of the active id, , we just got it from the window object, and that can change over time,
      // we probably wanna rerender when that changes, so if we assign that to state and it changes,
      // then it would change the state and it will cause the rerender,
      // we need to rerender because the component assigned to display the information of the offer will change over time,
      // if we change of id in URL it should rerender
      const id = +window.location.hash.slice(1);
      setActiveJobItemId(id); // when that changes it will cause a rerender
      // ** red underline in id argument of type string is not assignable to parameter of type SetStateAction<null>
      // everything from the URL is a string, we want it to be a number, we want to convert it to a number using unary operator +
    };

    handleHashChange();

    // event we wanna listen to, there is a window object, we can add event listener, there is hashchange event, every time hash changes we wanna run the function,
    // we run the function every time an event occurs
    // window.addEventListener("hashchange", () => { console.log(window.location.hash.slice(1));  }); // when the app first mounts we check this

    window.addEventListener("hashchange", handleHashChange);

    // Before we continue, what you typically wanna do with these event listeners is when you unmount the component, you also wanna remove the event listener,
    // now we are in the App component so we are not going to unmount this within the App, maybe we are gonna refactor this in a custom hook,
    // and you may also use this hook somewhere else as well, then you want to remove the event listener, the best practice is to clean up after yourself
    // there is a clean up function in useEffect, when the component is unmounted we run this function,
    // the function also gets run right before this function with hashchange event listener runs again,
    // so you can clean up from the previous round,
    // that that is not really relevant here because we are going to run once as the component mounts,
    // but if you have some variable here in the dependency array, it will run every time variable changes,
    // at first it will run cleanup function, and then addEventListener with hashchange

    return () => {
      // window.removeEventListener("hashchange"), () => {};
      window.removeEventListener("hashchange", handleHashChange);
    };
    // the second argument of the return has to be reference to the function (event listener) we wanna remove,
    // but the function, we specified inline earlier, how you can specify the function, you need to specify that function outside here
  }, []);

  // Now on clean base URL http://localhost:5173/  (without hash in URL) when we click we get an id in console log

  // We basically attached the event listener to the hashchange event on the window object, now whenever the hash changes we gonna run this function
  // Now when we go to e.g. http://localhost:5173/#11312545454587 we do not see log in the console (we want to see that),
  // this change event hashchange will not happen on the initial load, it only happens when it actually changes, we want to log this when it also loads
  // we can call handleHashChange(); (after useEffect) when the component first mounts

  return activeJobItemId;
}

///-------------------------------------------------------------------------------
//this is previous version, new version using Tanstack React-Query (Caching) was introduced below
export function useJobItem2(id: number | null) {
  const [jobItem, setJobItem] = useState<JobItemExpanded | null>(null);
  //loading spinner for details of offer
  const [isLoading, setIsLoading] = useState(false);

  /// When we click on the offer we want details on that particular jobItem, we have a lot of details
  /// we have data that we haven't seen before e.g. Description, Location, Salary, Qualifications, Company Reviews etc.
  /// previously we have seen only this data in types.tsx id: number; badgeLetters: string; title: string; company: string; relevanceScore: number; daysAgo: number;
  /// this data was used for listing of the data, but we did not use Description, Location, Salary, Qualifications, Company Reviews etc.,
  /// to make a fetch for data lighter, it was not fetched previously for listing of offers
  /// it has to (fetch data again) ask for the additional data from the server, use its's own loading spinner
  /// This approach is very common in practice, you can have a lot of data, if you are getting a list,
  /// you are not going to get all of the data first, you get a shortened version of all of the jobItems,
  /// basically a highlights of the most important information, if you wanna see the details of one of them,
  /// you can request that from the server, you make a separate network request
  /// we are going to use not query params https://bytegrad.com/course-assets/projects/rmtdev/api/data?search=react
  /// but the second way of specifying sep resource you want is by using path parameter
  /// https://bytegrad.com/course-assets/projects/rmtdev/api/data/id
  /// https://bytegrad.com/course-assets/projects/rmtdev/api/data/77667576576677

  // We need to make a fetch request for the specific data (address with the id)
  // we can use fetch API to make a network request in the browser, it is built into browser, we do not have to import anything
  // if we call fetch() in App.tsx, every time the component renders/renders (App component), you are going to make request,
  // it is not what we want, we want to make a fetch request when activeJobItemId actually changes
  // when connecting to the external system, e.g. server you may consider using useEffect,
  // useEffect has a dependency array telling how ofter the function should run, empty array, function will run once when the component mounts
  // we want to run the usEffect function whenever the activeJobItemId changes

  useEffect(() => {
    // when you hover over activeJobItemId intellisense tells it could be null
    // then we want, if it is null do nothing
    // if (!activeJobItemId) return;
    if (!id) return; // more general changed name to id for more reusable component
    const fetchData = async () => {
      setIsLoading(true);
      // fetch("https://bytegrad.com/course-assets/projects/rmtdev/api/data/");
      // const response = await fetch(`${BASE_API_URL}/${activeJobItemId}`);
      const response = await fetch(`${BASE_API_URL}/${id}`); // more general changed name to id for more reusable component
      const data = await response.json();
      setIsLoading(false);
      console.log(data);
      setJobItem(data.jobItem);
    };
    fetchData();
    // }, [activeJobItemId]);
  }, [id]); // more general changed name to id for more reusable component

  // we want to put jobItem (as const data) in the useState (jobItem) to store the information, because we want trigger rerender
  // in developer tools in the browser > Network > id number element in the Name table > Response

  //return jobItem; // this return goes to const jobItem = (in App.tsx), then moved to JobItemContent.tsx
  // we need to return job items as well as loading state
  // we can return that two ways, as an object or a matrix
  return { jobItem, isLoading } as const;
  // return [jobItem, isLoading] as const;
}

///-------------------------------------------------------------------------------

//  NOT INTRODUCED *** as in App.tsx (there is mention of that there) fancy custom hook combining these two above to one
// export function useActiveJobItem() {
//   const activeJobItemId = useActiveJobItemId();
//   const jobItem = useJobItem(activeJobItemId);

//   return jobItem;
// }

///-------------------------------------------------------------------------------
// this version of useJobItems does not use Tanstack React-Query

// searchText is a normal input of the function not a props (without curly braces)
export function useJobItems2(searchText: string) {
  // it does not have sense that we are having a jobItems in a component SearchForm
  // we are not using jobItems in this form (in the SearchForm in the Header component), we want to have jobItems in the Container component in the sidebar on the left
  // SearchForm is int the Header component, we are lifting the state up the component tree to the App.tsx

  //we specify the type so TypeScript won't underline further with boolean | never[] type
  const [jobItems, setJobItems] = useState<jobItem[]>([]);
  // setter function for setJobItems can still be used in the SearchForm
  // the issue here is that setJobItems is closely related to searchText, it actually makes sense
  // to colocate up the component tree to App.tsx so the logic is not scattered through multiple components,
  // it will simplify the transition to React-Query later

  // we get two empty arrays in the beginning, in React strict mode component is mounted once, unmounted and then mounted the second time
  console.log(jobItems);

  // state for the loading Spinner element (component)
  // initially it is false
  const [isLoading, setIsLoading] = useState(false);
  // you can also specify the type with <>, but it is not necessary TypeScript will infer the type from the initial value useState(false)
  //   const [isLoading, setIsLoading] = useState<boolean>(false);

  // derived state
  // const totalNumberOfResults = jobItems.length; //  "Purify Custom Hook(No derived state)" -> moved to App.tsx
  // derived state
  // we want only first 7 elements of the array displayed

  //const jobItemsSliced = jobItems.slice(0, 7); //  "Purify Custom Hook(No derived state)" -> moved to App.tsx
  //7 is not included it will stop on index 6

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
      setIsLoading(true);

      // in front of a promise fetch() we want to use await,
      // because if we do not do that, when you run a function all of the statements will just run
      // here because fetch() is asynchronous it will not wait for the fetch call to basically complete
      // it will immediately continue to the const data = response.json();
      // before we get to const data = response.json(); we want to wait for the promise to resolve
      // because const data = response.json(); will also give us a promise we also want to await here
      const response = await fetch(
        // `https://bytegrad.com/course-assets/projects/rmtdev/api/data?search=${searchText}`
        `${BASE_API_URL}?search=${searchText}` //back ticks - temp literals
        // for this example project server is written this way so that when we type a character it will return
        // a random number of object in the jobItems array it returns e.g. 45, 50 even if we type the same character
      );
      const data = await response.json();

      setIsLoading(false);

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

  // because we did a custom hook we need to return for props passing in App.tsx
  // this function needs to return
  //   return {
  //     // jobItems,
  //     jobItemsSliced,
  //     isLoading,
  //   };
  // renaming in App.tsx   const { jobItemsSliced: jobItems, isLoading } = useJobItems(searchText); easier way you can return the array here
  // and destructure from the array
  // return [jobItemsSliced, isLoading, totalNumberOfResults] as const;
  //return { jobItemsSliced, isLoading, totalNumberOfResults } as const;
  // "Purify Custom Hook(No derived state)" -
  // for purifying reasons we want to return whole jobItems in the list (not the 7 jobItemsSliced ), also get rid of derived state with totalNumberOfResults for a moment
  return { jobItems, isLoading } as const;
}

/// classic style generic function ///

// export function useDebounce(value, delay: number) {
// you can have a default value for parameter, if the user won't pass a value to the function  const debouncedSearchText = useDebounce(searchText);
// return type : string -> export function useDebounce(value, delay = 250): string
// here we have a relationship, whatever we put(type) we want the same type on the return
// this is a relationship, we can use generic function also called type parameter, T
// this is generic function -> useDebounce<T>

// export function useDebounce<T>(value: T, delay = 250): T {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay); //every delay (miliseconds) it will run this function

//     return () => clearTimeout(timerId); // we are cleaning Timeuots, if you type very quickly you do not get a bunch of timers
//   }, [value, delay]); // array in the end determines how often we run this function
//   // every time searchText changes it will run the function

//   return debouncedValue; // debounced value initially is gonna return null when useState(null);
// }

/// different syntax a little bit with generic arrow function ///

export const useDebounce = <T>(value: T, delay = 250): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay); //every delay (miliseconds) it will run this function

    return () => clearTimeout(timerId); // we are cleaning Timeuots, if you type very quickly you do not get a bunch of timers
  }, [value, delay]); // array in the end determines how often we run this function
  // every time searchText changes it will run the function

  return debouncedValue; // debounced value initially is gonna return null when useState(null);
};

///-------------------------------------------------------------------------------
// useJobItem using Tanstack React-Query caching

type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExpanded;
};

// utility function as an arrow function, so we have a contrast between the hooks and utility functions
// const fetchJobItem = async (id: number): JobItemApiResponse => {
// error with red underline JobItemApiResponse here (intellisense) -> The return type of an async function or method must be the global Promise<t> type. Did you mean to write Promise<JobItemApiResponse>
// if you have async it will give you the promise, but what we see in console log is object, not a promise, the way it works is it returns a promise, but resolve in object
/// here we can specify the return type after colon -> const fetchJobItem = async (id: number): => { -> it will specify the type of "data" returned by the function
const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  // const fetchJobItem = async (id: number | null) => {
  // if (!id) return null;  // using that clutters up the function
  // *** sometimes it is a little bit tricky to work with null

  const response = await fetch(`${BASE_API_URL}/${id}`);

  // There is one more part of dealing with fetching data - error handling
  // e.g. when we fetch data, when we use Fetch API the browser will send the network request for us, but what if during the request-response cycle, an error occurs, internet goes out,
  // if the request-response cycle cannot be completed, the browser will actually throw an error, it will do something like this behind the scenes "throw new Error()"
  // Since we are using utility function in here -> () => (id ? fetchJobItem(id) : null), with React-Query, React-Query will catch that error for us
  // Sometimes things go wrong,  but the request-response cycle is still completed
  // e.g. 404 e.g. ID cannot be found, the browser will not throw an error (request-response cycle is still complete). Typically we want to throw the error ourselves

  // Something else can go wrong, maybe the server doesn't want you to use special symbols
  // e.g. using @ in search, this will give 400 Bad Request status code with response: {"description":"Search query may not contain special symbols"},
  // but the request-response cycle is still complete, we got response here, browser will not throw an error, but we want an error

  // 4XX or 5XX
  // if the response is not okay we want to throw an error ourselves, browser in this case won't throw an error because request-response cycle is completed, ok would be if the response is in 200 range
  if (!response.ok) {
    const errorData = await response.json();
    // throw new Error(errorData.message);

    //throw 404; // you can technically throw anything you want

    // typically people will throw an object with message property
    // throw {
    //   message: errorData.message,
    //   status: response.status,
    // }

    //we will not create object ourselves, we are going to use so called constructor
    throw new Error(errorData.description);
  }
  const data = await response.json();
  console.log(data);
  return data; //React Query will automatically put that in the cache, it can do refetching automatically after some time, it can refetch when we make the window active again (open tab)
};

/// useJobItemUsingReactQueryForCache
// *****
export function useJobItem(id: number | null) {
  // *** sometimes it is a little bit tricky to work with null
  // *** you could technically check if there is no id, but this won't work in React hook, you cannot call the hook conditionally, after, or as a part of a if statement
  // *** that is not allowed according to the rules of hook in React, you have to always call it unconditionally
  // *** if (!id) return;

  // useQuery hook will do all of that for us with caching and things like that
  // hook will give us data of data fetching, and will tell us the loading state,
  // inside we need to specify 3 arguments, array - so called queryKeys,
  // we sort of label this query, we pass the string e.g. job-item, we also wanna pass id as well, id also uniqally describes this query,
  // this is similar to the dependency array in useEffect, in useEffect to the dependency array we add id, whenever the id changes it will re-run useEffect
  // in useQuery when the id change, it will re-run the query, unless we have already fetched the data for the particular id, in that case it will use the cache,
  // we can also remove that cache, maybe for some reason we want fetch every time, you can bust that cache these using this way of labelling query, e.g. "job-item", id
  // typically is that you have own word, and sort of a variable on which this query depends

  // the second part needs to be a function, this is where we fetch the data,
  // we will have to fetch the data ourselves, React-Query will not fetch the data for us,
  // it will only handle things as caching the data, and all those side issues,
  // here we need to use Fetch API or Axios or other library, we still have to do data fetching ourselves

  // const { data, isLoading } = useQuery(
  // **** solution to error as below
  const { data, isInitialLoading } = useQuery(
    ["job-item", id],

    // moved up to utility function
    // async () => {
    //   const response = await fetch(`${BASE_API_URL}/${id}`);
    //   const data = await response.json();
    //   return data; //React Query will automatically put that in the cache, it can do refetching automatically after some time, it can refetch when we make the window active again (open tab)
    // }
    // moved up to utility function

    // () => fetchJobItem(id) // moved up to utility function, we need to pass the id, arrow function here <- so we will not run the function immediately, it is similar with the event handlers
    () => (id ? fetchJobItem(id) : null), // if id we want to run the function
    // *** sometimes it is a little bit tricky to work with null
    // the third argument is going to be options, it can determine how long we should cache the result
    // staleTime - after how long should we consider data outdated and make new network request
    // -> staleTime: 1000 * 60, - after a minute we should make a network request
    // -> staleTime: 1000 * 60, - after an hour we should make a network request
    // -> refetchOnWindowFocus: false, - during development this is going to be annoying, we are often switching around during development, we do not want to refetch every time we are going there
    // -> retry: false - retry after there was an error
    // -> enabled: true - this is important one, it means when the component using this hook first mounts, should this useQuery also run immediately after component using it mounts
    // that should only be the case if there is id in the URL, there shouldn't be any data fetching without id,
    // enabled: !id ? false : true, (if there is no id do not automatically data fetch on the first mount, but if there is an id fetch on the first mount),
    // it depends whether the is is null or not, enabled: !!id , we convert that to boolean, double negation, if id is truthy this (!!id) will become true, if is is falsy it will become false,
    // you can be more specific, be  more explicit and cast the id to boolean -> enabled: Boolean(id) - you can use this constructive function, pass some value (id) an it convert that
    // -> onError: () => {}, - we can also specify what if there is an error, what if fetching the data will throw the error, e.g. if the internet goes out during the fetching data, or during this fetch call
    // the browser will throw an error, and maybe we want to throw the error ourselves, maybe the status code is 404, the browser will not throw an error if the status code is 404,
    // onError: (error) => {},
    {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: !id ? false : true,
      // onError: (error) => {
      //   console.log(error);
      // },
      onError: handleError, // usage of utility function
      // **** Going to the http://localhost:5173/ we have an error, loading spinner is all the time, and that is not what we intend to have,
      // we have the error despite the data being fetched, we even do not have id in the URL
      // It is simply because how Tanstack React-Query works, we use the "enabled: Boolean(id)" option and that what has an impact on the error,
      // basically it comes down to isLoading will also be true here initially, because there is no data, so from the perspective of React-Query there is no data,
      // so we basically waiting for the data, loading the data,
      // is Loading is not what we gonna use here, we can use isInitialLoading
    }
  );

  console.log(data);
  // variable in between to get the jobItem out of data
  // const jobItem = data?.jobItem; // we can have the optional chaining, but here it is not required
  const jobItem = data?.jobItem; // if the data is undefined, whole thing becomes undefined (instead of crashing the app), we see that in consol.log(data)
  /// we can use optional chaining to get rid of the problem below
  /// Another common problem is the types actually, when we hover over "data" used by that useQuery it is of type "any" (intellisense). jobItem pulled from data.jobItem is also typed as "any",
  /// what we return from the hook (jobItem) is some type any, so wherever you use that hook e.g. in JobItemContent component, when you get the jobItem it has type "any", this is also not ideal.
  /// React-Query recommends is that you type the return value of fetching function, the function that implements the fetching, we can specify the return type
  /// "data" can be null or undefined, our application crashes, we want Typescript to warn us, we do not get a warning because of "data" is typed as any

  // **** solution to error as above
  const isLoading = isInitialLoading;

  // here we need to make sure the objects holds the jobItem property in this exact name "jobItem", because we destructure that later using that
  return { jobItem, isLoading } as const;
  // we do not want the whole data, we want data.jobItem
}

// React-Query requires QueryClientProvider that wraps the app, what the React Query wants to do is essentially the same as what we would do with Context API Provider,
// we would wrap the part of the app that needs access to the Context with the Context Provider, React Query does something similar
// in main.tsx we add -> new QueryClient();

/// now we see a a loading spinner all the time (when we first load the app),
// everything is working as expected because we do not have any id in the URL, we do not have any data to fetch, we do not have any id
// we see a a strange loading spinner because a React-Query actually deals with loading state isLoading a little bit different,
// we see undefined because there is no data yet
// now when we click on the jobItem offer and then again, on the same offer, we have an instant reaction without loading spinner (during the fetch), we do not do the fetch,
// using back and forth buttons in the browser we do not fetch the data again, it is instant in the cache

///-------------------------------------------------------------------------------

// This is new useJobItems which is doing a totally different thing than previously named useJobItems (now useSearchQueryJobItems)
// This is returning objects based on array of IDs (not a search text), it is used mostly in the bookmarks popup to populate that popup with JobItems

// with useJobItem you create one query request, for this below we make multiple network requests in parallel to get all of job items

// useQueries hook given by Tanstack React-Query, to get multiple parallel results

export function useJobItems(ids: number[]) {
  const results = useQueries({
    //queries: [], // here is array with objects for each query, we map over, for every id we create an object
    queries: ids.map((id) => ({
      queryKey: ["job-item", id],
      queryFn: () => fetchJobItem(id), // we use our fetchJobItem implementation from above ("fetchJobItem" is completely different from "fetchJobItems")
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    })),
  }); // we are passing an object

  console.log(results); // results is an array with N objects for each query, for each query it is an object
  //const jobItems = [] this is an array, so we can immediately filter out things in line
  const jobItems = results
    //const jobItems : JobItemExpanded[] = results // we can force type like this -> : JobItemExpanded[], this will not work
    .map((result) => result.data?.jobItem) // if that is not defined (is undefined) result.data, for this result.data.jobItem you get undefined, to prevent app from crashing we need question mark - ?
    // .filter((jobItem) => jobItem !== undefined); // what we also want, after doing map we want to filter out undefined if there is such
    // it is going over each one, if you return a truthy value it will put it in the new array, if you return falsy value it will be removed

    // *8 People will use different ways of filtering out undefined or null -> .filter((jobItem) => jobItem !== undefined);
    // if it is undefined we want ot remove it, you can make it boolean with double negation (that element will not be included)
    // if we have one negation !jobItem this become true
    //.filter((jobItem) => !!jobItem);  // this will work at least in the world of runtime code, not in the world of types,
    //TypeScript is still not picking up on this
    // .filter((jobItem) => Boolean(jobItem)); // in the world of runtime this would work, in the world of types it still does not work
    .filter((jobItem) => Boolean(jobItem)) as JobItemExpanded[]; // what you can do, this is something you rarely want to do ->
  // -> you wanna cast this whole results.map().filter(), cast - force TypeScript to view that as type JobItemExpanded[] and not JobItemExpanded[] || undefined
  // this is rare situation when we know better than TypeScript, most times you do not know better than TypeScript

  // THESE SOLUTIONS ABOVE SHOULD WORK, TypeScript just does not pick up correct type on that
  // There is a solution for this -> This is so annoying that there is a library ts-reset (https://github.com/total-typescript/ts-reset) created by Matt Pocock
  // https://www.youtube.com/@mattpocockuk
  // https://github.com/mattpocock
  // https://www.mattpocock.com
  // https://www.totaltypescript.com
  // Without `ts-reset`
  // ...
  // - 🤦 `.filter(Boolean)` doesn't behave how you expect

  // we are dealing with an array of results, if at least one of them is still loading when we consider the entire thing to still be loading
  // at least one in the array -> method some
  const isLoading = results.some((result) => result.isLoading); //  if at least one of them is still loading

  return {
    jobItems,
    isLoading,
  };
}

// ***** since useJobItem ^^  we are using in there, this has also been marked with the id
// once a particular id has been fetched which is what we are doing in useJobItems (useQueries hook given by Tanstack React-Query, to get multiple parallel results),
// React-Query will make sure that if after that there is another query for that particular id, there is no new network request, it is going to put that in a cache.
// Event thought we are using different hooks in different functions, as long as we marked these queries with the particular id,
// React-Query will make sure it will be cached

// It is also good to know,
// if you have a lot of bookmarks in our app, in Chrome at least, there can be only 6 requests in parallel,
// the 7th one can start only when the first 6 network requests complete, there is a waterfall, it is Browser limitation

///-------------------------------------------------------------------------------

///this version of  useJobItems (later renamed to useSearchQueryJobItems) is using Tanstack React-Query caching

// We want to use Tanstack React-Query for caching of the the search with text query in useJobItems,
// this will be also useful with back and forth buttons in the browser,
// also to not to use fetch request every time we modify the search query text

type JobItemsApiResponse = {
  public: boolean; // we are not interested in that
  sorted: boolean; // we are not interested in that
  jobItems: jobItem[]; // these jobItems are the shorted version, specific for the list on the left, based on query text search
};

// we are not returning an object strictly speaking, we are returning a promise with async function
// you are always returning a promise but it will resolve in an object

// technically you can put these fetch functions in utils.ts file as well,
// cause these are also utility functions, they are also typically called not fetchJobItem but getJobItem
// you can rename them that way

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
  // 4XX or 5XX
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);

    //what we get here is an object
    // {
    //   message : 'description'
    // }
  }
  // when we use "@" symbol when searching we receive in log -> Error: Search query may not contain special symbols at fetchJobItems
  // we are logging the error here but in the real world we would like to have a toast message displayed to the user
  // Probably the most popular library is https://react-hot-toast.com
  // $ npm i react-hot-toast@2.4.1
  // then edit in package.json "dependencies": {"react-hot-toast": "2.4.1"} // we remove ^ sign from version
  const data = await response.json();
  return data; // we are returning an object which will have some other things like sorted or public is true
  // data is typed as JobItemsApiResponse | undefined
};

// searchText is a normal input of the function not a props (without curly braces)

//export function useJobItems(searchText: string) { //useJobItems name is too tightly coupled with search of text, rename to useSearchQueryJobItems
export function useSearchQueryJobItems(searchText: string) {
  // const { data, isLoading } = useQuery(
  const { data, isInitialLoading } = useQuery(
    // isLoading issue with constant loading animation
    //
    ["job-items", searchText], // array of query keys, how to identify this particular query, and if it depends on some variable you add that here too (searchText)
    () => fetchJobItems(searchText), // we specify the function that will do the data fetching
    {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText), // do we want to run this when the component first mounts
      // onError: (error) => {
      // onError: (error: any) => {

      //-> moved to utility function / onError: (error: unknown) => {
      ///   let message;
      ///   if (error instanceof Error) {
      ///     message = error.message;
      ///   } else if (typeof error === "string") {
      ///     message = error;
      ///   } else {
      ///     message = "An error occurred.";
      ///   } // if the type of a throwing message is not a string but a boolean or a number etc.

      /// error.message; // you cannot do that red underline, error could be anything and you do not know if there is a message

      //-> moved to utility function / console.log(error);

      onError: handleError, // usage of utility function

      //alert(error); // unesthetic but it works as a poor-man's toast message

      // when we use "@" symbol when searching we receive in log -> Error: Search query may not contain special symbols at fetchJobItems
      // we are logging the error here but in the real world we would like to have a toast message displayed to the user
      // Probably the most popular library is https://react-hot-toast.com
      // $ npm i react-hot-toast@2.4.1
      // then edit in package.json "dependencies": {"react-hot-toast": "2.4.1"} // we remove ^ sign from version

      // we want tot implement toast message handling here
      // we add <Toaster /> to App.tsx

      //toast.error(error);
      // we cannot pass the error like that because it is an object throw new Error - new Error will create an object, application crashes

      /// toast.error(error.message);
      //-> moved to utility function / toast.error(message);
      /// red underline for error here, error is of the type unknown (intellisense)
      /// unknown type is the opposite of any

      // In the real wold besides toast message you want to have client-side validation,
      // before you even send the "@" symbol to server we want to already validate that,
      // but even with client-side validation, some problems can sneak-through,
      // even on the server you wanna have validation, people can always circumvent client side validation,
      // take the hack way around it, so you want validation on the server no matter what,
      //if there is a problem you still want to send the message to the frontend, if there is an issue we (user) know how to fix it

      // here an error message is obviously strictly for "@" symbol, there is no regex rule on the server

      /// toast.error(error.message); in hooks.ts
      /// red underline for error here, error is of the type unknown (intellisense)
      /// unknown type is the opposite of any
      /// if we do -> onError: (error: any) => {
      /// we can type
      /// toast.error(error.message.aezakmi())
      /// here anything goes, any is very unsafe actually, if you do that, that may crash the application because this method does not exist

      /// if we do -> onError: (error: unknown) => {
      /// error.blahblah() // you get a warning, we do not know anything about error, so you cannot try access something
      /// unknown type is the opposite of any

      /// why there is red underline for error here, error is of the type unknown (intellisense)?
      /// why does this makes sense?
      /// error is coming from the React fetch API (await fetch) if the network round trip cannot be completed,
      /// but we can also throw error ourselves (we do that above), and maybe we are using third-part library in here,
      /// third-party library can also throw errors, or could be throwing anything actually

      /// here we are throwing an error object, this is typical -> throw new Error(errorData.description)
      /// here ypu could technically throw the number 5, or a string, or a boolean, or an error object,
      /// meaning it was created with a new error constructor in javascript
      /// throw 5;
      /// throw 'something in string';
      /// throw false;
      /// throw {} //

      /// fetch API here if the network round trip cannot be completed will also do something like a new Error under the hood,
      /// most third party libraries if there is an error will also do new Error,
      /// the vast majority of the time it will actually be a new Error, so it will actually be new error object,
      /// however it is technically possible that it is something else, and therefore we do not know what it is gonna be, therefore we have the unknown type

      /// this is the most specific way we can describe the type of this-> onError: (error: unknown) => {
      /// since it is unknown
      /// when we intellisense (hover on) on error in toast.error the method expects the certain type,
      /// toast.error(error) here we are passing something of type unknown, you cannot pass something of type unknown to this method,
      /// it needs to be something else, it needs to be some message

      /// ideally we want to pass a string here -> toast.error(error);
      /// Typically what you wanna do when you ale dealing with errors, and you have the unknown type,
      /// is you want to extract the string from here -> onError: (error: unknown) => {
      /// then we will pass the string to the actual error method -> toast.error(error);

      /// How do you extract message from there?
      /// We can simply check an error is actually created with that throw new Error,
      /// we can check for that //if error is the instance of Error constructor function//
      /// -> if (error instanceof Error)
      /// an object like that will have a message property with the string, it mays have the other things as well
      ///{
      ///  message: "string",
      ///}
      /// an error created with new Error will be an object with message property,
      /// then we can extract message from there using error.message

      /// Most of the time error will actually be an instance of that Error constructor function,
      /// however it is technically possible that you may throw something else like a boolean or a number
      /// or what is also possible is that you do not throw an object  but you throw an error description immediately as a string
      /// -> throw "something went wrong";
      /// we check an option if the error is string

      /// It is also good to mention that in latest (above 4) Tanstack React-Query they have decided
      /// to not make this error of type unknown but just of this Error type, because that is what you get the vast majority of the time,
      /// and that will make it a little bit easier for most people to work with it

      /// however we are in version 4 of React-Query and error is typed as unknown,
      /// error type unknown is technically a little bit safer, a little bit more precise,
      /// technically it could be something else, but in the latest React-Query it makes a little cumbersome to work with it,
      /// because if you want to do something with it TypeScript will complain, will tell you that technically it is unknown,
      /// you cannot just pass it to some method, you cannot do something like -> error.message, it will red underline error in this case,
      /// you cannot do that because you do not know what the error is gonna be,
      /// if it is an instance of Error, you can do that as in (above)-> message = error.message;

      /// we make utility function for error handling
      //-> moved to utility function / },
    } // options
  );

  //--> const jobItems = data?.jobItems; // red underline, initially data is undefined
  // you do not have to create separate variable for that

  // initially data is undefined -> to prevent app from crashing we want to use "?"
  // instead of crashing the app, data will become undefined

  // data typed as any, error trying to read jobItems, it is not possible because data initially is null or undefined
  // we do not get a warning from TypeScript, because data has been typed as any
  // we need to specify the output JobItemsApiResponse

  // isLoading issue with constant loading animation
  //--> const isLoading = isInitialLoading;
  // you do not have to create separate variable for that

  return { jobItems: data?.jobItems, isLoading: isInitialLoading } as const;
  // you can do it inline without creating separate variables as above (-->)
}

// Uncaught TypeError: Cannot read properties of undefined (reading 'length')
// we can access something that could be undefined in App.tsx -> totalNumberOfResults = jobItems.length
// we need to add optional chaining -> (?)

// now the caching of a search text works instantly

// JobList.tsx:28 Uncaught TypeError: Cannot read properties of undefined (reading 'map'),
// it is because we do with optional chaining (?), in App.tsx totalNumberOfResults: number | undefined has a red underline
// optional chaining (?), if the jobItem is undefined totalNumberOfResults is going to be undefined
// we are going to set "initial value" with jobItems?.length || 0 -> in case it is undefined it is gonna take zero,
// it is also short circuiting if jobItems?.length  is truthy it will not evaluate the second part with zero
// it the first is falsy it will immediately give zero

// we add empty array in -> jobItemsSliced = jobItems?.slice(0, 7 ) || [];
// if it is undefined it will be empty array, it will map over empty array, no problem

///-------------------------------------------------------------------------------

// this hook is essentially the same as useState, but persists the data in localStorage
//**
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // key is a prop it is a parameter of the function
  // const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() =>
  const [value, setValue] = useState(
    () =>
      // JSON.parse(localStorage.getItem("bookmarkedIds") || "[]")
      // JSON.parse(localStorage.getItem(key) || String(initialValue)) // you cannot do String(initialValue), what you get is an empty string, you cannot parse an empty string to JSON.parse
      JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue)) // this will work JSON.stringify
    // if we do this, this will be a string initialValue  -> .getItem((key) || "initialValue")
    // we need to stringify whatever the initial value is, when we pass an empty array as initial value [] this will eventually become this "[]", everything works
    // we do not know what the user of this hook is gonna put in there, we cannot assume that initially it should be an empty array
    // we need to specify any as the initial value -> initialValue: any
  );

  useEffect(() => {
    // localStorage.setItem("bookmarkedIds", JSON.stringify(bookmarkedIds));
    localStorage.setItem(key, JSON.stringify(value));
    // }, [bookmarkedIds]);
    // }, [value]); //green underline  React Hook useEffect has a missing dependency: 'key'. Either include it or remove the dependency array.
    // whenever you use variable inside useEffect, if it is not a stable value, key can change, you need to add key to the dependency array
    // if it was a stable value, something that cannot change e.g. const count = 'test';, if you put count instead of a key, you won't get a warning, count will always be the same, stable value
  }, [value, key]);

  // "as const" is more strict, a narrower type, you cannot add something else to that array
  return [value, setValue] as const; // when you use array, when you use this hook and you destructure on the outputs,
  // you can use names as you want, but you need to use the correct order when destructuring
  // if you return an object, names on destructuring have to be the exact same,
  // on destructuring you can alias -> const {value: bookmarkedIds, setValue: setBookmarkedIds} = useLocalStorage("bookmarkedIds",[])
}

// V168 supplement
// We have implemented usage of local storage with useEffect and useState,
// in real world you may consider using custom hook, that other people have already created, that has already been battle tested, and takes care of some edge cases as well. For a lot of features there is a bunch of custom hooks.

// https://usehooks-ts.com/react-hook/use-local-storage

// https://usehooks-ts.com/react-hook/use-event-listener

// https://usehooks-ts.com/react-hook/use-interval

// https://usehooks-ts.com/react-hook/use-intersection-observer - this is what you gonna use if you want to know if some element is in the view, helpful sore some animations for example

// https://usehooks-ts.com/react-hook/use-on-click-outside - we will use that later

// https://usehooks-ts.com/react-hook/use-session-storage - this is also common

//** ------------------------------------------------------------------

// useLocalStorage hook is essentially the same as useState, but persists the data in localStorage
// if we want we can store different values in local storage e.g. -> const [searchText, setSearchText] = LocalStorage("searchText", "") -> key and default value -> "searchText", ""
// something like this could be helpful to persist the history of users searches
// maybe better to persist list of searches in the array, not like this above but to use [ ] array as initial value
// useLocalStorage is basically a utility function

// we do not want the initial value to be of type any, we still want wanna get correct types
// we want to make sure types are right, to be warned by TypeScript,
// BookmarksContextProvider.tsx ->
// const [bookmarkedIds, setBookmarkedIds] = useLocalStorage(
// "bookmarkedIds",
// [] // here also "[]" would work the same as giving [] without quotation mark
// );
//  BookmarksContextProvider.tsx <-
// for the second argument of useLocalStorage() we can pass anything (it can be anything, also empty array or object {}), that does not mean we should type that as any
// type any does not provide any protection, it does not have type safety, not to mention the intellisense does not work

// we should type it only by looking at useLocalStorage hook implementation

// we want to type the return value of a function (custom hook, basically a utility function), we used that in useDebounce
// we want to type the return value, it will always be an array with two value in there
// the return array with any amount of numbers: -> number[] -> export function useLocalStorage(key: string, initialValue: any): number[] {

// the return tuple (in TypeScript, in Javascript you never hear about tuple) -> export function useLocalStorage(key: string, initialValue: any): [number]
// this will return the array with one value in there of type number ->
// tuple is the array with fixed amount of in there
// this is tuple -> return [value, setValue] as const;

// this is only for the visualization, you do not want to use type any in tuple -> export function useLocalStorage(key: string, initialValue: any): [any, any]
// When you have a situation where you could pass in anything, an array or object, or numbers or boolean, very often you wanna use "type parameter"
// you wanna see if there is an relationship between what you pass in, and what you get out
// in this case we have a relationship between what is passed in and what is getting out
// whatever we pass in is the same type as what we get back as first part [any, any]

// -> export function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>]
// we specify relationship with type parameter in TypeScript, the fancy word for that is generics, this function is now a generic function
// when you hover on setValue intellisense only is giving the type of it as -> React.Dispatch<any>
// React.Dispatch is how the setter function of useState is typed
// when you hover on searchText in App.tsx you get -> const setSearchText: React.Dispatch<React.SetStateAction<string>>
// this is similar to what we have with type parameter above

// we need to specify we will use "type parameter" -> useLocalStorage<T>()

// whatever we passed it it will be inferred by TypeScript, at least for primitive values,
// if you pass object or an array [] as initial value, just like with useState you get array of type never[], setter function also React.Dispatch<React.SetStateAction<never[]>>

// to get rid of type never[] e.g. -> const [test, setTest] = useState<number[]>([]);

// we should implement this <number[]> where we use the function, so, the hooks implementation is reusable ->
// -> const [bookmarkedIds, setBookmarkedIds] = useLocalStorage<number[]>("bookmarkedIds",[]);

//** ------------------------------------------------------------------

///-------------------------------------------------------------------------------

// this is a custom hook for a closing a popover or other element with clicking outside
// Refs, handler is gonna be the function, another name for function like this is also callback function or event handler
// handler type, no input, does not return anything
export function useOnClickOutside(
  refs: React.RefObject<HTMLElement>[], // it is gonna be Ref/Refs for something HTMLElement in the array
  handler: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        // e.target instanceof HTMLElement && // we do not need that here typing e.target as Node
        // !buttonRef.current?.contains(e.target) &&
        // !popoverRef.current?.contains(e.target)
        // we check for every one of refs (array of refs), if click happens inside or not, this is basically the same as above -> !popoverRef.current?.contains(e.target)
        // e (event click) on some target, is that target inside popover ref or button ref or not, if it is not in there we will run this handler function
        refs.every((ref) => !ref.current?.contains(e.target as Node)) // red underline for -> e.target, we can overwrite TypeScript here again, we assert/make of type Node forcing (e.target as Node), it should not be an issue
      ) {
        // setIsOpen(false);
        handler();
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [refs, handler]);
  // whenever refs changes we are going to run useOnClickOutside function again, we are going to attach new event listener
}
// this custom hook des not use useState

// Description: Close popover on click outside by using a custom hook
// Functionality that we click outside some element and that closes, we may use that in other components or other projects as well,
// when we want to detect a click happened outside some element
// It is often used in models and popovers, so you can close it
// It is so common that there is a third party hook https://usehooks-ts.com/react-hook/use-on-click-outside
// When creating a custom hook, we take our previous implementation for one use case and we need to generalize it for other use cases
// We copy the specific solution to the hook
// The second step is looking how you would like to use it, how usage should usage look like
// We want to call it in the place we use it, we want to specify what we want it to do when that occurs, it is like dealing with the event, OnClick, OnChange
// we wanna run the function when the event occurs -> useOnClickOutside([], () =>{});

// We need to specify what we are clicking outside of, we are going to use Refs,
// we are passing refs to the function so we can detect when click happens outside those elements we attach the Ref to

// parameters in the array, first parameter needs to be a way for us to determine what is this element about (array is a the first parameter),
// second parameter is what we wanna do when there is a click outside of them
// -> BookmarksButton.tsx

///-------------------------------------------------------------------------------
