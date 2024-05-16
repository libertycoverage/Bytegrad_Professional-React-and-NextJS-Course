import H1 from "@/components/h1";
import { EventoEvent } from "@/lib/types";
import React from "react";

// V212
type EventsPageProps = {
  params: {
    city: string;
  };
};

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

export default async function EventsPage({ params }: EventsPageProps) {
  const city = params.city;

  const response = await fetch(
    "https://bytegrad.com/course-assets/projects/evento/api/events?city=austin"
  );

  const events: EventoEvent[] = await response.json();
  console.log(events);

  return (
    <main className="flex flex-col items-center py-24 px-[20px] min-h-[110vh]">
      {/* // V212 */}
      {/* <H1>Events in {params.city}</H1> */}
      <H1>
        {/* Events in {city.charAt(0).toUpperCase() + city.slice(1)} */}
        {city === "all" && "All Events"}
        {city !== "all" &&
          `Events in ${city.charAt(0).toUpperCase() + city.slice(1)}`}
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

      {events.map((event) => (
        <section key={event.id}>{event.name}</section>
      ))}
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
