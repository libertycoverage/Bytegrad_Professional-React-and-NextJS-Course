## Video 191 Router (Pages) vs Components

Description: In NextJS it is important to have a mindset focused around routes (pages) instead of components. On a page you can have many different components.

Before with a Vite App we basically had a collection of components.
We had a root App() and a bunch of components together it was a React app.

In Next.js we get into a slightly different mindset which is more centered about different routes that is connected to some page.tsx file

Page /events
Page / - home page
Page /event/[slug] - for individual event page, and in Next.js we have some kind of dynamic route( in Evento project so called slug(animal))

![[V191 2024-04-19 o 09.53.58.png]]

It is more about the Root Layout and then you have Pages (or routes)

On those pages you have React components (a lot of child components)

A lot of things they affect the whole routes, for example caching
maybe Page /events route is cached, the page component and and all of the child components, their HTML is generated for example and then it is cached, which means it does not run on every request to there, that is optimization, and it affects the whole route which means that page.tsx file, the page component and then the child components in there

There is more structure that comes with Next.js app vs a Vite app (we had bunch of components together, and was all client side)

Here in Next.js we have server components, certain routes out of the box, and they are usually server components, and then on those pages we have a bunch of components, some of them will be client and some of them will be server components
