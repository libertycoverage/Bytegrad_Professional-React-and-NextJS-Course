import { useEffect, useMemo, useState } from "react";
import { TFeedbackItem } from "../lib/types";
import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashtagList from "./hashtag/HashtagList";
import FeedbackItem from "./feedback/FeedbackItem";
import FeedbackItemsContextProvider from "../contexts/FeedbackItemsContextProvider";
import { useFeedbackItemsStore } from "../stores/feedbackItemsStore";

function App() {
  const fetchFeedbackItems = useFeedbackItemsStore(
    (state) => state.fetchFeedbackItems
  );

  // you may also use the library called React Query, fetching data in useEffect is not ideal,
  // it has some downsides

  useEffect(() => {
    fetchFeedbackItems;
  }, [fetchFeedbackItems]);

  return (
    <div className="app">
      <Footer />
      {/* you only wrap a part of app that really need it */}
      {/* <FeedbackItemsContextProvider> */}
      <Container />
      <HashtagList />
      {/* </FeedbackItemsContextProvider> */}

      {/* <HashtagList /> */}

      {/* we got an error when <HashtagList /> component is outside the ContextProvider component */}
    </div>
  );
}

export default App;
