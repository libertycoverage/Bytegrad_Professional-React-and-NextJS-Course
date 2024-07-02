## V248 Zod Validation In EVENTO For Incoming Data, Error.tsx page (file)
Description: Use Zod to validate incoming data into the app.

Whenever we get the data into our app, that is often where things can go wrong. When we write some gibberish e.g. `http://localhost:3000/events/gibberish` we get a page for "Events in Gibberish", there is no such city of course.

This is not necessarily a problem, this is not crashing our application.

If we look at events page `/events/[city].page.tsx`, we read this `const city = params.city;` city from URL params, this is some external data that we are getting into our application. We are getting this from URL, and typically when we get data to the app, we want to be a little bit more vigilant, we want to have extra checks perhaps for some robustness.

It really depends on how robust we want to be. We could validate `city` even more, we could make sure it does not have any weird characters, it depends on how robust we want app to be, depends on what type of application it is going to be. If it is a banking or financial type of application we want to have maximum robustness. Every incoming data, if it is `params` or `searchParams` (in URL), or anywhere else, we are also going to have a search form, anywhere where we are going to get external data into the app is where we want to validate. 

We may validate with something called Zod.

## Error.tsx page (file)

But here for `city` we can move on from here `http://localhost:3000/events/gibberish`, it does not give any errors.

Now we have page number as well. What will happen when we change page to `0` (zero) `http://localhost:3000/events/all?page=0`, now we are crashing the application

Actually there is a special file for that as well `/src/app/error.tsx`

Just like with loading, loading is wrapping automatically a `Suspense` around the `page.tsx`. With `error.tsx` we are getting `<ErrorBoundary />` wrapped around the app as well.

When there is an error thrown that we are not catching we will display this `error.tsx` page.

We have copied an example that Next.js gives in documentation, an example of an `Error()` component

`error.tsx`
```tsx
'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  )
}
```


little changes for `error.tsx`, usage of `H1` component, margin bottom 5 `mb-5`; `div` surrounding paragraph turned to `main`, added `text-center` and padding vertical 24 `py-24` 
```tsx
'use client' // Error components must be Client Components
 
import H1 from '@/components/h1'
import { useEffect } from 'react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <main className='text-center py-24'>
      <H1 className='mb-5'>Something went wrong!</H1>
      {/* <H1>{error.message}</H1> */}
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  )
}
```

Apart from the paragraph, we got "Try again" button, when we create a function called `Error`, Next.js will give us a reset function, we can create a button out of that, when we click it will try to `reset`, re-render that path (route, URL).

With `http://localhost:3000/events/all?page=0` `reset` does not change anything, the route itself has a problem with number (page) zero `0`, however this a better UX user experience than what we had before, now the user still can go to the homepage, or to any other page. It won't crash the entire application.

In `error.tsx` file we can do other things as well, for example we can sent the `error`. The `error` object we get here will not have anything really interesting in there, because when we have an error on the server, that we did not catch,

for example in `utils.ts` we are fetching data from Prisma in `getEvents`, here we have number `0`, this `getEvents` is throwing an error, and this is happening on the server. 
Here this `Error()` component in `error.tsx` must be a client component `'use client';`
So Next.js will send the error to the frontend, but before it does so it will strip the error from sensitive information, because we can imagine that we are throwing errors with database, database may actually leak some sensitive information.

So the `error` we are going to get `Error({ error, reset, }` is stripped of a a lot of information, it is not going to be that interesting.

If we want that we can display `<H1>{error.message}</H1>` instead of "Something went wrong" `<H1 className='mb-5'>Something went wrong!</H1>`

Now on the page we have something like this as error message.
```
# Invalid `prisma.eventoEvent.findMany()` invocation: Error in query graph construction: AssertionError("Invalid value for skip argument: Value can only be positive, found: -6")
```
In development it is going to have more information that in production, so maybe in development we can solve issue a little bit faster. 

That is the `error.tsx` page. 

Ideally we do not event get to the error page, ideally we sort of predict where the errors can come from and we can prevent them.


## Zod validation for incoming data

`/events/[city]/page.tsx` before change
```tsx
import EventsList from "@/components/events-list";
import H1 from "@/components/h1";
//import { EventoEvent } from "@/lib/types";
//import { sleep } from "@/lib/utils";
import React, { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import { capitalize } from "@/lib/utils";


type EventsPageAndMetadataProps = {
  params: {
    city: string;
  };
};

type EventsPageOnlyProps = EventsPageAndMetadataProps & {
  searchParams: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({
  params,
}: EventsPageAndMetadataProps): Metadata {
  const city = params.city;

  return {
    title: city === "all" ? "All Events" : `Events in ${capitalize(city)}`,
  };
}

export default async function EventsPage({
  params,
  searchParams, //V246
}:
EventsPageOnlyProps) {
  const city = params.city;
  const page = searchParams.page || 1; //V246

  return (
    <main className="flex flex-col items-center py-24 px-[20px] min-h-[110vh]">
      <H1 className="mb-28">
        {city === "all" && "All Events"}
        {city !== "all" &&
          `Events in ${capitalize(city)}`}
      </H1>

      <Suspense key={city + page} fallback={<Loading />}> {/* V247 */}
        <EventsList city={city} page={+page} /> {/* V246 {page} */}
      </Suspense>
    </main>
  );
}

```

Here what we can do with search params `http://localhost:3000/events/all?page=0`, we are going to read the number from the URL, that is what we going to use as `const page = searchParams.page || 1;` in `EventsPage()`, but before we do that we may want to validate that what we get from the URL is actually a positive number, integer, it should be greater than zero. How we can do such type of validation? This is typically done with Zod.  

We install Zod `/evento $ npm i zod@3.22.4`, 

now we can use Zod to validate the incoming data. What we want with Zod is to describe what we want this (here `const page`) to look like

We create `pageNumberSchema`, `Zod` will have a `z` actually, we can force it to become a number `z.coerce.number`

Note that what is coming from the URL is always going to be string `const page = searchParams.page || 1;`, not a number, but we can `coerce` it, we can convert it, not only validate, but if it is a string it will transform into a number using `number()` function, it should be an integer `int()`, it should be positive `positive()`, and it should be optional as well `optional()`, so we dot have to pass it, if we go to here `http://localhost:3000/events/all` here it is not going to be a page number, so it optional.

This is so called `Schema`, basically how the page number should look like, so then when we get the `searchParams.page`, this is not validated yet, we do not know exactly what it is going to be. We are going to do that a little bit differently (instead of  `const page = searchParams.page || 1;`), we are going to use that `pageNumberSchema`, `pageNumberSchema.parse()` then there is `parse`  - which will throw an error if that page number `searchParams` is not conforming to the `Schema`. 

In our case we don't want to throw an error, we can use `pageNumberSchema.safeParse()`, which will not throw an error, it will give us the result, we can then check, in `safeParse()` we can pass `searchParams.page`, this is what we want to validate. Zod will take `searchParams.page`(whatever we are getting form URL), it will put that through this `pageNumberSchema`, if it is a string it is going to `coerce` it, it is going to make sure it is a number, integer etc. It will give us a result here, we can call it `const parsedPage`, and it will give us the result with a property on there, if the `parsedPage` does not have success on it `if (!parsedPage.success)`, then we want to throw an error, we will have error.tsx file; otherwise we know it is successful, we can now use `parsedPage`. We should still pass a number here (`page`)  `<EventsList city={city} page={+page}`. We are going to use `parsedPage`, here if we want to access the actual number, Zod will give it on data property `page={parsedPage.data}`, `data` has been typed (intellisense pop-up) as `number | undefined`. We have set it as `optional()` so it could be `undefined`. We get an issue for `page` props here `EventsList (...) page={parsedPage.data}`, `page` needs to be a `number`, not `"number or undefined"`, what we can do in case it is actually undefined, we can go to `EventsList` (`events-list.tsx`), we can give this `page` -> `export default async function EventsList({ city, page }: EventsListProps) {` a default value -> `export default async function EventsList({ city, page = 1 }: EventsListProps) {`, if we are not passing a default value, if it is undefined, the page must be 1. Now we need to make page number optional in the type `EventsListProps = { (...) page?: number;`

fragment of `events-list.tsx`
```tsx
type EventsListProps = {
  city: string;
  page: number; //V246
};

export default async function EventsList({ city, page }: EventsListProps) {
```

fragment of `events-list.tsx`
```tsx
type EventsListProps = {
  city: string;
  page?: number; //V246
};

export default async function EventsList({ city, page = 1 }: EventsListProps) {
```





`/events/[city]/page.tsx` after changes
```tsx
import EventsList from "@/components/events-list";
import H1 from "@/components/h1";
//import { EventoEvent } from "@/lib/types";
//import { sleep } from "@/lib/utils";
import React, { Suspense } from "react";
import Loading from "./loading";
import { Metadata } from "next";
import { capitalize } from "@/lib/utils";
import { z } from "zod";


type EventsPageAndMetadataProps = {
  params: {
    city: string;
  };
};

type EventsPageOnlyProps = EventsPageAndMetadataProps & {
  searchParams: { [key: string]: string | string[] | undefined };
};

export function generateMetadata({
  params,
}: EventsPageAndMetadataProps): Metadata {
  const city = params.city;

  return {
    title: city === "all" ? "All Events" : `Events in ${capitalize(city)}`,
  };
}

const pageNumberSchema = z.coerce.number().int().positive().optional(); // <- just added

export default async function EventsPage({
  params,
  searchParams, //V246
}:
EventsPageOnlyProps) {
  const city = params.city;
  //const page = searchParams.page || 1; //V246 // <- changed V248 
  //pageNumberSchema.parse() // <- changed V248 
  const parsedPage = pageNumberSchema.safeParse(searchParams.page);
  if (!parsedPage.success) {
    throw new Error("Invalid page number");
  }
  // <- changed V248 

  return (
    <main className="flex flex-col items-center py-24 px-[20px] min-h-[110vh]">
      <H1 className="mb-28">
        {city === "all" && "All Events"}
        {city !== "all" &&
          `Events in ${capitalize(city)}`}
      </H1>

      {/*<Suspense key={city + page} fallback={<Loading />}> */} {/* V247 */} {/* // V248 */}
      <Suspense key={city + parsedPage.data} fallback={<Loading />}> {/* // V248 */}
       {/* <EventsList city={city} page={+page} /> */} {/* V246 {page} */} {/* V248 {parsedPage.data} */}
       <EventsList city={city} page={parsedPage.data} /> {/* // V248 */}
      </Suspense>
    </main>
  );
}

```


This is an example of using Zod. We have some incoming data into our app, and we want to validate it a little bit better. Now when we go to `http://localhost:3000/events/all?page=0` we are not crashing an application, we are just throwing an error, showing error.tsx file. Now if we do `<H1>{error.message}</H1>` in error.tsx file, we can see the message "Invalid page number", we have an error but Next.js will strip that from sensitive information.

Where else we are getting data into the application? The user can also fill out this form for search, on the home page. Let's look into search-form.tsx

When we use the search form "Gibberish", that returns a URL -> `http://localhost:3000/events/gibberish` "Events in Gibberish"

When we have limited resources, time and energy, we may want to skip some validation with Zod. 

Where else do we have incoming data? When we fetch data, we are going to get the result, in utils.ts we are getting data with Prisma, that is considered to be a little bit safer, because we are using Prisma in between. Prisma will warn if anything strange could be done here, with conditions in the code essentially, and Prisma will also give the type of what we get back. It is a little bit safer if we get data with Prisma.

Technically we could also validate `events` and `totalCount` in utils.ts (which we get from Prisma) with Zod, but it depends how much of resources do we have.

Typically data got from Prisma is not checked. But if we have financial or banking type of application we may do Zod as well.

Of course we may also have tests of course. Testing will also add an additional layer of robustness.