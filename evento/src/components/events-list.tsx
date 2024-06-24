import { EventoEvent } from "@/lib/types";
import React from "react";
import EventCard from "./event-card";
import { getEvents, sleep } from "@/lib/utils";
import PaginationControls from "./pagination-controls"; // <- added V246

// V235 -> we do not need events accepted as a prop in events-list.tsx, we fetch it in events-list.tsx
// type EventsListProps = {
//   events: EventoEvent[];
// };
type EventsListProps = {
  city: string;
  page: number; //V246
};

// export default function EventsList({ events }: EventsListProps) {
// V235 -> we do not need events accepted as a prop in events-list.tsx, we fetch it in events-list.tsx
export default async function EventsList({ city, page }: EventsListProps) {
  await sleep(2000); // V235 moved here //

  // V240 commented out - begin
  // V235 moved here //
  //const response = await fetch(
  //  `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`,
  // {
  //   cache: "no-cache",
  // }
  // OR UP OR DOWN
  //  {
  //    next: {
  //      revalidate: 300,
  //    },
  //  }
  //);
  // V235 moved here //

  //const events: EventoEvent[] = await response.json(); // V235 moved here //
  // V240 commented out - end

  // V240
  //const events = await getEvents(city); //V246
  // const events = await getEvents(city, page); //V246
  const { events, totalCount } = await getEvents(city, page); //V246

  //const previousPath = `/events/${city}?page=${page - 1}`; //V246
  const previousPath = page > 1 ? `/events/${city}?page=${page - 1}` : ""; //V246
  //const nextPath = `/events/${city}?page=${page + 1}`; //V246
  const nextPath =
    totalCount > 6 * page ? `/events/${city}?page=${page + 1}` : ""; //V246

  console.log(events); // V235 moved here //
  // V235 moved here //

  return (
    <section className="max-w-[1100px] flex flex-wrap gap-10 justify-center px-[20px]">
      {events.map((event) => (
        // <section key={event.id}>{event.name}</section>
        <EventCard key={event.id} event={event} />
      ))}
      {/* //V246 */}
      <PaginationControls previousPath={previousPath} nextPath={nextPath} />
    </section>
  );
}

// V215
// 3) import @ naming -> We are using `@`, for import paths e.g. `import { EventoEvent } from "@/lib/types";`
// We would have to look up the folder structure and do `import { EventoEvent } from "../../lib/types";`
// Now we have `@` and `"at"` will always start at the `./src/` of directory and then it will search deeper in the folder structure, imagine that it is equal to `./src/lib/types`
// When we start new Next.js project it asks for the convention of imports (if we want to change the default `@` to the second option), it is configured in `tsconfig.json` -> "paths": { "@/*": ["./src/*"] }
// 4) Especially with Next.js we want to split things up into a separate components quickly, because let's say we have a click event on `EventCard`,
// now only `EventCard` needs to become a client component, if we would do it in `EventsList` now this entire thing `EventsList` needs to become a client component and maybe other things would be affected by that
// 6) We can use a key on our own custom component, we need to pass the entire `event` to the card, in `EventCard` we accept `event` as a prop
// 7) We fetch the data on the page.tsx, we pass that to `<EventsList />` component, this list component receives these events, it just map over them, and pass the individual events to `<EventCard />` component,
// this component will receive the actual event object and create the card

// V237 - Data Cache And Revalidate (Description: Learn about the data cache and revalidate options in Next.js.)
// ### Router Cache - Next.js
// Next.js on the client, once we have been there, once it has been loaded, will store that result in a cache (it will cache that),
// so the next time we need that it will first check if it is already in that cache, it is a client-side cache in the browser. We can get rid of that cache by refreshing the page (F5).
//
// What we can also notice is when we refresh the page in the browser it is also instant, how is that possible? When we refresh client-side cache is gone,
// but still when we refresh the page it is still instant. We do not see loading indicator when we refresh.
// That is because it is even more caching going on. Next.js is really aggressively caching a lot of things. We do not have to do it ourselves, that is done automatically in many ways.
//
// That is what is actually happening with fetch call in events-list.tsx, we are fetching events, we have client-side cache which is basically the rendered result of a server component,
// that is what will be stored on the client-side, but when we refresh that is gone, but there is additional cache here which called DATA CACHE, and that is the result of the fetch call.
//
// ### Data Cache - Next.js
// When we are working on Next.js and the goal is to cache a lot of things, what we can do, when we see server components and there is some fetch call, some data is being fetched,
// the first time we have to make a network request to GET the data, there is a `response`.
// But next time when it is another fetch request to the same URL, we do not need to send the network request, we can just reuse the result from the previous fetch call.
// That is called Data Cache in Next.js. By default if we are using Fetch API in a server component, the result (the `response`) is going to be cached.
// Next time when we go to the same website the result is cached, it will use the same result, it will not send new network request to get
// data from other server somewhere on the Internet. Fetching alone can take a long time, 1s or 5s or if there is a problem it could be 10s.
// This is a place in our app (`fetch`) where we can have a lot of delay and latency, it makes sense that Next.js tries to minimize that problem.
// It caches the result (response) of the fetch by default.
//
// ### `no-cache` option for Fetch API
// We can actually change this (so caching of fetching result is not default), we can opt-out from this, what we can have an object and define `fetch_URL { cache: "no-cache", }`.
// This is something that Next.js has added to Fetch API (we cannot do that outside Next.js). With `no-cache` it will be refetched every time, making a network request each time will take some time.
// In the case of evento project we will see loading indicator each time (child component (`EventsList`) is wrapped with `Suspense` with `Loading` component on fallback).
//
// Caching is probably the most complex topic in Next.js. Data Cache is a server-side cache, when we fetch on a server component, server-side cache is used.
//
// In evento project we will use the default cache.
//
// ### define default behaviour of cache for Fetch API
// The problem of default use of cache when using `fetch` is that we will always get the same response, what if we add a new event?
// We cached it so the page is not gonna see that, it is not going to get the new event, we reuse the same response over again.
//
// One thing we may want to do here instead of caching 100% essentially, we can be more specific, we can set `, { next: { revalidate: 300, }, }`.
// The meaning of `300` is 5 minutes (5 times 60 s), this result of a `fetch` should be cached only for e.g. 5 minutes.
// After five minutes when we go tho the page again it will fetch information again. This is sensible caching strategy for the `fetch`ing use case.
// Because, we do want to cache the fetch result, because this is the data that does not change that often, we can happily cache that, but sometimes it will change,
// so by default it should cache by defined number of seconds, and after that time if something changes it will automatically pick that up.
