import { useEffect, useMemo, useState } from "react";
import { TFeedbackItem } from "../lib/types";
import Container from "./layout/Container";
import Footer from "./layout/Footer";
import HashtagList from "./hashtag/HashtagList";
import FeedbackItem from "./feedback/FeedbackItem";

///--->> moved from FeedbackList.tsx to App.jsx lift the state up

//object
// const feedbackItem1 = {
//   upvoteCount: 593,
//   badgeLetter: "B",
//   companyName: "Bytegrad",
//   text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
//   daysAgo: 4,
// };

// const feedbackItem2 = {
//   upvoteCount: 3,
//   badgeLetter: "B",
//   companyName: "Starbucks",
//   text: "Lorem",
//   daysAgo: 7,
// };

// we are mapping over the array of object
// const feedbackItems = [feedbackItem1, feedbackItem2];

// const exampleFeedbackItems = [
//   {
//     upvoteCount: 593,
//     badgeLetter: "B",
//     companyName: "Bytegrad",
//     text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
//     daysAgo: 4,
//   },
//   {
//     upvoteCount: 3,
//     badgeLetter: "B",
//     companyName: "Starbucks",
//     text: "Lorem",
//     daysAgo: 7,
//   },
// ];

// we have this variable which holds all of the data, array with object, it is a constant, it will never change
// we want to change the data, and when it changes we want to rerender the component,
// so we can map over the updated feedbackItems so we can add additional feedbackItem to the list

///--->> moved from FeedbackList.tsx to App.jsx lift the state up

function App() {
  ///--->> moved from FeedbackList.tsx to lift the state up

  //const [feedbackItems, setFeedbackItems] = useState([]);
  // const [feedbackItems, setFeedbackItems] = useState(exampleFeedbackItems);

  // const [feedbackItems, setFeedbackItems] = useState([]);
  //TypeScript never error: it is a little bit different when your initial value is a state or an object,
  //initially it is an empty array, later when we fetch the data we want to add something to that array
  // if you pass an empty array initially what it is going to think, there will be an array and in there
  // it will not know what type in there is gonna be, it is never[] type, later when you try setting state,
  // when you try to add something to the array Typecript will complain,
  // here new item in the array will be of TFeedbackItem type, we want to add newItem of TFeedbackItem type
  // to the array of type of never
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);

  // typically you want to deal with the loading state, loading state is also something you want to put in useState,
  // because it can change over time and we cannot derive it from already existing state
  // loading state initially is false, and when we start fetching we are setting to true
  // when we get the data and the fetching is finished we setIsLoading to false again

  // const [isLoading, setIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // two forms are viable, <Boolean> is not necessary
  // TypeScript never error: when you have false in useState TypeScript can infer from the initial value,
  // that isLoading is gonna be boolean

  const [errorMessage, setErrorMessage] = useState("");
  // when you fetch the data a couple of things can go wrong,
  // with the actual fetch call with the request-response cycle something can go wrong, we can make a request to the server,
  // we do not get the response, the browser (since the browser is the one making a network request will throw an error),
  // if the user internet goes off when fetching the data
  // the second thing that can go wrong that the request-response cycle complete,
  // the server gets request client gets response,
  // maybe we request wrong resource, maybe it does not exist on the server (server response is a 404 status code),
  // in that case fetch will not throw an error (request-response cycle completed), but we still wanna throw an error ourselves
  // we still consider catching an 404/500 status an error, if the response is not OK (not in 200 range) throw an Error

  // it is nice to colocate the data and ways to update the data closely together

  // we click on a selected hashtag in hashtag list to see only posts related to the selected company
  // const [selectedCompany, setSelectedCompany] = useState("ByteGrad");
  const [selectedCompany, setSelectedCompany] = useState("");
  // we want to to this when we actually selected something

  // we are taking the selected company and filtering out everything that is not that selected company
  const filteredFeedbackItems = useMemo(
    () =>
      selectedCompany
        ? feedbackItems.filter(
            (FeedbackItem) => FeedbackItem.company === selectedCompany
            // if it is falsy it will be filtered out of the array
            // if this is truthy (true) the item will be in the new array filteredFeedbackItems
          )
        : feedbackItems,
    [feedbackItems, selectedCompany]
    // at the end of useMemo we have list of variables, if these variables change it will run again
  );
  // if the string in const [selectedCompany, setSelectedCompany] = useState(""); is falsy we get a feedbackItems list

  // when you do filtering or sorting you wanna pay attention to the performance,
  // now on every rerender if the selectedCompany is truthy it will do the filtering and that is not good
  // we want to wrap that in useMemo that it will not run on every rerender

  // we are deriving from existing state
  const companyList = useMemo(
    () =>
      feedbackItems
        .map((item) => item.company)
        .filter((company, index, array) => {
          return array.indexOf(company) === index;
        }),
    [feedbackItems]
  );

  // filter is removing duplicates, with filter if you return true it will keep the value and when it is false company will be removed from the list (duplicate)
  // it will also gonna need other things, for mapping and filtering, with looping methods you gonna need index, index of the item you are looping over
  // and also the array, the entire array you are looping over
  // return array.indexOf(company) === index; here we have the whole array and we can check the index of the current company, we loop over the first e.g. Netflix here
  // array.indexOf Netflix is going to look in the array and it is gonna take the index of the Netflix item
  // and that will be the same index as the current one we are looping over, the first one will stay,
  // next time for the second index item (netflix) company will be Netflix again array.indexOf(Netflix),
  // next Netflix item will be different index than first Netflix item

  // form needs to have access to this function, we want to invoke that function when user clicks submit,
  // we need to lift the state up to Container.tsx and pass that to Header and FeedbackList components
  // although hashtags will also impact FeedbackItems, then lift the state up up to App.tsx
  // we need to make a function async because of await fetch we are using
  const handleAddToList = async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);
    // here find could be string or undefined, we need to make sure that the hashtag # is actually there written by user
    // we need validation prior to handleAddToList
    // we can use ! at the end to tell TypeScript we accept the risk

    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      // we are hardcoding id, but it should be created by the database normally, Date().getTime(), number indicating how much time since 1970
      // technically it is possible that generating of a newItem will be at the same milisecond, but for this project this is rare,
      //you have to take care of that when you run real portal service
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      // text split by space, this will gent an array with all the words essentially,
      // then we search for the word that includes # sign,
      // then we want a company name without a hashtag, from character 1 and beyond, 0 is the hashtag
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
      // first character of the company name, great letter
    };
    // we can use TypeScript intellisense e.g. inside {} to see what properties should be in this object on MacOS, CNTRL + SPECABAR
    // setFeedbackItems([...feedbackItems, newItem]);
    // we want to add a new text to an Array, keeping the previous ones texts
    // or like previous
    setFeedbackItems((prev) => [...prev, newItem]);
    // error underline type never setFeedbackItem is an array of never

    // when we submit this form, we are going to set it locally, before we even know it is gonna succeed saving this to the server
    // we will assume it also work on the server, we need optimistic update to the UI, we will assume this POST request to the server will succeed
    // optimistic update could be done here, before we fetch for POST, it will be in NextJS projects also

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          // this is what we expect as a response from server
          Accept: "application/json",
          // this is what we send to a server
          "Content-Type": "application/json",
        },
      }
    );
    // in real world when you submit something to a database, database will create id for you
  };

  const handleSelectCompany = (company: string) => {
    setSelectedCompany(company);
  };
  // now we need to make sure we pass that where we actually click on the button

  //useEffect for fetching the data out of the server, we are fetching an array of objects
  // specified useEffect, function you call, and dependency array how often you want ot run this function
  // empty array, it will run the function when the components is mounted, never again
  //useEffect(() => {}, []);
  //without an array, it will run the function every time the component rerenders
  //useEffect(() => {});

  // we want to fetch the data once, when the component is mounted
  // you can use fetch API, you can use axios
  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks"
    )
      // .then((response) => {
      //   return response.json();
      // })
      // you can omit the return and do it in one line
      // .then((response) => response.json())
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something went wrong.");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.feedbacks);
        setFeedbackItems(data.feedbacks);
        setIsLoading(false);
      })
      // network error, no t2xx response, or JSON parsing error
      .catch((error) => {
        setErrorMessage("Something went wrong");
        setIsLoading(false);
      });
    // we do not want to setIsLoading(false); here at the end because fetch is asynchronous,
    // it would start the fetch and immediately do to setIsLoading(false); at the end still waiting for the response
    // setIsLoading(false);
  }, []);

  // https is called also a SVGSwitchElement,then is domain, then path
  // in chrome developer tools -> we go to Network -> we have got "feedbacks" object -> we have a Response

  // fetch returns a promise -> fetch().then() promise.then()
  // you can use await promise in front of the promise
  // let's imagine you fetch an object (could be big) it takes time fo fetch, data is streamed in,
  // we get a response here, but it will just hold some metainformation about the network request's response,
  // response.json() will wait for the data to be streamed in, data is in the json format, we want to convert json to javascript object
  // we want to parse data as json immediately after it is streamed in, this json will give us another promise and we return that promise return response.json();

  ///--->> moved from FeedbackList.tsx to lift the state up

  return (
    <div className="app">
      <Footer />

      <Container
        isLoading={isLoading}
        // feedbackItems={feedbackItems}
        feedbackItems={filteredFeedbackItems}
        errorMessage={errorMessage}
        handleAddToList={handleAddToList}
      />

      <HashtagList
        companyList={companyList}
        handleSelectCompany={handleSelectCompany}
      />
    </div>
  );
}

export default App;
