import { TriangleUpIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { TFeedbackItem } from "../../lib/types";

// exporting props e.g. upvoteCount
// export default function FeedbackItem({ feedbackItem }) {
{
  /* what if we are passing an upvoteCount like before */
}

// export default function FeedbackItem({ props: {upvoteCount: number;}}) {

// type FeedbackItemProps = {
//   upvoteCount: number;
//   badgeLetter: string;
//   companyName: string;
//   text: string;
//   daysAgo: number;
// };
// export default function FeedbackItem(props: FeedbackItemProps) {
// export default function FeedbackItem({
//   upvoteCount,
//   badgeLetter,
//   companyName,
//   text,
//   daysAgo,
// }: FeedbackItemProps) {

// type FeedbackItem = {
//   upvoteCount: number;
//   badgeLetter: string;
//   companyName: string;
//   text: string;
//   daysAgo: number;
// };

//this could technically work also instead of this type FeedbackItemProps = { feedbackItem: FeedbackItem };

// type FeedbackItemProps = {
//   feedbackItem: {
//     upvoteCount: number;
//     badgeLetter: string;
//     companyName: string;
//     text: string;
//     daysAgo: number;
//   };
// };

// typescript is going to warn us when we want ot use a method that does not belong to specified type e.g. feedbackItem.daysAgo.split()
// does not exist for number type

type FeedbackItemProps = {
  // blabla?: number; // in feedbackList blabla, ? question mark -> optional
  feedbackItem: TFeedbackItem;
};
// now we have a type feedbackItem which is by itself an object, we are going to create separate type for feedbackItem

// prop feedbackItem
export default function FeedbackItem({ feedbackItem }: FeedbackItemProps) {
  const [open, setOpen] = useState(false);
  // if it is open we want to add css class, we are manipulating css with changing the className

  const [upvoteCount, setUpvoteCount] = useState(feedbackItem.upvoteCount);
  // we initialize the state with whatever is in FeedbackItem

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setUpvoteCount((prev) => ++prev);
    // {/* it is not prev++ this returns and then increments, ++prev this will increment and then return */}
    // after one upvote we want to disable the button
    e.currentTarget.disabled = true;
    // currentTarget is different than e.taget for example in <button onClick={(e) => handleUpvote}></button>
    // you click you can technically be clicking on the icon <TriangleUpIcon /> instead of the span <span>{upvoteCount}</span>,
    // technically position the mouse right on top of the icon and that would mean that the e.target is gonna be the icon,
    // and we do not wanna disable that one, we want disable the button here <button onClick={(e) => handleUpvote}></button>
    // so here when we wanna get the element that actually has onClick we can use currentTarget

    e.stopPropagation();
    // we want to add to upvote and also prevent bubbling upwards an event higher up the DOM tree, we can use the event object
    // when we want to know the type of that e we write <button onClick={(e) => handleUpvote}> and hover over e
  };

  return (
    // when you click on li it should open or close it
    // <li className="feedback">
    <li
      onClick={() => setOpen((prev) => !prev)}
      className={`feedback ${open ? "feedback--expand" : ""}`}
    >
      <button onClick={handleUpvote}>
        {/* it is not prev++ this returns and then increments, ++prev this will increment and then return */}
        {/* we have an issue here when we click a upvote button it will toggle text to open or closed
        that is because whenever there is click on the button <button onClick={() => setUpvoteCount((prev) => ++prev)}>
        there is an event the bubble onwards, it originates here in the button then it will go up and there is other onClick just above onClick={() => setOpen((prev) => !prev)}*/}
        <TriangleUpIcon />
        {/* <span>{feedbackItem.upvoteCount}</span> */}
        {/* <span>{props.upvoteCount}</span> */}
        {/* <span>{upvoteCount}</span> */}
        <span>{upvoteCount}</span>
      </button>

      <div>
        {/* <p>{feedbackItem.badgeLetter}</p> */}
        {/* <p>{props.badgeLetter}</p> */}
        {/* <p>{badgeLetter}</p> */}
        <p>{feedbackItem.badgeLetter}</p>
      </div>

      <div>
        {/* <p>{feedbackItem.companyName}</p>
        <p>{feedbackItem.text}</p> */}
        {/* <p>{props.companyName}</p>
        <p>{props.text}</p> */}
        {/* <p>{companyName}</p>
        <p>{text}</p> */}
        <p>{feedbackItem.company}</p>
        <p>{feedbackItem.text}</p>
      </div>

      {/* <p>{feedbackItem.daysAgo}d</p> */}
      {/* <p>{props.daysAgo}d</p> */}
      {/* <p>{daysAgo}d</p> */}
      {/* <p>{feedbackItem.daysAgo}d</p> */}
      <p>{feedbackItem.daysAgo === 0 ? "NEW" : `${feedbackItem.daysAgo}d`}</p>
      {/* when zero then NEW otherwise d */}
    </li>
  );
}
