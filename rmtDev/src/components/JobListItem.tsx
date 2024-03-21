import { JobItem } from "../lib/types";
import BookmarkIcon from "./BookmarkIcon";

// we want to console log the types to see what data types are passed within each element (jobItem)

// // we are going to create a type since it is an important entity in an app, and could be used in multiple places
// type jobItem = {
//   id: number;
//   badgeLetters: string;
//   title: string;
//   company: string;
//   relevanceScore: number;
//   daysAgo: number;
// };
// we are moving types to types.ts

type JobListItemProps = {
  jobItem: JobItem;
  isActive: boolean;
  // isActive?: boolean; // when we want a prop/type to be optional we use question mark
};

// now the intellisense on types works

// JobListItem needs a state for keeping track whether the item in the list is active or not,
// this is an indicator which offer is chosen or not,
// to manipulate css of that typically what you need is to change a className,
// we change job-item class to template literal with `` back ticks,
// if there is state isActive is true then add className "job-item--active" otherwise add nothing

export default function JobListItem({ jobItem, isActive }: JobListItemProps) {
  return (
    // <li className="job-item">
    <li className={`job-item ${isActive ? "job-item--active" : ""}`}>
      {/* PART ONE/TWO we add id to the URL using anchor tag, so we can further read from the URL and display the offer */}
      {/* jobItem.id is a number and href expects a string, that should not be a problem, browser should automatically convert that */}
      {/* we add a hashtag # in front of that to prevent refresh */}
      <a href={`#${jobItem.id}`} className="job-item__link">
        <div className="job-item__badge">{jobItem.badgeLetters}</div>

        <div className="job-item__middle">
          <h3 className="third-heading">{jobItem.title}</h3>
          <p className="job-item__company">{jobItem.company}</p>
        </div>

        <div className="job-item__right">
          <BookmarkIcon />
          <time className="job-item__time">{jobItem.daysAgo}d</time>
        </div>
      </a>
    </li>
  );
}
