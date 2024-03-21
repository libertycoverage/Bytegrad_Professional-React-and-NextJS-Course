import React from "react";

type HashtagItemProps = {
  company: string;
  onSelectCompany: (company: string) => void;
};
export default function HashtagItem({
  onSelectCompany,
  company,
}: HashtagItemProps) {
  return (
    <li key={company}>
      <button onClick={(e) => onSelectCompany(company)}>#{company}</button>
    </li>
  );
}
