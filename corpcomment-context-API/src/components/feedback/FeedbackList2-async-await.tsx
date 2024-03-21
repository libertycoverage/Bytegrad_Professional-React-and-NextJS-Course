import { TriangleUpIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";

export default function FeedbackList() {
  const [feedbackItems, setFeedbackItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // async/await syntax

  // what you do not want to do is
  // useEffect(async () => {
  //   await fetch();
  //   await promise.then()
  // } []);
  //fetch gives us a promise

  const fetchFeedbackItems = async () => {
    setIsLoading(true); //loading animation

    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );
      if (!response.ok) {
        throw new Error("Something went wrong.");
      }
      // how to catch an error, wrap everything in try catch

      const data = await response.json();
      setFeedbackItems(data.feedbacks); // it need to be here otherwise "data" is not accessible after error near setIsLoading(false);
      // "data" is scoped to the nearest block
    } catch (error) {
      // whatever will be thrown will be assigned to error here
      setErrorMessage("Something went wrong. Please try again later.");
    }

    setIsLoading(false);
  };

  // for reusability fetchFeedbackItems is before useEffect, other functions can access to that, it can also be inside the useEffect

  useEffect(() => {
    // const fetchFeedbackItems = async () => {
    //   setIsLoading(true); //loading animation

    //   try {
    //     const response = await fetch(
    //       "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
    //     );
    //     if (!response.ok) {
    //       throw new Error("Something went wrong.");
    //     }
    //     // how to catch an error, wrap everything in try catch

    //     const data = await response.json();
    //     setFeedbackItems(data.feedbacks); // it need to be here otherwise "data" is not accessible after error near setIsLoading(false);
    //     // "data" is scoped to the nearest block
    //   } catch (error) {
    //     // whatever will be thrown will be assigned to error here
    //     setErrorMessage("Something went wrong. Please try again later.");
    //   }

    //   setIsLoading(false);
    // };

    fetchFeedbackItems();
  }, []);

  return (
    <ol className="feedback-list">
      {isLoading ? <Spinner /> : null}

      {errorMessage ? <ErrorMessage message={ErrorMessage} /> : null}

      {feedbackItems.map((feedbackItem) => (
        <FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
      ))}
    </ol>
  );
}
