import React from "react";

type HashtagItemProps = {
  company: string;
  onSelectCompany: (company: string) => void;
};
// onSelectCompany is a function that does not return anything, but have an input of company string

// generic onClick, it does not have to know the implementation
export default function HashtagItem({
  onSelectCompany,
  company,
}: HashtagItemProps) {
  return (
    // here for a unique key could be company because we have filtered them out previously
    // it is a bit fragile, maybe later we decide to not filter out duplicates or do something else with it
    // it may not be as robust as we would like, just for now we will accept this
    <li key={company}>
      {/* <button onClick={() => {}} >#{company}</button> <- it can be in line function like this or */}

      {/* <button onClick={onSelectCompany}>#{company}</button> */}
      {/* here is a tricky bug with onClick Type of „(company: string) => void” you cannot assign to the type „MouseEventHandler<HTMLButtonElement>”.
        Types of parametres „company” i „event” are incompatible
        when we do <button onClick={e=> onSelectCompany}>#{company}</button> 
        when it is defined like this onClick={onSelectCompany} TypeScript will try to pass that event object 
        as input to this function onSelectCompany, but this function only accept a string 
        */}
      <button onClick={(e) => onSelectCompany(company)}>#{company}</button>
      {/* when you do that it should set the setSelectedCompany to that company name */}
    </li>
  );
}
