import React from "react";

type HashtagListProps = {
  children: React.ReactNode;
  // almost everything is ReactNode
  // using chldren composition bloats up App.tsx file
};

export default function HashtagList({ children }: HashtagListProps) {
  return (
    <ul className="hashtags">
      {/* mapping over company list, and creating list after that
      {companyList.map((company) => {
        return <HashtagItem company={company} />;
        // here with one line you can also remove return keyword
      })} */}
      {children}
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
