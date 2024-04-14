import { useActiveIdContext } from "../contexts/ActiveIdContextProvider";
import { useJobItemsContext } from "../contexts/JobItemsContextProvider";
import { useActiveJobItemId } from "../lib/hooks";
import { jobItem } from "../lib/types";
import JobListItem from "./JobListItem";
import Spinner from "./Spinner";

type JobListProps = {
  jobItems: jobItem[];
  isLoading: boolean;
};

export function JobList({ jobItems, isLoading }: JobListProps) {
  // REPLACED DUE TO JobItemsContextProvider
  // export function JobList() {
  //   const { jobItems, isLoading } = useJobItemsContext();

  //we reuse the custom hook for getting and activeJobItemId to know
  //which one we need to be checked/darker with className job-item--active
  // if jobItem.id === activeId is true the outcome will be true

  //const activeId = useActiveJobItemId();  // replaced with context hook
  const { activeJobItemId: activeId } = useActiveIdContext();
  // since it is an object we need to destructure the exact name, we can use alias in place

  return (
    <ul className="job-list">
      {/* {isLoading ? <Spinner /> : null} */}
      {/* alternative */}
      {isLoading && <Spinner />}

      {/*  when doing a new search, we want to show JobItems only when isLoading is false so the spinner won't display over the list of previously searched items, already rendered */}

      {/* // you want to map over the array, jobItems passed as prop is an array of objects */}
      {/* {jobItems.map((jobItem) => jobItem.title)} we are showing just title for testing */}
      {!isLoading &&
        jobItems.map((jobItem) => (
          // <JobListItem key={jobItem.id} jobItem={jobItem} isActive={true} />
          <JobListItem
            key={jobItem.id}
            jobItem={jobItem}
            isActive={jobItem.id === activeId}
          />
          // you can actually use key and it is not passed through as prop
        ))}
    </ul>
  );
}

export default JobList;
