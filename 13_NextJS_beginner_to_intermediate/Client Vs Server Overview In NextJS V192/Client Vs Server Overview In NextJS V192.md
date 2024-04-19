## V192 Client Vs Server Overview In NextJS

Description: Learn the differences between client and server in Next.js

High level overview of full stack Next.js application in terms of client and server side

![[V192 2024-04-19 o 16.30.27.png]]

Next.js is full stack

Client (basically a browser)

Some of the features concern client side and some of them server side

### Client Components and Server Components

Client Components run on the client
Server Components only run on the server

e.g. EventPage in Evento project is a server component, because everything by default in src/app/ is a server component, we get the event data and we use that to construct the page, this all runs on the server, and the result of this will be sent to the frontend,

There is a communication between server and client, but we do not have to do it ourselves, we do not have to send the result of the rendering to the client, Next.js will take care of that for us behind the scenes.

This network boundary has been abstracted away by Next.js to a very large degree, the server components will only run on the server, the rendering happens on the server, and the result of that rendering, whatever you return, will be sent to the front-end

Server Components have certain benefits and they are the default, we want to try to keep components on the server.

For example if it is a server component we do not have to ship all of the logic e.g. that is related to the fetching of the event. That can stay on the server, we do not have to ship that to the client, that is a benefit.

If the EventPage was a client component we would have to ship all of the javascript logic to the client as well, which would take a more space and would also be slower.

Sometimes if you have a button let's say that needs to be a client component, because you need interactivity, if you want interactivity from the user it has to run in the client. If it only runs in the server, you won't get any interactivity from the user, user is clicking things in the browser, we need a component that can interact with those clicks
Sometimes you have no choice, you have to convert it to a client component

### Server Actions

On the server side we also have Server Actions

with Server Components you can get data (e.g. get request)
we also have POST, PUT and DELETE requests, you can use Server Actions for them

If the user submits the form it will invoke some action on the server that can deal with the form data and can do something with that, we invoke that from the client, but the function is running on the server side.

Server is placed somewhere in the world, depending on where you deploy your application

Next.js abstracts away the communication between client and server.
If the user submits the form, and you wanna run a Server Actions (function on a server), you can call that function, you do not have to setup API endpoint, you can call the function, form data gets to the server side and then Server Actions get access to that data

On the server side we also have

### API Route Handlers

sometimes you need to create and API endpoint, maybe for a webhook for example, maybe you have Stripe and there is a payment, you need to be notified of the payment, Stripe server will send you notification about the payment, you need some kind of an endpoint. that stripe can sent requests to.
You may consider using Route Handlers in Next.js.

The idea of Server Actions is they replace API endpoints. The use of API endpoints within Next.js internal project communication should decline.

For typical POST, PUT, DELETE requests when user is updating or deleting something you wanna use Server Actions

For webhook you wanna use API Route Handler.

In Next.js we also have

### Middleware

e.g. if the user want access some page maybe /dashboard route, that is gonna be a server component, there will be a network request to the server, specifically to the dashboard Server Component and before that request reaches server component, we may wanna check if the user is logged in. We can have Middleware that can check if the user is authenticated or not, if the user is not authenticated we can immediately redirect him to /login let's say.

We have an example from Evento

middleware.ts

```tsx
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL("events/all", request.url));
}

export const config = {
  matcher: ["/events"],
};
```

We export function middleware and we get access to the incoming request, we can hook into that, we can quickly check if user is authenticated (the most common use case for Middleware is authentication), if yes the request will continue here, if user is not authenticated, we want to redirect

### Caching

is really beneficial if you have a public content website, you want a lot of caching, a lot of pre-generated HTML for your pages, things like that, Next.js is good at that

#### Client Cache / also called Router Cache

Router Cache, as you navigate to different routes Next.js will make requests

We click on the Link component you use we are going to specific routes, we are going to page component (server component). There is going to be a network request to the server side and Next.js will make sure EventsPage component will be rendering, and the result of that rendering will be send back to the client. It would be wasteful (from the perspective of internal network requests) if the routes results were not cached. As we navigate Next.js will cache that behind the scenes.

### Server Caching

#### Data Cache

e.g. in the EventPage we execute `const event = await getEvent(slug)`
getEvent is just a utility function that is interacting with a database. We have wrapped that in function unstable_cache. It is going to get data from the database and the result of that is put in a Data Cache. This is actually a powerful cache because if you re-deploy to Vercel for example it will be persistent.

fragment of server-utils.ts

```tsx
...
...
export const getEvent = unstable_cache(async (slug: string) => {
	const event = await prosma.eventtoEvent.findUnique({
		where: {
			slug: slug,
		},
	});

	if(!event){
	return notFound();}

	return event;
});
```

This Data Cache means that when this EventPage component is rendering we await getEvent, we get the event, we do not have to make a call to the database every time this component renders, it only have to do this once, and the result of that is put in that cache `unstable_cache`. unstable_cache because we are using prisma, if we would use Fetch API it would be automatically, but using an ORM (prisma) which is very common, you have to do it yourself with unstable_cache, that will put it in Data Cache, so database request are relieved. The result from the database will be put in the Data Cache.

```tsx
export default async function EventPage({params}: Props) {
	const slug = parmas.slug;
	const event await getEvent(slug);

	...
}
```

Data Cache is mostly for interacting with databases or fetching some data from a third party API

#### Full Route Cache

One more cache, Next.js will generate HTML of pages

e.g. Home() component will run once to generate the HTML, HTML is already ready, rendering of this component again is not necessary

(generated) HTML is sitting in cache as well
