import { TriangleUpIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { TFeedbackItem } from "../../lib/types";

///--->> moved from FeedbackList.tsx to App.jsx lift the state up

type FeedbackListProps = {
  isLoading: boolean;
  feedbackItems: TFeedbackItem[];
  errorMessage: string;
};

export default function FeedbackList({
  isLoading,
  feedbackItems,
  errorMessage,
}: FeedbackListProps) {
  ///--->> moved from FeedbackList.tsx to App.jsx lift the state up

  return (
    <ol className="feedback-list">
      {/* {isLoading ? <Spinner /> : null} */}
      {/* if isLoading is true show the spinner otherwise do nothing */}

      {/* a little bit cleaner syntax */}
      {isLoading && <Spinner />}
      {/* it the first is truthy it will immediately evaluate the second part, if first is falsy it will immediately shortcut, it will stop, it will not evaluate the second part */}
      {/* if the first would be 0 e.g. feedbackItem.length (could be zero) it will output 0 on the page */}

      {/* we want to pass that message into component of ErrorMessage */}
      {/* {errorMessage ? <ErrorMessage message={ErrorMessage} /> : null} */}
      {/* a little bit cleaner syntax */}
      {errorMessage && <ErrorMessage message={ErrorMessage} />}

      {/* {feedbackItems.map((feedbackItem) => {
        return <FeedbackItem feedbackItem={feedbackItem} />;
      })} */}
      {/* we do not have to explicitly write return */}
      {/* {exampleFeedbackItems.map((feedbackItem) => ( */}
      {feedbackItems.map((feedbackItem) => (
        <FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
        // <FeedbackItem blabla={} feedbackItem={feedbackItem} />
      ))}

      {/* what if we are passing an upvoteCount like before */}
      {/* {feedbackItems.map((feedbackItem) => (
        <FeedbackItem upvoteCount={5} badgeLetter="B" />
      ))} */}

      {/* <FeedbackItem feedbackItem={feedbackItem1} />
      <FeedbackItem feedbackItem={feedbackItem2} /> */}
    </ol>
  );
}
