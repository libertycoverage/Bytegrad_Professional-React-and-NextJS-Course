import { useEffect, useState } from "react";
import Background from "./Background";
import Container from "./Container";
import Footer from "./Footer";
import Header, { HeaderTop } from "./Header";
import BookmarksButton from "./BookmarksButton";
import Logo from "./Logo";
import SearchForm from "./SearchForm";
import JobItemContent from "./JobItemContent";
import Sidebar, { SidebarTop } from "./Sidebar";
import JobList from "./JobList";
import PaginationControls from "./PaginationControls";
import ResultsCount from "./ResultsCount";
import SortingControls from "./SortingControls";
import {
  useActiveJobItemId,
  useDebounce,
  useJobItem,
  useJobItems,
  useSearchQueryJobItems,
} from "../lib/hooks";
import { BASE_API_URL, RESULTS_PER_PAGE } from "../lib/constants";
import { Toaster } from "react-hot-toast";
import { PageDirection, SortBy } from "../lib/types";

// type SortBy = "relevant" | "recent";

function App() {
  // useState searchText, jobItems and useEffect with fetch moved up the component tree to App.tsx from SearchForm component
  // useState initially is an empty string

  // state
  const [searchText, setSearchText] = useState("");

  // Hook rules
  // With hooks you cannot call that conditionally
  // if (searchText.length > 0) {
  //   return;
  // }
  // you are calling useState, you can replace useJobItems with what is inside hooks.ts, you cannot call hooks e.g. useState after some condition
  // this is not allowed, you cannot also do that with a custom hook, if you have use in name of a hook it means you use things like useState or useEffect under the hood

  //all of what was here is moved to a custom hook in hooks.ts
  // we are destructuring these two variables in place out of a custom hook function which returns jobItems, isLoading
  // const { jobItems, isLoading } = useJobItems(searchText);
  // const { jobItemsSliced, isLoading } = useJobItems(searchText);

  // you can rename variable in place on destructuring
  // const { jobItemsSliced: jobItems, isLoading } = useJobItems(searchText);

  // there is actually an easier way of renaming, instead of returning an object as in hooks.ts with return {jobItemsSliced, isLoading,}; you may actually return an array
  // you can return the array return [jobItems, isLoading]; and then destructure the array just as using useState, the original name for the first(zero) item is jobItemsSliced
  // const [jobItems, isLoading, totalNumberOfResults] = useJobItems(searchText);
  // you can rename in the array as we want, whatever we are returning in useJobItems() in the array will match up with this array here, you need the order to be right
  // you do not need to rename that in line, actually you can use the name you want to use when destructuring, even if the array contains different, original name

  // if you use the object instead of an array, the order does not matter, and you can destructure here a specific element e.g. totalNumberOfResults, jobItemsSliced, isLoading, not the whole array,
  // you have top make sure function on the right returns object, you have to use the exact names without renaming or rename with colon as const { jobItems: jobItemsRenamed, isLoading, totalNumberOfResults } = useJobItems(searchText);
  // the order in the object does not matter

  //X //moving debounced version of a searchText to a custom hook, the more general version
  //X const [debouncedSearchText, setDebouncedSearchText] = useState("");
  //X const { totalNumberOfResults, jobItemsSliced, isLoading } =
  //X  // useJobItems(searchText);
  //X   useJobItems(debouncedSearchText);

  //X  useEffect(() => {
  //X  const timerId = setTimeout(() => {
  //X    setDebouncedSearchText(searchText);
  //X  }, 1000); //every second it will run this function

  //X  return () => clearTimeout(timerId); // we are cleaning Timeuots, if you type very quickly you do not get a bunch of timers
  //X}, [searchText]); // array in the end determines how often we run this function
  //X// every time searchText changes it will run the function

  // Debounce the searchText with a custom hook //
  // when we change searchText which happens on every keystroke, every character we add or remove searchText is gonna change it will re-render,
  // and every time we pass the new searchText to that useJobItems(searchText) hook here which fill fetch data
  // ideally we can create a debounced version of this searchText, so not on every keystroke, maybe every half a second or something like that
  // In our case application si firing too many network requests
  // searchText will change every keystroke, but we will pass to this hook useJobItems() to get the jobItems, we are going to have the debounced version of the searchText
  // we need to prevent calling this hook useJobItems(searchText); with the new value every time
  // debouncedSearchText is a slowed down version of the searchText, we need to find way to update debouncedSearchText variable

  const debouncedSearchText = useDebounce(searchText, 250);
  // const { totalNumberOfResults, jobItemsSliced, isLoading } = useJobItems(debouncedSearchText);
  // = useJobItems(searchText);

  //const { jobItems, isLoading } = useJobItems(debouncedSearchText); //  "Purify Custom Hook(No derived state)"
  // just rename useJobItems to useSearchQuery, because name is misleading due to function being tightly coupled with search query itself
  const { jobItems, isLoading } = useSearchQueryJobItems(debouncedSearchText);

  // pagination control state moved up here, because of the slicing per page
  const [currentPage, setCurrentPage] = useState(1);
  console.log(currentPage);

  // const [sortBy, setSortBy] = useState<"relevant" | "recent">("relevant"); // we want this string to be exactly type relevant, not any other string
  const [sortBy, setSortBy] = useState<SortBy>("relevant");
  console.log(sortBy);

  //const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  //moved to BookmarksContextProvider
  // when we click a bookmark we want to add ID to the array, when we click again it should be removed, toggling

  // "Purify Custom Hook(No derived state)" before we use Tanstack React-Query for caching of the the search with text query in useJobItems
  // What we are returning from this hook useJobItems() is too processed, we have a processed version with jobItemsSliced (derived state).
  // We are returning first 7 jobItems and that is opinionated (we assume we need only 7 due to visuals of the app), but we can imagine a different project or a different component you may actually need all of them
  // - it is too processed. useJobItems probably should be more general, not opinionated about what the hook returns. We should return the entire array of jobItems, in this case 45 results (server limitations)

  // derived / computed state
  const totalNumberOfResults = jobItems?.length || 0; //  "Purify Custom Hook(No derived state)" -> moved from hooks.tsx
  // 0 to 7 (7 not included)
  //const jobItemsSliced = jobItems?.slice(0, 7) || []; //  "Purify Custom Hook(No derived state)" -> moved from hooks.tsx
  // we need to add optional chaining -> (?)

  const jobItemsSorted =
    ///jobItems?.sort((a, b) => {
    /// The way this sort method works is it takes this array of jobItems and it sorts it in place
    /// (Sorts an array in place. This method mutates the array and returns a reference to the same array)
    /// We are not creating a new array

    /// This is considered a bad practice

    /// because, what if we also use jobItems somewhere else?
    /// What if we actually do wanna slice it with jobItems array -> const jobItemsSortedAndSliced = jobItems.slice(
    /// now we are mutating it so jobItems.slice( also will be affected

    /// What if we use jobItems somewhere else on some event handlers?
    /// So now if I have changed it here jobItems?.sort it is also gonna be effected when using jobItems somewhere else.
    /// It is possible that sorting of that will be a problem somewhere else.

    /// When you change arrays and objects in React you do not wanna mutate the array or object, you wanna create a new one

    /// We want to create a new one array out of this sort jobItems?.sort

    /// we can put jobItems in the new array, we can spread all of those jobItems in that new array ->  [...jobItems]?.sort
    /// then we will create new array first, and that is the one we wanna sort,
    /// in terms of performance that is a little bit worse, we will create a whole new array
    /// here our jobItems could be undefined, you would be spreading undefined, that is not allowed,
    /// we can do something like this, OR an empty array -> [...(jobItems || [])]?.sort
    /// now you can remove the empty array in the end -> //}) || [];

    [...(jobItems || [])].sort((a, b) => {
      if (sortBy == "relevant") {
        return b.relevanceScore - a.relevanceScore;
      } // it will go over the jobItems in the array and will go over each one in pairs
      // if the b is greater than a it will produce the positive number, positive number means b will be sorted higher
      // and negative number if the a is greater than b, negative number means a should be sorted higher

      // else if (sortBy === "recent") {
      else {
        return a.daysAgo - b.daysAgo; // if the b is higher number, it should go lower, (we want most recent up, less number of days upper)
      } // if the b is greater than a it will produce a negative number
      //return; // we need to stop the function, return nothing (return undefined basically here), we cannot return nothing

      //return 0; // we need to return something, zero means it will keep the order

      //WE NEED TO RETURN 0 even if we type as the exact strings -> useState<"relevant" | "recent">("relevant")

      // when we do "else" without any specifics (sortBy === "recent") we do not get a warning type,
      // because we we handle all other conditions, (previously return 0; for other conditions),
      // we remain exact strings as types here -> useState<"relevant" | "recent">("relevant")

      /// }) || []; // before we make a sliced version, we need to sort the items /// <- removed an empty array here because we created a new array above and spreading with || [] -> [...(jobItems || [])]?.sort
    });

  // const jobItemsSliced =
  const jobItemsSortedAndSliced =
    // jobItems?.slice( // here with jobItemsSorted we do not need ? because if jobItems is undefined we will have an empty array, it always is going to be some array
    jobItemsSorted.slice(
      currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
      currentPage * RESULTS_PER_PAGE
    ) || [];

  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;

  // event handlers / actions

  // const handleToggleBookmark = (id: number) => {
  //   if (bookmarkedIds.includes(id)) {
  //     setBookmarkedIds((prev) => prev.filter((item) => item !== id));
  //     // here substract id from the array
  //     // we take a previous array, then return a new array with only the items that are not the id you passed in , with filter we create a new array
  //     // practically it will filter out the one id we passed in
  //   } else {
  //     setBookmarkedIds((prev) => [...prev, id]);
  //     // here add id to the array of ids
  //   }
  // };
  // Moved to BookmarksContextProvider.tsx

  // const handleChangePage = (direction: "next" | "previous") => { // replaced with a separate type
  const handleChangePage = (direction: PageDirection) => {
    // here we should know whether we want to go to the next one or previous one
    // based on the direction we want to increase or decrease currentPage useState (1)
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous") {
      // we want to be more specific, more strict with previous
      setCurrentPage((prev) => prev - 1); // we will get zero, but we will prevent that situation to occur
    }
  };

  //handleChangePage("nextt"); // if you pass the mistake you do not go to the previous one
  // to prevent this mistake in the first place we can actually type d, this can simply be the union type -> handleChangePage = (direction: 'next' | 'previous')
  // now you get a red underline for a "nextt" mistake

  // we migrated implementation form Vid 136 to custom hook in hooks.ts for ActiveJobItemId
  //MOVED to JobItemContent.tsx//  const activeJobItemId = useActiveJobItemId();

  //MOVED to JobItemContent.tsx// console.log(activeJobItemId);
  // when you hover over activeJobItemId intellisense tells it could be null

  // in Vids there is activeId, it was replaced by activeJobItemId to be more verbose

  // we migrated implementation form Vid 138 to custom hook in hooks.ts for useState jobItem
  //MOVED to JobItemContent.tsx//  const jobItem = useJobItem(activeJobItemId); // red underline on activeJobItemId, we introduce in hooks.ts (or) null in  useJobItem(id: number | null) {

  // NOT INTRODUCED *** hook.ts could be used fancy custom hook combining these two above to one -> you have to comment out these as follows:
  // this going to be commented out as above -> const jobItem = useJobItem(activeJobItemId);
  // and also this -> const activeJobItemId = useActiveJobItemId();
  // replacing them with this -> const jobItem = useActiveJobItem();

  // we need to pass in what the new one should be
  // const handleChangeSortBy = (newSortBy: "relevant" | "recent") => {
  const handleChangeSortBy = (newSortBy: SortBy) => {
    setCurrentPage(1); // <- added only this single line to implement automatic teleport user to Page 1 if he chooses other option (relevant or recent)
    setSortBy(newSortBy);
  };
  // Last feature we want to add, we go to e.g. "sorted" on Page 4,
  // when we click the other option "relevant" we want to automatically teleport user
  // to Page 1 of the this other option --  dealing with that is implemented here -> setSortBy(newSortBy); just above
  // we add setCurrentPage(1);

  return (
    <>
      <Background />
      {/* <Header searchText={searchText} setSearchText={setSearchText} /> */}
      {/* we want to use children pattern to avoid prop drilling */}
      {/* we create a component in Header.tsx to remove this div around these two components */}
      <Header>
        {/* <div className="header__top">
          <Logo />
          <BookmarksButton />
        </div> */}
        <HeaderTop>
          <Logo />
          <BookmarksButton />
        </HeaderTop>

        <SearchForm searchText={searchText} setSearchText={setSearchText} />
      </Header>
      {/* <Container jobItems={jobItems} setJobItems={setJobItems} /> */}
      <Container>
        <Sidebar>
          <SidebarTop>
            <ResultsCount totalNumberOfResults={totalNumberOfResults} />
            <SortingControls sortBy={sortBy} onClick={handleChangeSortBy} />
          </SidebarTop>
          {/* <JobList jobItems={jobItems} isLoading={isLoading} /> */}
          {/* <JobList jobItems={jobItemsSliced} isLoading={isLoading} />  */}
          {/* after renaming that jobItemsSliced to jobItems in place in this file */}
          {/* <JobList jobItems={jobItems} isLoading={isLoading} /> */}

          {/* <JobList jobItems={jobItemsSliced} isLoading={isLoading} />  change jobItemsSliced to jobItemsSorted*/}
          {/* <JobList jobItems={jobItemsSorted} isLoading={isLoading} /> we replace -> jobItems?.slice( with -> jobItemsSorted?.slice */}
          <JobList jobItems={jobItemsSortedAndSliced} isLoading={isLoading} />

          {/* //an error with types boolean | never[] after destructuring as an array from the custom hook with that above: const [jobItems, isLoading] = useJobItems(searchText); */}
          {/* jobItems cannot be a boolean, it is an array, there are two issues here, first, JobItems is not a correct type, when you fetch the data TypeScript by default types that as any type,
           we do not immediately get the correct type when we fetch data, and also when we use useState TypeScript will infer (wywnioskowuje) the type, 
           when you hover on isLoading with the useState(false) with intellisense, for isLoading in hooks.ts says it is boolean, TypeScript infers the type
           in hooks.ts we specify the type so TypeScript won't underline further with boolean | never[] type
           we specify type inline const [jobItems, setJobItems] = useState<JobItem[]>([]);

           now we need to also make sure that the type on hover will intellisense won't be a boolean since it tells that there is: boolean | jobItem[]
           if we have -> const numbers = [5,4,9]; TypeScript will infer the type as number[], array of any number 
           when you do -> numbers = [5,4,9] as const; now when you hover on that array you see the type is going to be const numbers: readonly [5,4,9]
           it will not be an array of number[] it is going to be this specific array with 5,4,9

           this is also what we gonna do, when we return an array from custom hook as in hooks.ts -> return [jobItemsSliced, isLoading] as const;
           now jobItems and isLoading is not underlined here in App.tsx -> <JobList jobItems={jobItems} isLoading={isLoading} />
           */}

          {/* <PaginationControls setCurrentPage={} /> */}
          <PaginationControls
            previousPage={currentPage - 1}
            nextPage={currentPage + 1}
            currentPage={currentPage}
            totalNumberOfPages={totalNumberOfPages}
            onClick={handleChangePage}
          />
        </Sidebar>
        {/* MOVED to so you do not have to pass a prop anymore <JobItemContent jobItem={jobItem} /> */}
        <JobItemContent />
      </Container>

      <Footer />
      {/* Added React-Hot-Toast */}
      <Toaster position="top-right" />
    </>
  );
}

export default App;
