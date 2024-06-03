import { EventoEvent } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type EventCardProps = {
  event: EventoEvent;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    // {event.name}
    <Link
      className="flex-1 basis-80 h-[380px] max-w-[500px]"
      href={`/event/${event.slug}`}
    >
      {/* <section className="flex flex-col flex-1 basis-80 h-[380px] max-w-[500px] bg-white/[3%] rounded-xl overflow-hidden relative transition hover:scale-105 active:scale-[1.02]"> */}
      {/* <section className="w-full h-full flex flex-col bg-white/[3%] rounded-xl overflow-hidden relative transition hover:scale-105 active:scale-[1.02]"> */}
      {/* V227 - Reusable Hover Effect (Tailwind @Apply Rule) (Trick to centralize Tailwind CSS classes shared by components) */}
      <section className="w-full h-full flex flex-col bg-white/[3%] rounded-xl overflow-hidden relative state-effects">
        <Image
          src={event.imageUrl}
          alt={event.name}
          width={500}
          height={280}
          // V229 - Fix Image Object Fit Vs Object Cover (Change image object fit to object cover.)
          // There is a problem with maintaining aspect ration in "All Events" view, the image tries to fit in regardless of aspect ratio in `/components/event-card.tsx`.
          // That is because in the `Image` component we were using `object-fit` className. Now instead of that we are using `object-cover` className,
          // it will cut some part of the image to retain aspect ratio, so it looks good in any size.
          //className="h-[60%] object-fit"
          className="h-[60%] object-cover"
        />
        <div className="flex flex-col flex-1 justify-center items-center">
          <h2 className="text-2xl font-semibold">{event.name}</h2>
          <p className="italic text-white/75">By {event.organizerName}</p>
          <p className="text-sm text-white/50 mt-4">{event.location}</p>
        </div>

        <section className="absolute flex flex-col justify-center items-center left-[12px] top-[12px] h-[45px] w-[45px] bg-black/30 rounded-md">
          <p className="text-xl font-bold -mb-[5px]">
            {/* {new Date(event.date).getDate()} */}
            {new Date(event.date).toLocaleDateString("en-US", {
              day: "2-digit",
            })}
          </p>
          <p className="text-xs uppercase text-accent">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </p>
        </section>
      </section>
    </Link>
  );
}

// V218 - Finish the EventCard component by wrapping it in a Link and adding a hover effect
// We want to have animations, when we hover these cards they grow a little big bigger, also when we click and hold down the mouse cards become a little bit smaller again.
// 1) We go to `<section>` `className`s in EventCard React component (holding Image, `<div>` with `h2` and 2 paragraphs, also holding a  section with date details),
// let's say in hover state it scales a little bit bigger (5%, relative it is 105%), `hover:scale-105`, and when we click down (and hold down) it should be a little bit bigger than in default idle state,
// but smaller than in hover state, custom value `active:scale-[1.02]` not 102, and we want transitions to be smooth `transition`
// 2) When we click the card for event we want to go to event page, we want to go to route e.g. `(localhost:8080)/event/jazz-fusion-night` notice `jazz-fusion-night` it is a slug fetched with API from database
// We can use `<Link>` component, we are going to wrap the entire card (entire `<section>`) in a `<Link>` component, we specify `href` for the component
// 3) Now when we save (`<Link>` component surrounding `<section>`) we will have an issue with layout, because we are here using flexbox, flexbox is always between parent element and it's direct child element,
// if you change or add something in a hierarchy, you change the layout. Right now when we click on the card we can go to the page from that route
// 4) To fix the layout we need to add `className` to `<Link>` component, we need to add layout properties that will determine the size form the `<section>` -> `flex-1 basis-80 h-[380px] max-w-[500px]`,
// we just need to add that to `<Link>` component (move `className`s from `<section>` to  `<Link>`).
// When we save that that should fix that, but not completely, the `<section>` need to take up the full space of `<Link>`,
// so in `className`s in `<section>` (holding everything, Image component etc.) we want to add `w-full` and `h-full`, so to take up all the space in this `<Link>`, now that should fix that

// V217 - Add the event date to the EventCard component and learn about the magic of Copilot.
// We want to implement date in the top left corner of the cards.
// 2) We have the date number and a three-letter abbreviation of the month. Let's hardcode it first and then we will make it dynamic.
// Describing `className`s,  `<section>` with date details should be absolutely positioned `absolute`, it should sit 12px from the left `left-[12px]`, and 12 pixels from the top `top-[12px]`,
// it should have a height of 45px  `h-[45px]` , and a width of 45 pixels as well `w-[45px]`. We are using a lot of custom values, because Tailwind CSS does not have the exact one e.g. `h-45`.
// Let's give it black background with 30% opacity `bg-black/30`. When we use absolute positioning `absolute` and then e.g. `left-[12px]`, `top-[12px]` we need to specify to which element the class refers to
// (top of what element exactly). We want to be explicit about it, it should be relative to the overall card, in this case we need to add `relative` to `<section>` responsible for creating `EventCard`.
// Furthermore we add border radius `rounded-md`.
// 3) Then we style individual paragraphs `<p>`, could also use `<span>`, first paragraph we give it `text-xl`, `font-bold`,
// second paragraph `text-xs`, all `uppercase`, this also should be in accent color `text-accent`,
// we want the t4ext from the paragraphs to be centered in that square, we use flexbox, `flex flex-col justify-center items-center` in `<section>` holding these two paragraphs,
// `flexbox justify-center items-center` to keep the vertical flow.
// We also want to push the number closer to the month, for the paragraph `<p>` holding the number we add negative margin (margin means space between elements),
// negative margin means it will come closer `-mb`, in Tailwind CSS we need to add minus sign, we want negative margin of custom 5px, `-mb-[5px]`.
// 4) Now instead of hardcoding values we need to get that from database (fetch), we need to output right date time for each event, we use `{event.date}`.
// `<p className="text-xl font-bold -mb-[5px]">{event.date}</p>` We have got an error "type Date is not assignable to type ReactNode", we cannot use date type because it expects ReactNode in between opening and closing tag,
// for some reason date time is not a part of that. So to work with date in JavaScript a little bit easier we can turn it into a date object (right now in here `{event.date}` it is a string),
// we turn into a new object `{new Date(event.date)}` now we get the date object, we can use certain methods on that `{new Date(event.date).getDate()}`- it will give us an actual day ,
// for some of these numbers e.g. when it is a single digit below 10 we want 0 (zero) to be in the front of a number (leading zero) so it will be two digits e.g. 01
// 5) How we would do that in a real world?
// We will use Github Copilot: "turn date into day of the month with leading 0", now we start typing word "event" and Copilot comes up with suggestion
// `{ new Date(event.date).toLocalDateString("en-US", {day: "2-digit",}) }`
// Copilot is really good in these types of algorithmic situations.
// Now copilot suggests in the paragraph for the month  `{ new Date(event.date).toLocaleDateString("en-US", {month: "short", })}`
// When you do not use  some kind of a AI copilot you are gonna fall behind these days.

// V215
// 5) For each event we still map over events, but we want to use `<section>{event.name}</section>` for the event card, we do not want to copy the key here

// V216
// In `EventCard` `<section>` will have a custom height of 380px `h-[380px]` and width `w-[500px]`
// Inside `<section>` we specify `<Image>` component, we give it source of the image `src={event.imageUrl}`, alt (default text) `{event.name}`, for height an 500px, height 280px,
// `<Image src={event.imageUrl} alt={event.name} width={500} height={280} />`,
// we set the height and width, but the image is still bigger than what we want, sometimes we need to setup with CSS, that may be confusing `<Image>` component in these scenarios,
// we want 60% of the height and then use object fit `<Image (...) className="h-[60%] object-fit">` because when we change the height and width like that, we are essentially changing an aspect ratio,
// we want it to retain it's aspect ratio so we use `object-fit`,
// we will also give card a background color of white with 3% opacity in `<section>` `bg-white/[3%]`, we give it rounded corners `rounded-xl`,
// bottom corners are rounded but the top rounded corners are overlapped with image which is rectangle and the top edges are not rounded - we need to add `overflow-hidden` -
// - now curved corners are visible on the top of the picture.
//
// With external images we need to go to `next.config.js` file and setup hostname under images, https://nextjs.org/docs/messages/next-image-unconfigured-host
// `next.config.js` -> We add to -> images: { remotePatterns: [ {}, { protocol: "https", hostname: "images.unsplash.com", }, ], },
//
// Let's give a `<div>` for holding a title (name), organizerName, location. `<div>` stands for divider, it is used in these types of scenarios where we want to group everything for styling reasons,
// it makes it easier to style, to get the layout that we want
//
// `<div>` should be below the image, it should be centered both horizontally an vertically,  so we can make it a flex container `flex`, by default we have `{event. }` sitting in the same row,
// that is not what we want, we want column layout `flex-col`, now vertical centering  `justify-center` and `items-center` for horizontal centering,
//
// notice when we used `justify-center` it did not center it vertically because `<div>` itself does not extend to the bottom of the `<section>`, it is also a layout issue,
// easy to solve with flexbox, if we make a parent container a `flex` container (now it will look strange, because both `section` and `div` will stay in the same row (but we want to keep a column layout)),
// we need both parent (`section`) and child `div` use `flex-col` className, now on flex item (`div`) we want to use `flex-1`, which means just grow `h2` and 2 `papagraphs` into area of `div`,
// now it will extend to the bottom of the card (where `section` and `div` ends), therefore vertical centering with `justify-center` also works.
//
// The elements can be both a flex item (`flex-1`) as well as the flex container (`flex`), it is a flex item in relation to it's parent element,
// but then itself it is also a flex container in relation to these elements (`h2` and 2 `paragraphs` in this case)
//
// Let's style `h2`, `text-2xl`, `font-semibold`, for the paragraph `italic`, and text of 75% opacity white colour `text-white/75`, another paragraph, text small `text-sm`,
// text of 50% opacity white colour `text-white/50`, margin of top spacing `mt-4`
//
// ### dynamic grid
// The events tiles are stacked in a column but we want a grid (3 columns by n rows).
// We are going to spread them out on a row, if there is no space for the 4th one, go to the next row, but when we go to the last page through the pagination it will display a little bit wider tile of an event.
// Also when we decrease the size of the viewport  we want to suddenly have a grid with a shrinken amount of columns to two and finally to one column,
// tiles for events also change their size when we make a viewport smaller in size. We want it to be responsiveness wise. We can do this with flexbox easily.
//
// How do we make this, right now when we look at the card (tile) we always make this of size 500 px, and they are always stacked on each other vertically.
// Let's start with making a parent element of these cards a flex container, so there will a be a horizontal flow, default in flexbox.
// What is a parent element of this `<section>` in `EventCard` React component,
// parent element of that is is a `<section>` in EventsList React component, in `EventsList` if we do `flex` on this `<section>` the tiles will sit in the one row.
//
// Further in EventsList we specify in the flexbox, we want cards that are allowed to wrap `flex-wrap`. There also should be a horizontal and vertical space between the tiles,
// instead of doing `gap-x-` `gap-y-` , we can make for all of them (both horizontal and vertical gap) `gap-10`. Card are aligned to the left right now, we can use `justify-center`.
//
// Right now cards are always of width 500px, we want to have responsive width.
// In event-card.tsx in `EventCard` component we have width of custom 500 pixels `w-[500px]` we do not want to use that anymore, but we can still set the maximum `max-w-[500px]` (at most, cards, tiles can be 500 pixels),
// then with flexbox what we can do is since `EventCards` are flex items in relation to the `<section>` in `EventsList`; in the `<section>` in `EventCard` we can add `flex-1`,
// means it will take one portion of the available space and they do not have any minimum, we can use this with combination with flex basis, in Tailwind it is gonna be `basis`,
// we can set up to some width `basis-80`, that is 320px, it will be like a minimum, but they (cards) are allow to grow bigger than that,
// they should be at least 320px but because of `flex-1` they should try to grow bigger, however not bigger than 500px (`max-w-[500px]`).
//
// Tiles (cards) are close to edges of the narrowed website, we can restrict a width of a cards a little bit more, in `EventsList` in `<section>` we make maximal width at 1100px `max-w-[1100px]`,
// in here we also add padding horizontal (if it is sitting against the edge it will make it smaller) `px-[20px]`
//
//
// ### flex-1 to make an an item a CSS Flexbox item
// the class `flex-1` is used to make an element a flex item and it is typically associated with CSS Flexbox layout. When you apply `flex-1` to an element, it sets the flex property of the element to `1 1 0%`.
/// Let's break down what this means:
// - **`flex-grow: 1;`**: This means the flex item will grow to fill the available space in the flex container, proportionally with other flex items that have the same `flex-grow` value.
// - **`flex-shrink: 1;`**: This means the flex item will shrink proportionally if there is not enough space in the flex container.
// - **`flex-basis: 0%;`**: This sets the initial main size of the flex item before any growing or shrinking happens.
// In combination, `flex: 1 1 0%;` makes the element flexible, allowing it to grow and shrink as needed to fit the space available in the flex container. It essentially means "take up an equal share of the available space."
//
// ###  `justify-center` and `items-center`  explanation
// Both `justify-center` and `items-center` are classes used in CSS frameworks like Tailwind CSS or in Flexbox layout in regular CSS.
// 1. `justify-center`: This class is typically used in conjunction with Flexbox layout. It horizontally aligns the flex items within a flex container along the main axis.
// So, if the main axis is horizontal (which is the default), it centers the items horizontally. If the main axis is vertical (using `flex-direction: column;`),
// then `justify-center` would center the items vertically. Essentially, it applies `justify-content: center;` in Flexbox, which centers the flex items along the main axis.
// 2. `items-center`: Similarly, this class is also used in Flexbox layout. It vertically aligns the flex items within a flex container along the cross axis.
// So, if the main axis is horizontal (default), `items-center` would vertically center the items. If the main axis is vertical, then `items-center` would horizontally center the items.
// Essentially, it applies `align-items: center;` in Flexbox, which centers the flex items along the cross axis.
// Here's a breakdown:
// - `justify-center`: Centers items horizontally along the main axis.
// - `items-center`: Centers items vertically along the cross axis.
