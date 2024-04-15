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
import JobListSearchData from "./JobListSearchData";

// type SortBy = "relevant" | "recent";

function AppNewV181() {
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

        {/* <SearchForm searchText={searchText} setSearchText={setSearchText} /> */}
        {/* V181 we use handleChangeSearchText with Context, we do not need props passed to SearchForm component because of Context API*/}
        {/* <SearchForm searchText={searchText} onChangeSearch={handleChangeSearchText} /> */}
        <SearchForm />
      </Header>
      {/* <Container jobItems={jobItems} setJobItems={setJobItems} /> */}
      <Container>
        <Sidebar>
          <SidebarTop>
            {/* <ResultsCount totalNumberOfResults={totalNumberOfResults} /> // REPLACED DUE TO JobItemsContextProvider*/}
            <ResultsCount />
            {/* <SortingControls sortBy={sortBy} onClick={handleChangeSortBy} /> // REPLACED DUE TO JobItemsContextProvider */}
            <SortingControls />
          </SidebarTop>
          {/* <JobList jobItems={jobItems} isLoading={isLoading} /> */}
          {/* <JobList jobItems={jobItemsSliced} isLoading={isLoading} />  */}
          {/* after renaming that jobItemsSliced to jobItems in place in this file */}
          {/* <JobList jobItems={jobItems} isLoading={isLoading} /> */}
          {/* <JobList jobItems={jobItemsSliced} isLoading={isLoading} />  change jobItemsSliced to jobItemsSorted*/}
          {/* <JobList jobItems={jobItemsSorted} isLoading={isLoading} /> we replace -> jobItems?.slice( with -> jobItemsSorted?.slice */}

          {/* <JobList jobItems={jobItemsSortedAndSliced} isLoading={isLoading} /> MOVED TO JobListSearchData component BECAUSE of JobItemsContextProvider usage */}
          <JobListSearchData />
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
          {/* <PaginationControls
            previousPage={currentPage - 1}
            nextPage={currentPage + 1}
            currentPage={currentPage}
            totalNumberOfPages={totalNumberOfPages}
            onClick={handleChangePage}
          /> */}
          {/* // REPLACED DUE TO JobItemsContextProvider */}
          <PaginationControls />
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

export default AppNewV181;
