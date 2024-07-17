## V255 Server-Only Utilities (Advanced Data Fetching Utilities)
Description: Prevent accidental usage of utility functions on the client. Make sure they are only used on the server. Note that this has nothing to do with Server Actions.


Now we are almost finished. Just a couple more best practices that we should know about.
In `utils.ts` we have data fetching utility function `getEvents` and `getEvent`, when we just look at them, we do not know that they can only be used on the server. We are only using them in server components, because we are interacting with the database (we are using Prisma), we do not want to do that on the client. It is possible that for example that we are using `getEvents` in `EventsList`(`events-list.tsx`) (we are using that there though - `await getEvents(city, page)`), there we are using this function, that is fine because `EventsList` is a server component. It is possible that over time, for some reason we need to turn `EventsList` into a client component, or maybe there is another client component and we are accidentally trying to use this function `getEvents()` in another client component. Is that a big problem? It is going to be quite common actually, in Next.js we have a mix of server and client components, we can use everything from `utils.ts` in a client or server component (we can import from that file). 

Somebody else on the team (teamwork) might not know that we may only use this `getEvents()` on the server. Is this a big problem if we accidentally try to use that on the client? Probably not but it could technically be. Because when we interact with the database or when we are fetching data we could have secrets here perhaps, we could have some API key. Maybe this `prisma.` throws some error that has certain information that we do not want to leak.
`utils.ts`
```tsx
// export async function getEvents(city: string, page = 1) {  //V246 // V254 
export const getEvents = unstable_cache(async (city: string, page = 1) => { // V254
  //V246
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
    // V244
    orderBy: {
      date: "asc",
    },
    take: 6, //V246
    skip: (page - 1) * 6, //V246
  });

  //V246
  let totalCount;
  if (city === "all") {
    totalCount = await prisma.eventoEvent.count();
  } else {
    totalCount = await prisma.eventoEvent.count({
      where: {
        city: capitalize(city),
      },
    });
  }

  //V246
  // const totalCount = await prisma.eventoEvent.count({
  //   where: {
  //     city: capitalize(city),
  //   },
  // });

  //V246
  return {
    events,
    totalCount,
  };
}
); // V254
```


 There are certain issues that can occur while trying to use this `getEvents` on the client. We want to keep it safe on server only, so here where we put these data fetching with all of those other utilities, maybe better to separate this out to a separate file. We can call that `server-utils.ts`. These are utilities only for server-side usage.

We move `getEvents` and `getEvent` utility functions from `utils.ts` to `server-utils.ts`

These are which we can use in both server and client

`utils.ts` fragment
```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(string: string) {
  // input of the function -> string: (of type) string
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```

We need to  modify places where we previously used `utils.ts`, so `events-list.tsx` and `event/[slug]/page.tsx`, now we use `server-utils.ts`. 

`events-list.tsx` fragment
```tsx
//import { getEvents, sleep } from "@/lib/utils"; // V255
import { sleep } from "@/lib/utils"; // V255
import { getEvents } from "@/lib/server-utils"; // V255
```

`event/[slug]/page.tsx` fragment
```tsx
//import { getEvent, sleep } from "@/lib/utils"; // V255
import { sleep } from "@/lib/utils"; // V255
import { getEvent } from "@/lib/server-utils"; // V255
```


Now the name of the file is a little bit clearer, that we should use this on the server. 
But sometimes wew could make some component a client component, with `"use client";` at the top, or maybe it gets imported into another component that is a client component, so it automatically becomes a client component e.g. `event-list.tsx`. It is not so clear, it is not clear from the file itself whether it is a client component, it depends on the import tree of a React tree. 

Event though we are importing from this file `server-utils.ts` but can we also force these functions to stay on the server only? And maybe get an error if we try to use them on the client. 

Next.js actually recommends is that we install a package for that `$ npm install server-only`, now to use that we write at the top of the file `import "server-only";`
Now we are enforcing these functions to only be used on the server.

To check the way it works we can try to use forced-to-be server function (e.g. `server-utils.ts` with `import "server-only";`) in the file that is a client component e.g. 
in `search-form.tsx` we use `const events = getEvents("austin", 2);` while being on development server (`$ npm run dev`)

`search-form.tsx` fragment
```tsx
"use client";

import { getEvents } from "@/lib/server-utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SearchForm() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const events = getEvents("austin", 2); // V255 this line is for a behaviour check while using server-only package

```

Now going to the page that utils `search-form.tsx` we approach an error which is the behaviour we want ->

```
Failed to compile
./src/lib/server-utils.ts
ReactServerComponentsError:

You're importing a component that needs server-only. That only works in a Server Component but one of its parents is marked with "use client", so it's a Client Component.
Learn more: https://nextjs.org/docs/getting-started/react-essentials

```

It prevent us from leaking some information to the client, that is another best practice.

This is completely different from Server Actions btw.

With Server Actions what we also have to do is to add `"use server";` at the top of the document, that is completely different.

`server-only` is a quick utility that we can use to force functions to stay on the server, Server actions is a completely different concept.
