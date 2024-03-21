import JobItemContent from "./JobItemContent";
import Sidebar from "./Sidebar";

// export default function Container({ jobItems }) { to avoid prop drilling we replace that with children pattern
export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container">
      {/* <Sidebar jobItems={jobItems} />
      <JobItemContent /> */}
      {children}
    </div>
  );
}
