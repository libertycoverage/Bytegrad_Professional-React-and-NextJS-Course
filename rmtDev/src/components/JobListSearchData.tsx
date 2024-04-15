import React from "react";
import JobList from "./JobList";
import { useJobItemsContext } from "../contexts/JobItemsContextProvider";

export default function JobListSearchData() {
  const { jobItemsSortedAndSliced, isLoading } = useJobItemsContext();
  return <JobList jobItems={jobItemsSortedAndSliced} isLoading={isLoading} />;
}
