import React from "react";
import HashtagItem from "./HashtagItem";
import { useFeedbackItemsContext } from "../../lib/hooks";

export default function HashtagList() {
  console.log("HashtagList rendering");
  const { companyList, handleSelectCompany } = useFeedbackItemsContext();

  return (
    <ul className="hashtags">
      {companyList.map((company) => (
        <HashtagItem
          key={company}
          company={company}
          onSelectCompany={handleSelectCompany}
        />
      ))}
    </ul>
  );
}
