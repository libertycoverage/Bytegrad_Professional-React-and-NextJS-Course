import React from "react";
import FeedbackList from "../feedback/FeedbackList";
import Header from "./Header";
import { TFeedbackItem } from "../../lib/types";

type ContainerProps = {
  isLoading: boolean;
  feedbackItems: TFeedbackItem[];
  errorMessage: string;
  handleAddToList: (text: string) => void;
  // it sets the state but does not return anything
};

export default function Container({
  isLoading,
  feedbackItems,
  errorMessage,
  handleAddToList,
}: ContainerProps) {
  return (
    <main className="container">
      <Header handleAddToList={handleAddToList} />
      <FeedbackList
        isLoading={isLoading}
        feedbackItems={feedbackItems}
        errorMessage={errorMessage}
      />
    </main>
  );
}
