import React from "react";
import HashtagItem from "./HashtagItem";
import { useFeedbackItemsContext } from "../../lib/hooks";
import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";

export default function HashtagList() {
  // console.log("HashtagList rendering");
  // const { companyList, handleSelectCompany } = useFeedbackItemsContext();
  const companyList = useFeedbackItemsStore((state) => state.getCompanyList());
  const selectCompany = useFeedbackItemsStore((state) => state.selectCompany);

  return (
    <ul className="hashtags">
      {companyList.map((company) => (
        <HashtagItem
          key={company}
          company={company}
          // onSelectCompany={handleSelectCompany}
          onSelectCompany={selectCompany}
        />
      ))}
    </ul>
  );
}
