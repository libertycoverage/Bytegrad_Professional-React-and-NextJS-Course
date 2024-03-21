import { useEffect, useMemo, useState } from "react";
import { TFeedbackItem } from "../lib/types";
import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashtagList from "./hashtag/HashtagList";
import FeedbackItem from "./feedback/FeedbackItem";
import FeedbackItemsContextProvider from "../contexts/FeedbackItemsContextProvider";

function App() {
  return (
    <div className="app">
      <Footer />
      {/* you only wrap a part of app that really need it */}
      <FeedbackItemsContextProvider>
        <Container />
        <HashtagList />
      </FeedbackItemsContextProvider>

      {/* <HashtagList /> */}

      {/* we got an error when <HashtagList /> component is outside the ContextProvider component */}
    </div>
  );
}

export default App;
