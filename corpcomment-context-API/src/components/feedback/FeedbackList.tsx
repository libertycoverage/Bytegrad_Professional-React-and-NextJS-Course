import { TriangleUpIcon } from "@radix-ui/react-icons";
import React, { useContext, useEffect, useState } from "react";
import FeedbackItem from "./FeedbackItem";
import Spinner from "../Spinner";
import ErrorMessage from "../ErrorMessage";
import { TFeedbackItem } from "../../lib/types";
import { useFeedbackItemsContext } from "../../lib/hooks";

// type FeedbackListProps = {
//   isLoading: boolean;
//   feedbackItems: TFeedbackItem[];
//   errorMessage: string;
//   // these above are required types
//   // errorMessage?: string;  <- if this is optional use question mark
// };

// export default function FeedbackList({
//   isLoading,
//   feedbackItems,
//   errorMessage,
// }: FeedbackListProps) {
export default function FeedbackList() {
  // const context = useContext(FeedbackItemsContext);

  // // if context is null,
  // if (!context) {
  //   throw new Error(
  //     "FeedbackItemsContext is not defined in FeedbackList component"
  //   );
  // }

  const { isLoading, errorMessage, filteredFeedbackItems } =
    useFeedbackItemsContext();

  // making this (!context) statement as above is not very convenient, you can make a custom hook instead to dismiss that
  // custom hook to consume the context
  // we create custom hook to avoid  if (!context) { every time as in FeedbackList.tsx

  // const { feedbackItems, isLoading, errorMessage } = context;
  // you cannot destructure that immediately in const { feedbackItems, isLoading, errorMessage } = useContext(FeedbackItemsContext);
  // because it could be null, you cannot start destructuring form null, you have to be sure first it is not null

  return (
    <ol className="feedback-list">
      {/* {isLoading && <Spinner />} */}
      {/* {context.isLoading && <Spinner />} */}
      {isLoading && <Spinner />}
      {/* what we should do is use context as here context.isLoading, but TypeScript
      complains, there is one problem with that because context can also be null 
      (type of the context is also null as is TFeedbackItemsContext, context gonna be null also when
      this Container component is outside this Provider component as here (based on App.tsx) 
        <Container />
      <FeedbackItemsContextProvider>
      </FeedbackItemsContextProvider>
      because this FeedbackList components is in the Container component, now this FeedbackList 
      is outside the Provider component, context so then be null, 
      TypeScript complains because you cannot start accessing things on something that could be null,
      it will not work, TyepScript wants you to first check 
      it is gonna be a developer mistake if we did not wrap this Container in the Provider as in
         <Container />
      <FeedbackItemsContextProvider>
      </FeedbackItemsContextProvider>*/}
      {errorMessage && <ErrorMessage message={ErrorMessage} />}
      {filteredFeedbackItems.map((feedbackItem) => (
        <FeedbackItem key={feedbackItem.id} feedbackItem={feedbackItem} />
      ))}
    </ol>
  );
}
