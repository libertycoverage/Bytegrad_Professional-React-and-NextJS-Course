import { useContext, useEffect, useState } from "react";
import { FeedbackItemsContext } from "../contexts/FeedbackItemsContextProvider";
import { TFeedbackItem } from "./types";

export function useFeedbackItemsContext() {
  const context = useContext(FeedbackItemsContext);
  if (!context) {
    throw new Error(
      "FeedbackItemsContext is not defined in FeedbackList component"
    );
  }
  return context;
}

// custom hook for retching the data ***
export function useFeedbackItems() {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState("");

  // useEffect(() => {
  //   setIsLoading(true);
  //   fetch(
  //     "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
  //   )
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Something went wrong.");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data.feedbacks);
  //       setFeedbackItems(data.feedbacks);
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       setErrorMessage("Something went wrong");
  //       setIsLoading(false);
  //     });
  // }, []);

  // instead of above newer syntax with async
  useEffect(() => {
    const fetchFeedbackItems = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
        );

        if (!response.ok) {
          throw new Error("Something went wrong.");
        }

        const data = await response.json();
        setFeedbackItems(data.feedbacks);
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again later.");
      }

      setIsLoading(false);
    };

    fetchFeedbackItems();
  }, []);

  return {
    feedbackItems,
    isLoading,
    errorMessage,
    setFeedbackItems,
  };
}
