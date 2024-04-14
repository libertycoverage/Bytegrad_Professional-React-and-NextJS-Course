// type ResultsCountProps = {
//   totalNumberOfResults: number;
// };

// export default function ResultsCount({
//   totalNumberOfResults,
// }: ResultsCountProps) {
//   return (
//     <p className="count">
//       <span className="u-bold">{totalNumberOfResults}</span> results
//     </p>
//   );
// }
//
// to use JobItemsContextProvider

import { useJobItemsContext } from "../contexts/JobItemsContextProvider";

export default function ResultsCount() {
  const { totalNumberOfResults } = useJobItemsContext();

  return (
    <p className="count">
      <span className="u-bold">{totalNumberOfResults}</span> results
    </p>
  );
}
