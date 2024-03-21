import React from "react";
import FeedbackList from "../feedback/FeedbackList";
import Header from "./Header";
import { TFeedbackItem } from "../../lib/types";

export default function Container({}) {
  return (
    <main className="container">
      <Header />
      <FeedbackList />
      {/* TyeScript complains with red underline of components because we specified the type FeedbackListProps in FeedbackList.tsx*/}
    </main>
  );
}
