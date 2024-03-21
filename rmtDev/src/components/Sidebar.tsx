import JobList from "./JobList";
import PaginationControls from "./PaginationControls";
import ResultsCount from "./ResultsCount";
import SortingControls from "./SortingControls";

// export default function Sidebar({ jobItems }) {
export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sidebar">
      {/* <div className="sidebar__top">
        <ResultsCount />
        <SortingControls />
      </div>
      <JobList jobItems={jobItems} />

      <PaginationControls /> */}
      {children}
    </div>
  );
}

{
  /* we create a component in Sidebar.tsx to remove this div around components in App.tsx*/
}
export function SidebarTop({ children }: { children: React.ReactNode }) {
  return <div className="sidebar__top">{children}</div>;
}
