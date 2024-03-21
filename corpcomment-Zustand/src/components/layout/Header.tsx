import React from "react";
import FeedbackForm from "../feedback/FeedbackForm";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";
import Logo from "../Logo";
import { useFeedbackItemsContext } from "../../lib/hooks";
import { useFeedbackItemsStore } from "../../stores/feedbackItemsStore";

export default function Header() {
  // const { handleAddToList } = useFeedbackItemsContext();

  // we are basically using a selector here, we want the selected state,
  //when something changes state.addItemToList this Header component won't rerender
  const addItemToList = useFeedbackItemsStore((state) => state.addItemToList);

  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      {/* <FeedbackForm onAddToList={handleAddToList} /> */}
      <FeedbackForm onAddToList={addItemToList} />
    </header>
  );
}
