import React from "react";
import FeedbackForm from "../feedback/FeedbackForm";
import PageHeading from "../PageHeading";
import Pattern from "../Pattern";
import Logo from "../Logo";

type HeaderProps = {
  handleAddToList: (text: string) => void;
};

export default function Header({ handleAddToList }: HeaderProps) {
  return (
    <header>
      <Pattern />
      <Logo />
      <PageHeading />
      <FeedbackForm onAddToList={handleAddToList} />
    </header>
  );
}
