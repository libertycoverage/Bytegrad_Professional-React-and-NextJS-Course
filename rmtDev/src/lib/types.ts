// we are going to create a type since it is an important entity in an app, and could be used in multiple places
export type JobItem = {
  id: number;
  badgeLetters: string;
  title: string;
  company: string;
  relevanceScore: number;
  daysAgo: number;
};

// In the browser in the Devtools in Network tab we have requested element with id with things such as description,
// that were not specified in types.ts for JobItem before,
// There are two request for data, query params with search and for specific asset
// we create Expanded type as below

export type JobItemExpanded = JobItem & {
  description: string;
  qualifications: string[];
  reviews: Array<string>;
  duration: string;
  salary: string;
  location: string;
  coverImgURL: string;
  companyURL: string;
};

//there are two ways of writing string array as above

export type SortBy = "relevant" | "recent";

export type PageDirection = "next" | "previous";
