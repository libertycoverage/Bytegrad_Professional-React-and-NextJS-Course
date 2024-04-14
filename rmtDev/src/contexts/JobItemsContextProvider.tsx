import React, { useState, createContext, useEffect, useContext } from "react";

import { RESULTS_PER_PAGE } from "../lib/constants";
import { JobItem, PageDirection, SortBy } from "../lib/types";
import { useSearchQueryJobItems } from "../lib/hooks";
import { useSearchTextContext } from "./SearchTextContextProvider";

type JobItemsContext = {
  jobItems: JobItem[] | undefined;
  jobItemsSortedAndSliced: JobItem[];
  isLoading: boolean;
  totalNumberOfResults: number;
  totalNumberOfPages: number;
  currentPage: number;
  sortBy: SortBy;
  handleChangePage: (direction: PageDirection) => void;
  handleChangeSortBy: (newSortBy: SortBy) => void;
};

export const JobItemsContext = createContext<JobItemsContext | null>(null);

export default function JobItemsContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // dependency on other context
  const { debouncedSearchText } = useSearchTextContext(); // we need to consume the context to get access to debouncedSearchText
  // there is one requirement, if you want to use the context in other context, component needs to be in that provider component in the tree (one need to wrap the other in main.tsx)
  // in main.tsx -> <SearchTextContextProvider> <JobItemsContextProvider> <AppNewV181 /> </JobItemsContextProvider> </SearchTextContextProvider>

  // state
  const { jobItems, isLoading } = useSearchQueryJobItems(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("relevant");

  // derived / computed state
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;

  const jobItemsSorted = [...(jobItems || [])].sort((a, b) => {
    if (sortBy == "relevant") {
      return b.relevanceScore - a.relevanceScore;
    } else {
      return a.daysAgo - b.daysAgo;
    }
  });

  const jobItemsSortedAndSliced =
    jobItemsSorted.slice(
      currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
      currentPage * RESULTS_PER_PAGE
    ) || [];

  // event handlers / actions
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

  const handleChangeSortBy = (newSortBy: SortBy) => {
    setCurrentPage(1); // <- added only this single line to implement automatic teleport user to Page 1 if he chooses other option (relevant or recent)
    setSortBy(newSortBy);
  };

  return (
    <JobItemsContext.Provider
      value={{
        jobItems,
        jobItemsSortedAndSliced,
        isLoading,
        totalNumberOfResults,
        totalNumberOfPages,
        currentPage,
        sortBy,
        handleChangePage,
        handleChangeSortBy,
      }}
    >
      {children}
    </JobItemsContext.Provider>
  );
}

// this hook if to consume the context from this Context Provider
export function useJobItemsContext() {
  const context = useContext(JobItemsContext);
  if (!context) {
    throw new Error(
      "useJobItemsContext -> useContext(JobItemsContext) must be within a JobItemsContextProvider"
    );
  }
  return context;
}
