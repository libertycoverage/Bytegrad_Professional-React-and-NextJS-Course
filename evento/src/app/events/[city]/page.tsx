import EventsList from "@/components/events-list";
import H1 from "@/components/h1";
//import { EventoEvent } from "@/lib/types";
//import { sleep } from "@/lib/utils";
import React, { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import { capitalize } from "@/lib/utils";

// V212
// type EventsPageProps = {
// V238
type EventsPageAndMetadataProps = {
  params: {
    city: string;
  };
};

// V246
type EventsPageOnlyProps = EventsPageAndMetadataProps & {
  searchParams: { [key: string]: string | string[] | undefined };
};

// ---- V238 begin of block
// export const metadata: Metadata = {
//   title: "Events in Austin",
// };
export function generateMetadata({
  params,
}: EventsPageAndMetadataProps): Metadata {
  const city = params.city;

  return {
    // title: `Events in ${city}`,
    //title: `Events in ${capitalize(city)}`,
    title: city === "all" ? "All Events" : `Events in ${capitalize(city)}`,
  };
}
// ---- V238 end of block

// V213
// Below the `H1` we want to have a list of events displayed in the grid (mapping over)
// We need to get these events from somewhere, these events can be in our own database, for now let's say we have a third party that has collected that information for us and we fetch with API
// Previously we have use useEffect or Tanstack React-Query, however with Next.js we have server component, we do not have useEffect to do that, we can fetch directly.
// We make function of a component `async` then `await fetch()` inside the function
// We will use that link from resources repository for evento project https://bytegrad.com/course-assets/projects/evento/api/events, this alone will not return anything.
// We add last piece `?city=austin` to the end of the fetch URL, we need to specify for which city we want events, we add "search parametres" or "query parametres", "query params"
// The `response` will not be the actual data, before we get the actual data we have to wait a little bit, we want pass that data immediately as JSON
// `const data =  await response.json();`, meaning convert it from JSON to normal JavaScript
// Remember this is a server component, this component (`EventsPage`) does not run in the browser, if we want to log something we need output from the terminal as we run development server with `npm run dev`
// Analysing a fragment of output from development console `npm run dev` (server components console log): slug is what we want use for URL (slug is a part of URL)
// We want to show the data, we are going to map over that, in this case we want to have a card for each event.
// We need to add key because we are mapping `key={event.id}` because the key has to be unique
// Benefits of fetching with server components: (Here in Next.js if we make a GET request, or getting data or fetching data, it is recommended to do it in a server component.)
// 1) This is one of the benefits of server components, we can fetch data directly in the function body on the server side, we get some data, we render output on the server meaning
// all of the code in the function body only runs on the server, and that will be returned to client (render result), so we can see it.
// We do not need useEffect anymore or Tanstack React-Query, we can use native fetch API directly in the function body (or axios).
// 2) We do not need useEffect anymore or Tanstack React-Query, we can use native fetch API directly in the function body (or axios).
// 3) One of the benefits of that is since it runs on the server side somewhere we can make it so that this `fetch` happens close to the database, fetch call would be very fast as well.
// 4) Another benefit of fetching in server component is that all of the code related to that can stay on the server, so it reduces client-side bundle, JavaScript that has to be shipped to the client can be smaller
// 5) Another benefit of fetching in server component is sometimes we need some API key, so if this was third party API, we need to specify secret key in the URL, so we can identify,
// on the client that would be an issue, so we would have to create separate API and then we would have to do it through that. Now using fetch in server component,
// we can put secrets in here that won't be visible on the client, on the client only the result of rendering will be visible, we can have API keys as well and other secrets.

// ---- V238 begin of block
// export default async function EventsPage({ params }: EventsPageProps) {
export default async function EventsPage({
  params,
  searchParams, //V246
}: //}: EventsPageAndMetadataProps) {
EventsPageOnlyProps) {
  // ---- V238 end of block
  const city = params.city;
  const page = searchParams.page || 1; //V246
  //useSearchParams(); // <- usage of that forces to use client component, we do not that, we are not going to use that, instead we use searchParams prop // V246

  // V230
  // V235 cutout // V230 await sleep(2000);

  // V235 cutout //
  // V235 cutout // const response = await fetch(
  // V221 // "https://bytegrad.com/course-assets/projects/evento/api/events?city=austin"
  // V221 - Fetch Events For Correct City
  // Problem that when we go to `localhost:3000/events/seattle` we do not see events from Seatte but Austin, that is because we hardcoded the URL for fetching the data of events to that city Austin
  // Let's change quotes with template literal. We do need to make sure `const city` is initialized before we are using `city` in query params while fetching `Error: Cannot access 'city' before initialization`
  // V235 cutout // `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
  // V235 cutout // );

  // V235 cutout // const events: EventoEvent[] = await response.json();
  // V235 cutout // console.log(events);

  return (
    <main className="flex flex-col items-center py-24 px-[20px] min-h-[110vh]">
      {/* // V212 */}
      {/* <H1>Events in {params.city}</H1> */}
      <H1 className="mb-28">
        {/* Events in {city.charAt(0).toUpperCase() + city.slice(1)} */}
        {city === "all" && "All Events"}
        {city !== "all" &&
          // ---- V238 begin of block
          // `Events in ${city.charAt(0).toUpperCase() + city.slice(1)}`}
          `Events in ${capitalize(city)}`}
        {/* // ---- V238 end of block   */}
      </H1>

      {/* // V214
      // We get the warning from TypeScript, `(event)` is red underlined because we haven't typed this `event`, by default it is types as any `const events: any`, 
      // that is a little bit risky, we could try to access something that does not exist `event.blahblah` and we do not get a warning
      // Typically we have a separate file that holds all of types, we create a separate folder named `src/lib/` , here we have  file`types.ts`
      // Type `Event` as a name may clash with something that already exists within type definitions
      // We type (type `EventoEvent`) based on the output from development console `npm run dev` (server components console log)
      // `events` are typed as an array `EventoEvent[]` `const events: EventoEvent[] = await response.json();`
      // Now the red squiggly lines (red underline for warning) on `(event)` (where we map over) are gone. Now TypeScript infers the type of `(event)` as `(parameter) event: EventoEvent`
      // Now when we try to access something that does not exist e.g. `event.blabla` we get TypeScript warning, also we get intellisense when we try to access `event.` 
      // to see what properties are available (To invoke intellisense on access "CTRL + SPACE" on Windows/ Mac OR "Option(Alt) + Esc" on Mac)  */}

      {/* {events.map((event) => (
        <section key={event.id}>{event.name}</section>
      ))} */}
      {/* // V215
      // 1) Here, below, we are mapping over, but it is cleaner to have a separate component that will list out events, we will create `<EventsList events={events} />`, and will pass events to that component  
      // 2) we create this component in file named `events-list.tsx` with lower case, a component still needs uppercase name `export default function EventsList() {` 
      // Naming convention of files -> in Next.js there is a convention to use lower case for everything (any file), in React Vite app there is a convention with upper case naming for file names.
      */}

      {/* // V235 -> We are not passing events as a prop to EventsList component anymore  */}
      {/* <EventsList events={events} /> */}
      {/* // V235 -> We are not passing events as a prop to EventsList component anymore  */}
      {/* <Suspense fallback={<Loading />}> */}  {/* V247 */}
      <Suspense key={city + page} fallback={<Loading />}> {/* V247 */}
        <EventsList city={city} page={+page} /> {/* V246 {page} */}
      </Suspense>
    </main>
  );
}

// V211
// 1) We want to have centered `H1` in EventsPage, let's do that with flexbox className `flex`;
// 2) right now we have only `H1` but we are going to have list of events also, if we use only `flex` they are going to sit next to each other horizontally,
// but we want them to be next to each other vertically (keep vertical flow), we use `flex-col`;
// 3) now we can center them horizontally with `items-center`;
// 4) Remember with flexbox we have `align-items`(y) and `justify-content`(x) and they switch (x switches with y) when you use "column flex" `flex-col`
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container
// 5) add padding both top and bottom `py-24`
// 6) also add padding horizontally when the viewport gets smaller `px-[20px]`and the content won't sit against the edge
// 7) add a scrollbar here, minimum height of the field will be 110% of the viewport `min-h-[110vh]`, there appears a scrollbar
// 8) scrollbar does not look great, let's style the scrollbar, this is a good example of something we cannot easily do in Tailwind right now
// 9) let's style the scrollbar, we can actually do that in CSS, in CSS `global.css` file we get from Next.js, this is where we should put a style for that
// (this is something we got from resources in repository to evento project;
// width; scrollbar-track it is the entire thing of scrollbar, a background; scrollbar-thumb it is the bar we click and hold when moving the scrollbar up and down;
// scrollbar-thumb:hover when we hover over thumb), for Firefox it needs to be slightly different
// --
// Give every page a scrollbar, no horizontal shift ->
// 10) Something that can be disliked when using scrollbars is the shift of the page when scrollbar appears on the side (right or left),
// that happens when you click on some other page that does not have enough content in length of the site to enable sidebar on the side and then again on the site with long-enough content.
// 11) One thing to prevent this is to give every page a scrollbar. What we can do is go to the `<body>` in layout.tsx and in there add className `overflow-y-scroll`,
// when we do that scrollbar, at least the track will appear on every page (almost not noticeable).
// Now when we switch back and forth between pages, there is no layout shift due to scroll bar.

// V212
// 1) We have a `H1` in EventsPage, we want dynamic title to show a city based on URL (URL is based on the search result). Previously we used `usePathname()` to know the active link,
// `usePathname()` will give `/events/miami`, we could use that, the downside is that it is a hook, that would mean we would have to change EventsPage to a client component (we can use this hook in a client component),
// and that is not what we want, especially on the page component, everything would be affected by that on the page.
// 2) There is another way to get URL details, we can keep this a server component, Next.js will give it in page component, this will not work on any server components, only in this page component.
// There is something called `params`, and that is what we put in square brackets in route e.g. `/events/[city]`. We get params as a prop.
// Example -> Whatever name we are giving to square brackets in dynamic route `/events/[name]/` catalog, when we pass `params` we may use in that component `{params.name}
// We want to type `params`, what `params` is? Here we need to look up the documentation of Next.js. "next.js params type" https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
// 4) The downside is that city is displayed here with small case (based on city in URL, that is a small case always), we want to display city with the upper case `Events in austin`,
// if we capitalize the first character in CSS going to `H1` changing the style that would also mean that also `In` would be capitalized, and that is not what we want.
// We will capitalize the first letter of the city with JS.
// Maybe instead of working with params directly in the title it would be better to extract `const city = params.city;` and then `<H1>Events in {city}</H1>`
// We cannot use `{city.toUpperCase()}` because that would capitalize all letters to `AUSTIN`.
// We want to take first character at index zero, and that is the one we want to uppercase on (that will only produce the first character e.g. `A`),
// then we want to concatenate this one big letter with the rest of the word (slice from the first character onwards to the end of the word) `{city.charAt(0).toUpperCase() + city.slice(1)}`
// 5) Now when we go to the `http://localhost:3000/events/all`  we want to display all events but not to show title `Events in All`,
// we can have conditional logic here, when the city is all `city === 'all'` we want to display `All Events` and when it is not `all` we want this condition in template literals

// V235 - EventsList Suspense (and streaming) (Advanced Pattern For Data Fetching) - (Description: Fetch data in a component and wrap it in Suspense.)
// We have added the loading state using skeletons. Now if we go to "All Events" we the loading indicator (using array of SkeletonCards), but it is blocking a whole page,
// meaning we also do not see `H1` telling "All Events".
//
// If we go to that `/events/[city]/page.tsx` with EventsPage component we can see we have used EventsList component and it needs data we are fetching,
// EventsPage also is using `<H1>` and it does not need the data, ideally when we go to that "All Events" page we can immediately show the `H1` telling "All Events",
// so the user knows that is on the right page, or when we go to Austin, it can immediately show "Events in Austin" and SkeletonCards array below for the actual data we are waiting for.
//
// But now the way we have done it, it gonna fetch the data in EventsPage server component and everything is affected by that, because that `/events/[city]/loading.tsx` file,
// that will just wrap a `Suspense` around the entire `Page`, so everything on the page.tsx is going to be affected by that.
// Even though this `<EventsList events={events} />` is the only one that really needs that data.
//
// This fetching of data is now blocking the rest of the page. We do not want to block the whole page, because we can already show the `H1` with the title,
// we do not need to wait for that (it should be able to immediately show the `H1`) while fetching the data and waiting rest of the page to load.
// What we are going to do is to to put data fetching inside EventsList component, we will also put `await sleep(2000);` in there.
// So it can already return this `H1` and other components we may have on the page, it can show that faster, and then until the data is fetched and EventsList can render
// and show the result of that data.
//
// To EventsList component in events-list.tsx we are moving from EventsPage `/events/[city]/page.tsx` this:
// ```tsx
//   const response = await fetch(
//     `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
//   );
//   const events: EventoEvent[] = await response.json();
//   console.log(events);
// ```
// in `/events/[city]/page.tsx` we do not need passing `events` to `EventsList` component as a prop anymore `{/* <EventsList events={events} /> */}`.
//
// in events-list.tsx
// EventsList is a server component so we can make `async`. To fetch the data EventsList does need to know `city` we are on (part or a query params),
// `city` needs to be passed as a prop to `<EventsList />` component in `/events/[city]/page.tsx`.
//
// ### pattern in Next.js -> move down data fetching to a child component, loading moved down to a child component to not to block the whole page
// This is a common pattern in Next.js btw. where we are going to move down data fetching to a child component, because if we put at a page.tsx level, it blocks the entire page.
//
// The benefit is that we are doing data fetching in `EventsList()` component, all of the waiting is concentrated in this component,
// so now we can wrap EventsPage component in `/events/[city]/page.tsx` in a `Suspense`
//
// Now the whole page.tsx is not blocked anymore, it is only this component `<EventsList city={city}/>`, it will just stream in a little bit later,
// and in the meantime we can already show `H1` and possibly other components that we would have on the page.
//
// If we do not provide "loading indicator" as as a `fallback` in `Suspense` we will not see that loading indicator (made with SkeletonCards),
// we should provide loading indicator as a `fallback`. While we are waiting for that, while EventsList is fetching the data, finally rendering,
// while we are waiting for that, we can show `fallback`, we want to show `Loading()` component in `loading.tsx`.
// Now it should show loading indicator in place of that EventsList (! not in the place of a whole page), but everything else can already be shown.
// Now we can see loading indicator (that is using SkeletonCards) and the `H1`.
//
// That is a pretty smooth UX user experience, this is much better than we had before (with loading.tsx blocking a whole page),
// and this is coming to be very common pattern in Next.js, because if you fetch the data at a page.tsx level, you are blocking everything on the page.
// You are going to see a lot of fetching moving down into the components that it is actually needed.
// Mind these imports ! `import React { Suspense } from "react"; import Loading from "./loading";` -> `/events/[city]/page.tsx`
//
// In browser devtools in network tab (Response tab inside Network tab), if we go to e.g. `localhost:3000/events/all` and in the devtools we go to main document,
// we can see in the initial response (HTML) we got from the server we can see we have `<body>`, `<header>`,
// then we go to our page, in `<main>` we have `<h1>` , then we have something with `<template>` and in the `<div>` we can see class `space-y-4` and `animate-pulse`, this is from skeletons.
// In the initial page load in the `<main>`, it is going to give us loading indicator (`{<Loading />}` from the `fallback`) ,
// and then while this is happening in the background (fetch within `<EventsList>`), it is going to show us a loading indicator `<Loading />`,
// but eventually `EventsList` component has finished fetching data, has finished rendering, and the result of that rendering will then be **streamed** to the front-end
// and that will replace the initial loading stuff in the actual HTML document in the browser that we get
//
// There is Suspense (component) and streaming, it does not need to do reload of the page, it is just one part on the page that Next.js can swap out by streaming in the result.
// This is something that we couldn't do even year ago (2022-2023) or so.

// V236 - Advanced Pattern: Data Fetching Wrapper Component For EventsList
// (Description: An Advanced pattern for data fetching in Next.js would be to create a data fetching wrapper component in order to keep the reusability of EventsList intact.)
//
// In EventPage we are still fetching the data at a page level `/event/[slug]/page.tsx`, so all of the website will be blocked here
// until fetching event data will be finished, but here in `/event/[slug]/page.tsx`, we do not have a choice,
// basically whole page needs `event` (`const event = await response.json();`), we can leave this in code of that page.tsx as it is,
// we are blocking everything but on purpose, everything needs that `event` data.
//
// In events-list.tsx we are fetching data into `EventsList` component.
// One downside is that if we want to use `EventsList` component somewhere else, (maybe we allow user to bookmark these events,
// and we want to use this `EventsList` component to show all of the bookmarks, somewhere else in the website).
// The problem is that we have fetch call in there, it does make the component less usable, because every time we want to use that,
// we have fetch call there and it needs `city` as the query parameter. Maybe we have a list of events that has nothing to do with `city`,
// we could just show the bookmarks using EventsList.
// The downside of moving data fetching down is (if you do in this events-list.tsx component at least),
// it is going to reduce reusability of the component. If we want more advanced pattern perhaps, we could a separate component between here,
// some kind of a wrapper component, (to-do here) ->
// `/events/[city]/page.tsx`
// ```tsx
//       <Suspense fallback={<Loading />}>
//         <EventsList city={city} />
//       </Suspense>
// ```
// and anything that component would do is just fetch data and then it would pass down data to `EventsList`.
// Data fetching wouldn't be in this component (`EventsList`), it would be in some wrapper component, and then we would have the reusability
// of `EventsList` component intact. That would be a little bit more advanced, that would be something we would like to do,
// but for now we will keep that simple.
