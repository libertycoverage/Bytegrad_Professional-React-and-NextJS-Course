import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
//import { EventoEvent } from "@/lib/types"; //V242

//import { EventoEvent, PrismaClient } from "@prisma/client"; //V242 //V243
//const prisma = new PrismaClient(); //V243
// further in V243, instead upper import of PrismaClient and instantiating, we moved that to db.ts
import prisma from "./db"; //V243

//type ClassValue = string | boolean | null | undefined;
//type ClassValue = string | number | bigint | boolean | ClassArray | ClassDictionary | null | undefined
// we do not need to type ClassValue ourselves, clsx gives us a ClassValue type

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// V220
// We are using Tailwind-Merge to merge these CSS classes together, and before we were using clsx, so we can have nice syntax for conditional CSS classes.
//`Cn()` is a popular utility, popularised by shadcn UI, will allow to combine in one utility function (`twMerge` and `clsx` combined into one).
//`Cn` stands for `class names`. We will write that `cn()` function in `/lib/utils.ts`, so we do not have to work with `twMerge` and `clsx` independently, separately,
// it will be one utility function that we can use in both instances -> h1.tsx and header.tsx
// here we are using clsx for conditional classes, what if we want to use className passed as a prop to Header component?
// This clsx will not take care of it, we would also need to use Tailwind-Merge here, instead of that we are going to combine that in one utility function `cn()`
// `cn()` in `utils.ts`
// `cn` needs to group classes into an array, first `clsx` receives classes, with rest operator `...` we create an array, whatever we pass in,
// it just puts all of that in array called `classes` or `inputs`, we pass the array to `clsx`, the result of this, we are going to put that through Tailwind-Merge `twMerge(clsx(classes));`,
// and the result of that is what we return
// (`clsx` will be able to help with conditional classes, we will be able to use this syntax as in header.tsx, but we also want to be able to merge classes in case we have `className`
// as a prop coming in, it needs to be intelligent merging)
// We type `...inputs` as an array of `ClassValue` type -> `ClassValue[]`, instead of using general strings. We do not need to type ClassValue ourselves, clsx gives us a ClassValue type.
// Now we use `cn()` in h1.tsx nad header.tsx instead of `twMerge` and `clsx` separately.

// V230
// export function sleep() {
//   return new Promise((resolve) => {
//     setTimeout(resolve, 1000);
//   });
// }

// V230
export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

// V230 - Client-side cache in Next.js (Router Cache), sleeper function to emphasize the normally observed delay
// Let's talk a little bit about loading state and caching, if we click around we may notice that some parts of Next.js will be loaded slower than the other,
// sometimes it is very fast, but sometimes we have to wait a second or so for the page to be loaded. Sometimes it is a little bit slow.
//
// What happens when we click on a `Link` "All Events" and go to URL `localhost:3000/events/all`.
// What will happen it will render `/events/[city]/page.tsx`, this page is a server component, so there will be some network requests in the background to the server,
// and on the server EventsPage component gets rendered.
// With the network requests when we click on the `Link`, with the network request the params in URL `localhost:3000/events/all` will be available on the server,
// the URL will be just sent to the server, Next.js will take the `{params}` `EventsPage({ params }`, form that and give it to us in `EventsPage` component (all happening on server).
// Then we need to wait until the fetch call is complete, we make a fetch call to bytegrad.com server somewhere on the Internet, and that can take some time, this is the biggest blocker we could say.
// Then we eventually get the events, and EventPage component will produce (return) a final render result, and the result of that is send back to client and we see the result as page.
// We can see it can potentially take some time before we get a result with fetch and we get the result back from the server on the client. On the client it can take some time.
//
// To show the delay even better we are going to temporarily add a sleeper function `sleep()`. In `utils.ts` people sometimes use sleeper function in JavaScript,
// we can essentially use promises here, we `return` a `new Promise`, create a `new Promise`, we can decide when the `Promise` is resolved,
// we can give it arbitrary 1000ms, after that time `Promise` will be resolved
// When we call that function (we can make it async), it will take one second before function is complete
// To make it a little more fancy people also allow to add, use milliseconds as the input, instead of hardcoding 1 s (one second)
// We can await `sleep()` function, on the "events" page, now when we click on Link `/components/header.tsx` we have to wait until we get the result
// -> `/events/[city]/page.tsx`
//    export default async function EventsPage({ params }: EventsPageProps) {
//      const city = params.city;
//      await sleep(2000);
// ->
//
// When we go to the individual event `/event/[slug]/page.tsx` when we click on the  individual events (individual cards) on "All Events" page `/events/[city]/page.tsx`
// there is a network request in the background (we can see that in Network tab in developer tools in browser). This fetch call will take some time.
// When we create a fetch call, by clicking a Link it will go to our server where our server component is available (EventPage component) and it will render this component.
// Here we also take the params `EventPage({ params } (...) const slug = params.slug;` and it can take some time and that will produce the render result (`/event/[slug]/page.tsx`),
// and that is what is sent back to the client (browser), that is what we see eventually by going to individual page of an event  `/event/[slug]/page.tsx` `http://localhost:3000/event/harmony-festival`
// That can take some time, to show why it is a problem let's add a sleeper function to `EventPage()` component,
// it will just add additional time (2s) in waiting until we can continue with the rest of the component, (it will go line by line and just wait before it can continue)
// -> `/event/[slug]/page.tsx`
//   export default async function EventPage({ params }: EventPageProps) {
//     const slug = params.slug;
//     await sleep(2000);
//     const response = await fetch(
// ->
//
// What happens when we click on the card of event, there is a network request to the server, on the server we have server components, it needs to wait 2s while it is rendering,
// it makes a fetch call and that will also take some time, sometimes it can also take couple of seconds, eventually after couple of seconds on `return` it can start rendering everything,
// the result of that actually is not HTML, it is a React Server Component Payload, the payload is the actual render result, that payload gets send back to the front-end again,
// that is what we eventually see on the page opened in the browser (we are discussing `/event/[slug]/page.tsx`).
// The Payload will be sent to the front-end, the front-end receives the Payload an it will process it in such a way we get the final result.
// A little bit tricky, but what we want to point out here, especially when we go to production, because here server and the client are on the same computer,
// in real world server and the client are going to be separate, it could be very big distance between them.
//
// By adding additional 2 second everywhere, now when we go to some event using an event card interface it takes some time.
// Now because it takes some time Next.js has tried to optimize that for us. With normal time waiting for fetches and two-directional communication between client and server,
// we have to wait a little bit between network request. Next.js will help with that by caching.
// Certain parts are cached automatically so we do not have to make new network requests going back and forth e.g. EventsPage component will not be rendered.
// Whatever the result of the component is it will be sent to the client and Next.js will store it in the browser, caching it (client-side cache).

// ---- V238 begin of block
export function capitalize(string: string) {
  // input of the function -> string: (of type) string

  return string.charAt(0).toUpperCase() + string.slice(1);
}
// ---- V238 end of block

// V240
export async function getEvents1(city: string) {
  // V243
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
  );
  const events: EventoEvent[] = await response.json();
  return events;
}

export async function getEvent1(slug: string) {
  // V243
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
  );
  const event: EventoEvent = await response.json(); // <- V242 quick fix type
  return event;
}
// V240 end

// V243 Replace Fetch API With Prisma Client
export async function getEvents(city: string) {
  //prisma.eventoEvent.findMany(); // it will actually get all of the events
  const events = await prisma.eventoEvent.findMany({
    where: {
      // city city, // this solution does not work because of a lowercase city from params URL and uppercase in database
      //city: {     // this solution works
      //  equals: city,
      //  mode: "insensitive",
      //},
      //city: capitalize(city), // this solution also works, but does not for "city all"
      city: city === "all" ? undefined : capitalize(city),
    },
    orderBy: {
      date: "asc",
    }
  });
  return events;
}

export async function getEvent(slug: string) {
  const event = await prisma.eventoEvent.findUnique({
    where: {
      slug: slug,
    },
  });
  return event;
}
// V243 end

// V244 - Sort Events By Date (Prisma Sorting)
// If we look at the dates in "All Events" website, dates right now are random.
// When we get our data from the database, we get `events` (`utils.ts`). One thing that Prisma makes very easy is to do `orderBy: { }`. 
// We can order the results by e.g. `date`, we can say ascending `asc`.