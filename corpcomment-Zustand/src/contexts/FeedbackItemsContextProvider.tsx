import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TFeedbackItem } from "../lib/types";
import { useFeedbackItems } from "../lib/hooks";

type FeedbackItemsContextProviderProps = { children: React.ReactNode };

type TFeedbackItemsContext = {
  // feedbackItems: TFeedbackItem[];
  filteredFeedbackItems: TFeedbackItem[];
  isLoading: boolean;
  errorMessage: string;
  companyList: string[];
  handleAddToList: (text: string) => void;
  handleSelectCompany: (company: string) => void;
};

export const FeedbackItemsContext = createContext<TFeedbackItemsContext | null>(
  null
);
// null is underlined red, an error, intellisense: "You cannot assign null to TFeedbackItemsContext"
// we add | (or) null as a type, it is gonna be null when you use context outside the provider
// if you use inside the provider it is gonna be of this shape TFeedbackItemsContext

// accept the children prop if you wrap components (children components) with this component <FeedbackItemsContextProvider> </FeedbackItemsContextProvider>
export default function FeedbackItemsContextProvider({
  children,
}: FeedbackItemsContextProviderProps) {
  const { feedbackItems, isLoading, errorMessage, setFeedbackItems } =
    useFeedbackItems();

  // feedbackItem was a source of prop drilling

  // moved to custom hook useFeedbackItems
  // const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [errorMessage, setErrorMessage] = useState("");

  const [selectedCompany, setSelectedCompany] = useState("");

  const companyList = useMemo(
    () =>
      feedbackItems
        .map((item) => item.company)
        .filter((company, index, array) => {
          return array.indexOf(company) === index;
        }),
    [feedbackItems]
  );

  const filteredFeedbackItems = useMemo(
    () =>
      selectedCompany
        ? feedbackItems.filter(
            (FeedbackItem) => FeedbackItem.company === selectedCompany
          )
        : feedbackItems,
    [feedbackItems, selectedCompany]
  );

  const handleAddToList = async (text: string) => {
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

    setFeedbackItems((prev) => [...prev, newItem]);

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
  };

  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
  };

  // custom hook for retching the data *** useFeedbackItems

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
  //
  // }, []);

  return (
    <FeedbackItemsContext.Provider
      value={{
        // it is underlining value as red, we need to specify TFeedbackItemsContext as above
        // feedbackItems: feedbackItems,
        // error we do not wanna pass feedbackItems
        // in JS and TypeScript if you have the same name for property and the value, you can shorten that to one name
        // isLoading : 'false'
        // you cannot assign string to boolean as TFeedbackItemsContext specifies
        filteredFeedbackItems,
        isLoading,
        errorMessage,
        companyList,
        handleAddToList,
        handleSelectCompany,

        // downside of react Context API is that components which is using Context API e.g. handleSelectCompany will rerender (HashtagList.tsx),
        // this component rerender even if this variable handleSelectCompany did not change, and only e.g. filteredFeedbackItems change
        // this is one of the downside of Context API which does not have so called selectors,
        // one way of solving that is splitting the variables into multiple context providers, it will require additional extra work
        // in that case you wanna look into more professional dedicated state management libraries like Redux Toolkit or Zustand
      }}
    >
      {children}
    </FeedbackItemsContext.Provider>
    // what you pass as value, this is what you gonna provide to your component tree
  );
}

// you have to be careful with what you put in ContextProvider because one of the downsides of react Context API,
// everything you put in here in value={{}}, if only one of them changes e.g. companyList changes, all of components
// that are using this Context API will also rerender, even though they may use feedbackItems for example,
// the more things you add in here value={{}} the higher the chance you gonna get those unwanted rerenders

// therefore there is no easy way to move const filteredFeedbackItems = useMemo( as in App.tsx
// out of simplicity we will add those: from App.tsx
//  -> const [selectedCompany, setSelectedCompany] = useState("");
//  -> const filteredFeedbackItems = useMemo(
//  -> const handleSelectCompany = (company: string)
/// to the FeedbackItemsContextProvider.tsx
// if we then use an app and notice some performance issues, we can always change that later,
// and spend time and energy towards maybe splitting that up to multiple context or another solution

// we create custom hook to avoid  if (!context) { every time as in FeedbackList.tsx

// -->> custom hook moved to hooks.ts, we can also create hook near this context file
