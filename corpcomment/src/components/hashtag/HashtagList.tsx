import React from "react";
import HashtagItem from "./HashtagItem";

type HashtagListProps = {
  companyList: string[];
  handleSelectCompany: (company: string) => void;
};

export default function HashtagList({
  companyList,
  handleSelectCompany,
}: HashtagListProps) {
  return (
    <ul className="hashtags">
      {/* mapping over company list, and creating list after that
      {companyList.map((company) => {
        return <HashtagItem company={company} />;
        // here with one line you can also remove return keyword
      })} */}

      {companyList.map(
        (company) => (
          // <li key={company}>
          //   <button>#{company}</button>
          // </li>
          <HashtagItem
            company={company}
            onSelectCompany={handleSelectCompany}
          />
        )
        // here with one line you can also remove return keyword
      )}
    </ul>

    // previously when we had list like this we were creating a separate components for the item in the list
    // let us make HashtagItem.tsx

    // {/* <li>
    //     <button>#TestTag</button>
    //   </li>
    //   <li>
    //     <button>#Nike</button>
    //   </li>
    //   <li>
    //     <button>#McDonald's</button>
    //   </li>
    // </ul> */}
  );
}
