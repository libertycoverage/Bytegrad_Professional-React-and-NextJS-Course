## V254 Advanced Data Cache: Prisma / ORM Caching With Unstable_cache
Description: Next.js automatically puts the result of Fetch API calls into the Data Cache. That is not true for Prisma / ORM calls (to allow these ORM's to define their own caching rules). However, you can use the unstable_cache function to put the result of Prisma / ORM calls into the Data Cache. 

Let's take a look at dynamic rendering, here we have `λ /events/[city]`, it is going to be dynamically rendered, whenever there is request to e.g. `https://(...)/events/austin`, there will be network request to the server and the server will run `EventsPage` component again including all of child components on this page, then the result is streamed back to the client. That is not ideal, but does this also mean if we go to `<EventsList>` in `EventsPage` (`/events/[city]/page.tsx`), does this also re-render. In `events-list.tsx` we are actually getting data from the database `await getEvents(city, page)`. It also means that whenever somebody goes there, we have to make this query to the database, because it is quite expensive operation (if thousands of people go to city `http://localhost:3000/events/austin`), every time we go to `EventsPage` it will re-render everything including including making this network request (`await getEvents(city, page)`) to the database, this is quite suboptimal. If we go to `getEvents()` function in `utils.ts` it would mean that for thousands of people we are going to make this Prisma call `await prisma.eventoEvent.findMany({})` to our database to find all of the events and then return them.

There is some trick we can use perhaps. Previously we were using Fetch API - in `getEvents()`, and Next.js by default actually caches that fetch request. If we were using the Fetch API it would not make that actual network request, every time there is a request to that route. We would just do it once and it will store the result of that `fetch()` call in a separate cache called the Data Cache. It is doing that by default, we saw that, we can opt-out of that Next `no-cache`, `no-store`- `fetch( URL, { cache: "no-store", },` that is how we could opt-out of it. Typically we do want to have cache.

```tsx
const response = await fetch(
  `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`,
 {
   cache: "no-cache",
 }
```

```tsx
const response = await fetch(
  `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`,
 {
   cache: "no-store",
 }
```

The benefit now if we get many requests to this route, we do not have to make an actual network request, it will still re-render the component e.g. `EventsList`, but it will just re-use the result from that function call to render every time. This is much better.

However here (`in utils.ts`) we are not using Fetch API ourselves, we are using Prisma ORM to interact with database, and Next.js will not automatically cache this. The idea is that something like Prisma can decide itself whether they want to cache or not. By default Prisma does not cache that, here we have no caching. Now when somebody goes to `EventsList` (`events-list.tsx`), every time we would make a network request with Prisma to the database to get the data. Not optimal.

`utils.ts` fragment
```tsx
export async function getEvents(city: string, page = 1) {
  //V246
  const events = await prisma.eventoEvent.findMany({
    where: {
      city: city === "all" ? undefined : capitalize(city),
    },
    // V244
    orderBy: {
      date: "asc",
    },
    take: 6, //V246
    skip: (page - 1) * 6, //V246
  });

```


How do we get the same result as with the Fetch API enhancement? We also want to get this `prisma.` into that Data Cache. Next.js helps us out here.

What we can do is we can wrap, and rewrite this `getEvents`, we have to convert this to an arrow function (we use fat arrow =>). We wrap all of this in `unstable_cache`. If we do not make function `async` we will get red squiggly lines on `(city: string, page = 1)`.

`utils.ts` fragment
```tsx
import { unstable_cache } from "next/cache"; // add this 

// (...)

export const getEvents = unstable_cache( async (city: string, page = 1) => {
  //V246
  const events = await prisma.eventoEvent.findMany({
    where: {
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
										
); // here ends the closing bracket of unstable_cache
```

The first time there is nothing in the cache it will make a network request, call to the database, it will store the result in a Data Cache, and the next time somebody comes to this page we are going to re-render that component, meaning it will run everything in the curly braces, but it still has that result from the previous time. It will not make another network request to the database.  

`unstable_cache` is what we want to use when we are using ORM, which is actually quite common. Fetch API sometimes, but usually when we interact with the database, we are going to have own ORM, this is how we are going to get the result of that in the Data Cache, just like with the Fetch API.

We want to do the same for `getEvent()`, we also want to cache Prisma results to not to have to make expensive network calls to database. 

```tsx
// export async function getEvent(slug: string) { // V254
export const getEvent = unstable_cache(async (slug: string) => { // V254
  const event = await prisma.eventoEvent.findUnique({
    where: {
      slug: slug,
    },
  });
  // V245
  if (!event) {
    return notFound();
  }

  return event;
}
); // V254
```


Now it should be much faster in production as well or should be much faster, first time it will have to go to the database, the result of that will be stored in cache, then next time, even though it is dynamic rendering (Dynamic Rendering means that the HTML for that page could not be created during the build, during the request time it has to go to the server, it has to render the whole component e.g. `EventsList` in `events-list.tsx`, and the result of that is then streamed back to the client), there is going to be some network request that is not great, but now with unstable Data Cache `unstable_cache` at least we do not have to make a network call to our database every time there is a request. At least we can cache that (`getEvents`), it will re-render this component, it will reuse the result from the previous call.

----
### At the time of making this tutorial it is now unstable cache `unstable_cache` but in the future it should not to be. 

ChatGPT 4o

Is the unstable_cache stable yet? Check on the internet. We are taking about the newest realeases of Next.js

As of July 2024, `unstable_cache` in Next.js is still considered experimental and not fully stable. Although it offers some caching functionalities, users have reported various issues. For instance, there are problems with proper deserialization of dates, causing inconsistencies when fetching cached data across multiple requests​ ([GitHub](https://github.com/vercel/next.js/issues/51613))​​ ([Nico's Blog](https://www.nico.fyi/blog/demistifying-cache-in-nextjs))​. Additionally, there have been specific issues with caching behavior on Vercel, indicating that `unstable_cache` may not work correctly in all deployment environments​ ([GitHub](https://github.com/vercel/next.js/issues/57978))​.

For production use, developers often look for more reliable alternatives or use `unstable_cache` cautiously, monitoring for any caching inconsistencies​ ([Next.js Discord Forum](https://nextjs-forum.com/post/1201540300049490001))​​ ([Nico's Blog](https://www.nico.fyi/blog/demistifying-cache-in-nextjs))​. It is generally recommended to stay updated with the latest Next.js releases and community discussions for improvements and best practices regarding caching strategies.

----


NextJS; Autor: Widenex; Advanced Next.js 14, 13 & 12 Typescript/JS copilot (+ App Router), assistant and project generator with a focus on responsive, beautiful, and scalable UI. Write clean code and become a much faster developer.

-->
### compare no-cache and no-store

The `cache` option in the `fetch` API controls how requests and responses interact with the browser's HTTP cache. The values `no-cache` and `no-store` are two distinct options with different behaviors:

#### `no-cache`

- **Behavior**: Forces the browser to send the request to the server for validation before using a cached response. The server can either return a 304 (Not Modified) status code to use the cached response or provide a new response.
- **Usage**: When you want to ensure the response is up-to-date but still want to benefit from caching. This is useful when the response might change frequently, but you don't want to skip caching entirely.
- **Example**:
  ```javascript
  const response = await fetch('https://api.example.com/data', {
    cache: 'no-cache',
  });
  ```

#### `no-store`

- **Behavior**: Completely bypasses the cache. The browser will neither look for a cached response nor store the fetched response in the cache. Every request results in a full round-trip to the server.
- **Usage**: When you want to ensure that the request is always fresh and should never be cached. This is suitable for highly dynamic content or sensitive data that should never be stored.
- **Example**:
  ```javascript
  const response = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  });
  ```

#### Comparison

| Aspect               | `no-cache`                                 | `no-store`                               |
| -------------------- | ------------------------------------------ | ---------------------------------------- |
| **Cache Lookup**     | Checks the cache and validates with server | Does not check the cache                 |
| **Response Storage** | Can store the response in the cache        | Does not store the response in the cache |
| **Performance**      | Can be faster if the server returns 304    | Always slower, as it bypasses the cache  |
| **Use Case**         | Semi-dynamic content, needs validation     | Highly dynamic or sensitive content      |

#### Example in a Next.js Component

Here's an example that demonstrates how to use both `no-cache` and `no-store` in a Next.js component:

```typescript
// app/page.tsx

import { useEffect, useState } from 'react';

// Function to fetch data with no-cache
const fetchDataNoCache = async () => {
  const response = await fetch('https://api.example.com/data', {
    cache: 'no-cache',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// Function to fetch data with no-store
const fetchDataNoStore = async () => {
  const response = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Page = () => {
  const [dataNoCache, setDataNoCache] = useState(null);
  const [dataNoStore, setDataNoStore] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchDataNoCache(), fetchDataNoStore()])
      .then(([dataNoCache, dataNoStore]) => {
        setDataNoCache(dataNoCache);
        setDataNoStore(dataNoStore);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Fetched Data with no-cache</h1>
      <pre>{JSON.stringify(dataNoCache, null, 2)}</pre>
      <h1>Fetched Data with no-store</h1>
      <pre>{JSON.stringify(dataNoStore, null, 2)}</pre>
    </div>
  );
};

export default Page;
```

In this example, `fetchDataNoCache` and `fetchDataNoStore` demonstrate how to fetch data using `no-cache` and `no-store` respectively, and the component shows the difference in behavior between the two options.

-----

### show me an example of fetch api with no-store

Sure, here's an example of how to use the `fetch` API with the `cache` option set to `no-store` in a Next.js component. This ensures that the request will not be cached and a fresh response will be fetched every time.

First, let's create a Next.js component that fetches data from an API using `fetch` with `no-store`.

#### Example Component

```typescript
// app/page.tsx

import { useEffect, useState } from 'react';

const fetchData = async () => {
  const response = await fetch('https://api.example.com/data', {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Page = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData()
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Fetched Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
```

#### Explanation

- **`fetchData` Function**: This function uses the `fetch` API to request data from an example API (`https://api.example.com/data`) with the `cache` option set to `no-store`. This ensures the request will always hit the network and not use any cached responses.
- **Component State**: The `Page` component maintains three pieces of state: `data`, `error`, and `loading`. These are used to manage the component's rendering based on the fetch status.
- **`useEffect` Hook**: The `useEffect` hook is used to call `fetchData` when the component mounts. The returned data is stored in the `data` state, and any errors are caught and stored in the `error` state.
- **Conditional Rendering**: The component conditionally renders loading, error, or data states based on the current state.

You can adapt the `fetch` URL to your actual API endpoint. This example demonstrates how to fetch data without caching it, ensuring you always get the most recent data from the server.

----


```bash
user@MacBook-Air-user evento % npm run build

> evento@0.1.0 build
> next build

   ▲ Next.js 14.0.1
   - Environments: .env

 ✓ Creating an optimized production build    
 ✓ Compiled successfully
 ✓ Linting and checking validity of types    
 ✓ Collecting page data    
   Generating static pages (0/9)  [    ]/terms-conditions
/
/_not-found
   Generating static pages (3/9)  [=   ] 
/privacy-policy
/event/dj-practice-session
/event/comedy-extravaganza
{
  id: 11,
  name: 'Comedy Extravaganza',
  slug: 'comedy-extravaganza',
  city: 'Austin',
  location: 'Austin Laugh Factory',
  date: 2030-11-06T00:00:00.000Z,
  organizerName: 'Laugh Productions',
  imageUrl: 'https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100',
  description: 'Prepare for a night of laughter with top comedians from around the world. Enjoy stand-up, improv, and sketches that will have you in stitches!',
  createdAt: 2024-06-20T13:53:58.495Z,
  updatedAt: 2024-06-20T13:53:58.495Z
}
{
  id: 1,
  name: 'DJ Practice Session',
  slug: 'dj-practice-session',
  city: 'Austin',
  location: 'Austin Music Hall',
  date: 2030-10-12T00:00:00.000Z,
  organizerName: 'DJ Inc.',
  imageUrl: 'https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100',
  description: "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
  createdAt: 2024-06-20T13:53:58.449Z,
  updatedAt: 2024-06-20T13:53:58.449Z
}
{
  id: 11,
  name: 'Comedy Extravaganza',
  slug: 'comedy-extravaganza',
  city: 'Austin',
  location: 'Austin Laugh Factory',
  date: 2030-11-06T00:00:00.000Z,
  organizerName: 'Laugh Productions',
  imageUrl: 'https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100',
  description: 'Prepare for a night of laughter with top comedians from around the world. Enjoy stand-up, improv, and sketches that will have you in stitches!',
  createdAt: 2024-06-20T13:53:58.495Z,
  updatedAt: 2024-06-20T13:53:58.495Z
}
{
  id: 1,
  name: 'DJ Practice Session',
  slug: 'dj-practice-session',
  city: 'Austin',
  location: 'Austin Music Hall',
  date: 2030-10-12T00:00:00.000Z,
  organizerName: 'DJ Inc.',
  imageUrl: 'https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100',
  description: "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
  createdAt: 2024-06-20T13:53:58.449Z,
  updatedAt: 2024-06-20T13:53:58.449Z
 ✓ Generating static pages (9/9) 
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    538 B          93.1 kB
├ ○ /_not-found                          0 B                0 B
├ ● /event/[slug]                        298 B          90.5 kB
├   ├ /event/comedy-extravaganza
├   └ /event/dj-practice-session
├ λ /events/[city]                       4.07 kB         138 kB
├ ○ /privacy-policy                      155 B          85.3 kB
└ ○ /terms-conditions                    155 B          85.3 kB
+ First Load JS shared by all            85.1 kB
  ├ chunks/472-ceb7c7a37c3160ac.js       30 kB
  ├ chunks/fd9d1056-1dd039ad93df9976.js  53.2 kB
  ├ chunks/main-app-fcd3d8a414b8245c.js  232 B
  └ chunks/webpack-f487ad990b01bcb8.js   1.73 kB


ƒ Middleware                             25.5 kB

○  (Static)   prerendered as static HTML
●  (SSG)      prerendered as static HTML (uses getStaticProps)
λ  (Dynamic)  server-rendered on demand using Node.js

```


