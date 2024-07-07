## V250 Static Vs Dynamic Rendering In EVENTO
Description: Learn about static vs dynamic rendering in EVENTO.

Let's talk about static and dynamic routes

to really show that we are going to run a production build

If we look at the `scripts` in `package.json` file, we get the script to run development, we get the script `build` to run a production build. Next.js will take all of the files and will produce an optimal output, that we can then use in production, so will be faster, smaller etc.

fragment of `package.json`
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
```

We can run that locally

`/evento $ npm run build`

When we will run that Next.js will also give us some information about the final result.

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
   Generating static pages (0/7)  [    ]/privacy-policy
/_not-found
/terms-conditions
/
 ✓ Generating static pages (7/7) 
 ✓ Collecting build traces    
 ✓ Finalizing page optimization    

Route (app)                              Size     First Load JS
┌ ○ /                                    538 B          93.1 kB
├ ○ /_not-found                          0 B                0 B
├ λ /event/[slug]                        298 B          90.5 kB
├ λ /events/[city]                       4.07 kB         138 kB
├ ○ /privacy-policy                      155 B          85.3 kB
└ ○ /terms-conditions                    155 B          85.3 kB
+ First Load JS shared by all            85.1 kB
  ├ chunks/472-ceb7c7a37c3160ac.js       30 kB
  ├ chunks/fd9d1056-1dd039ad93df9976.js  53.2 kB
  ├ chunks/main-app-fcd3d8a414b8245c.js  232 B
  └ chunks/webpack-f487ad990b01bcb8.js   1.73 kB


ƒ Middleware                             25.3 kB

○  (Static)   prerendered as static HTML
λ  (Dynamic)  server-rendered on demand using Node.js

```

What we see is for each route, how much JS is going to be loaded

By default Next.js  does some code splitting by route. 
If we go to home page we are going to load some JS, but not for the whole website.
- Home page route `/`
- underscored `_not-found` route, this is something Next.js will create by default, that is `not-found.tsx` that we have, Next.js will create this regardless
- `λ /event/[slug]` for individual events
- etc.

In Next.js we have mindset of routes. We have a routes and on the routes we have components. 

one thing we can also see is 
`○ (Static)`, empty circle means static
`λ (Dynamic)`

`○ (Static)` means that during the build it will run the component, and the result of that will be stored, the result of that will be used anytime we go there, we can also call that cache. It is not going to re-run this component whenever we go to the homepage, only here during the build. It can already be pre-rendered, we pre-render during the build, then when we actually go to the homepage, the result will be waiting. This is a static file, is is essentially run once,  during the build.

`λ (Dynamic)` route, they will run whenever we are making request. e.g. `λ /events/[city]` is dynamic. Whenever we make a request which matches that route, we run component again. In here we are using `searchParams`, it won't be pre-rendered, we do not know what `searchParams` is going to be, it depends on the request itself if the `searchParams` are in the URL or not. By default if we use `searchParams`, Next.js will opt this page out of a static rendering and will make it dynamic rendering. Which means every time we make a request now to `/events/[city]/page.tsx` it is going to re-run `EventsPage` component, which is not ideal. Ideally we would like to have static rendering, because we have to do it once, during the build. Sometimes there is no way around that, here we need to know `searchParams`, it will re-render the whole component here, and send us the result of that rendering. And the next time when we refresh, we will send the request to the server, and the server will run the component again and then we get result.

`○ (Static)`  means the component runs once during the build.
`λ (Dynamic)` means it will run during request, whenever we make a request, request-time.

The benefit of static routes that their HTML is already waiting for us when we make a request. We already created the HTML during the build. That is the benefit of static rendering, HTML does not have to be created on demand, during the request itself, it is already waiting.


----

## V251 More Static Vs Dynamic Rendering (Client Components Run On The Server?)
Description: Client components can also run on the server when the route has been statically rendered. Server components only run on the server.

It is good to know btw. `/app/page.tsx` is statically rendered, so everything in there, including other components will run once during the build. Which means when we look at the `<SearchForm />` here, the `<SearchForm />` is actually a client component `"use client";`. Even a client component during the build will actually run on the server once, and then the result will just be used whenever we go to this page. Even as client component run on the server once. This is very confusing, because we thing server components run on the server, and client component will only run on the browser. This is kind of true with one exception which is also the client component also run once on the server. That is a little bit tricky. 

These things are probably the most trickiest things in Next.js, caching, static rendering.

Ideally we want to have static rendering, because we only run it once and then we can re-use it.
Sometimes we have dynamic rendering, it is going to happen when we have a dynamic route, or we are using `searchParams`. Next.js will automatically makes some routes dynamic, here we have not specified ourselves that this should become a dynamic route, but Next.js can already see it is a dynamic route (based on whatever we pass in the URL), also when we use `searchParams` it will automatically become a dynamic route. 

```bash
├ λ /event/[slug]                  
├ λ /events/[city]  
```

There are some things that Next.js will does for us automatically, as we use certain features.
