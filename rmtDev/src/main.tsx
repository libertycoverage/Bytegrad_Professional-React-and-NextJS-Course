import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.tsx";
import AppNewV181 from "./components/AppNewV181.tsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookmarksContextProvider from "./contexts/BookmarksContextProvider.tsx";
import ActiveIdContextProvider from "./contexts/ActiveIdContextProvider.tsx";
import SearchTextContextProvider from "./contexts/SearchTextContextProvider.tsx";
import JobItemsContextProvider from "./contexts/JobItemsContextProvider.tsx";

// to use Tanstack React Query
const queryClient = new QueryClient();
// to use Tanstack React Query

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* // to use Tanstack React Query we wrap the app with QueryClientProvider (similar usage to the provider in React Context API) */}
    <QueryClientProvider client={queryClient}>
      <BookmarksContextProvider>
        <ActiveIdContextProvider>
          <SearchTextContextProvider>
            <JobItemsContextProvider>
              {/* <App /> */}
              <AppNewV181 />
            </JobItemsContextProvider>
          </SearchTextContextProvider>
        </ActiveIdContextProvider>
      </BookmarksContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
