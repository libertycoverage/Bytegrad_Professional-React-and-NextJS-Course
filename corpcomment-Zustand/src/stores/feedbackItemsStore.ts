// in React Context API you are creating a React component that will be a part of a component tree,
// with state management library e.g. Zustand you are not creating a React Component, it is a separate system outside a component tree

import { create } from "zustand";
import { TFeedbackItem } from "../lib/types";

//create(() => ({})) returning immediately as an object

type Store = {
  feedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  selectedCompany: string;
  getCompanyList: () => string[];
  getFilteredFeedbackItems: () => TFeedbackItem[];
  addItemToList: (text: string) => Promise<void>;
  // promise that does not return anything
  selectCompany: (company: string) => void;
  fetchFeedbackItems: () => Promise<void>;
};

export const useFeedbackItemsStore = create<Store>((set, get) => ({
  // according to hooks.ts and FeedbackItemsContextProvider.tsx
  // we wil not use useState as in hooks.ts or setter functions
  // when we want to change the state in Zustand it is called actions, let's implement the actions
  feedbackItems: [],
  isLoading: false,
  errorMessage: "",
  selectedCompany: "",

  // according to FeedbackItemsContextProvider.tsx
  // when we want state from the store you use get, get() will get the entire store
  getCompanyList: () => {
    return get()
      .feedbackItems.map((item) => item.company)
      .filter((company, index, array) => {
        return array.indexOf(company) === index;
      });
  },
  getFilteredFeedbackItems: () => {
    const state = get();

    return state.selectedCompany
      ? state.feedbackItems.filter(
          (FeedbackItem) => FeedbackItem.company === state.selectedCompany
        )
      : state.feedbackItems;
  },
  // as in handleAddToList in FeedbackItemsContextProvider.tsx
  addItemToList: async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);

    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };

    // setFeedbackItems((prev) => [...prev, newItem]);

    //state is a previous state, we are returning an object,
    //with Zustand you need to return the entire store essentially
    //we have here only object with feedbackItems what about others isLoading etc.
    //Zustand will merge that as it is called, Zustand will add automatically other thing for you
    set((state) => ({
      feedbackItems: [...state.feedbackItems, newItem],
    }));

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  },
  // as in handleSelectCompany in FeedbackItemsContextProvider.tsx
  selectCompany: (company: string) => {
    // set((state) => ({ selectedCompany: company })); // we can omit the state word
    set(() => ({ selectedCompany: company }));
  },
  // as in useFeedbackItems in hooks.ts
  fetchFeedbackItems: async () => {
    // setIsLoading(true);
    set(() => ({ isLoading: true }));

    try {
      const response = await fetch(
        "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
      );

      if (!response.ok) {
        throw new Error("Something went wrong.");
      }

      const data = await response.json();
      //   setFeedbackItems(data.feedbacks);
      set(() => ({ feedbackItems: data.feedbacks }));
    } catch (error) {
      //   setErrorMessage("Something went wrong. Please try again later.");

      set(() => ({
        errorMessage: "Something went wrong. Please try again later.",
      }));
    }

    // setIsLoading(false);
    set(() => ({ isLoading: false }));
  },
}));
