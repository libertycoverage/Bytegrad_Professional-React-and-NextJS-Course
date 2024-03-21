import React from "react";
import FeedbackForm from "../feedback/FeedbackForm";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";
import Logo from "../Logo";
import { useFeedbackItemsContext } from "../../lib/hooks";

export default function Header() {
  const { handleAddToList } = useFeedbackItemsContext();

  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      <FeedbackForm onAddToList={handleAddToList} />
    </header>
  );
}
