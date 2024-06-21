## V243 Replace Fetch API With Prisma Client
Description: Replace the Fetch API with Prisma Client in our data fetching utilities.


Now when we fetch data we shouldn't fetch it from some remote server, we should be able to fetch the data from our own database.

When we go to utils.ts, we have abstracted data fetching to it's own separate functions, we have centralised that as utility functions. 

Instead of using Fetch API we will use Prisma to get event from our database 

We need to import Prisma client and instantiate that `const prisma = new PrismaClient();`, now we can we can use `prisma` variable to interact with database. We could use other model in place of `eventoEvent` usage of `model EventoEvent` (`schema.prisma`). Then `findUnique`, find the one where the `slug`, whatever we pass in `getEventThroughPrisma(slug`. In `findUnique` we are passing a object, `where` the slug it the `slug` we we are passing in. Make sure to add `const event =` to assign the result of Prisma call. No we have replaced Fetch API with Prisma database call. 

When we try to see the individual event, this data it is coming from the database (local PostgreSQL), we are not fetching it from any server. 

When we try to make `getEvents` using Prisma, when we go to `http://localhost:3000/events/seattle` we get an error (red squiggly lines) on `city` in `where: { city: city,` 

error
```txt
Dla literału obiektu można określić tylko znane właściwości, a właściwość „city” nie istnieje w typie „EventoEventWhereInput”.ts(2353)

(property) city: string

---

Only known properties can be specified for the object literal, and the property "city" does not exist in the type "EventoEventWhereInput".ts(2353)?
```


It is actually very tricky because `city` will be lower case, when we look where `getEvents` is used, we are fetching in `events-list.tsx`, we pass `city` into `EventsList` component, which is used in `EventsPage`.  `EventsPage` takes city out of `params`, which come from the route URL, `city` in the route URL `params` `[city]` is a lowercase word. In our database city is a uppercase word. That is compared and gives the error.

One thing we could do in some databases, we can do something like this `city: { equals: city, mode: "insensitive", },`

In SQLite this does not work, later it will be changed to PostgreSQL hosted by Vercel, in PostgreSQL this should work, in MongoDB this should also work (to check), but for now we cannot use that (in case we are dealing with SQLite). We need to be mindful about the capitalization. We have created earlier a utility function `capitalize()`, we can use that.

this solution works
```ts
export async function getEvents(city: string) {
  const events = await prisma.eventoEvent.findMany({
    where: {
      city: {
        equals: city,
        mode: "insensitive",
      },
    },
  });
  return events;
}
```

`utils.ts`
```ts
//(...)

import { EventoEvent, PrismaClient } from "@prisma/client"; //V242 //V243

const prisma = new PrismaClient(); //V243

//(...)


// V240
export async function getEvents1(city: string) {
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
  );
  const events: EventoEvent[] = await response.json();
  return events;
}

export async function getEvent1(slug: string) {
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
  );
  const event: EventoEvent = await response.json(); // <- V242 quick fix type
  return event;
}
// V240 end

// V243 Replace Fetch API With Prisma Client
export async function getEvents(city: string) {
  const events = await prisma.eventoEvent.findMany({
    where: {
      // city city, // this solution does not work
      //city: {     // this solution works
      //  equals: city,
      //  mode: "insensitive",
      //},
      city: capitalize(city) // this solution also works
    },
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

```

Important!
Now it works for `http://localhost:3000/events/seattle` but does not work for  `http://localhost:3000/events/all`, we do not see the expected outcome.


We do not need to type ourselves anymore, because when we use this `prisma`, when we hover `events` in `const events = await prisma.eventoEvent.findMany({` it has already been typed for us. Prisma ORM is really type-safe (**Prisma ORM is the only fully type-safe ORM in the TypeScript ecosystem**), compared with what we were doing before with Fetch API. If we are using Fetch API, by default actually, we get a type of `any`, which is really unsafe. Prisma is helpful in many ways, including the types.

Here we are instantiating this `PrismaClient()` `const prisma = new PrismaClient();`  in `utils.ts`, and using that `prisma` to interact.

What Prisma recommends is not to instantiate `PrismaClient()` in every file that we are going to use Prisma. They recommend to instantiate it once and the reuse it throughout the application. In `/lib/` directory we may create `db.ts`. Now Prisma on the website will show how to do that

`db.ts`
```ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

```

In `db.ts`, it gets the `PrismaClient`(import), it instantiates it in `prismaClientSingleton` function. It has some type. It is going to get `globalThis` (in the browser we have the window object, global object), in this Node.js environment there is also a global variable.
It is going to check if `prisma` already exists on that global variable `globalForPrisma`, and if it does not exist we are going to instantiate `prismaClientSingleton()`


Now instead of this `utils.ts` fragment
```tsx
import { EventoEvent, PrismaClient } from "@prisma/client"; //V242 //V243

const prisma = new PrismaClient(); //V243
```

We can use this `utils.ts` fragment
```tsx
import prisma from "./db";
```


`utils.ts` fragment
```tsx
// V243 Replace Fetch API With Prisma Client
export async function getEvents(city: string) {
  const events = await prisma.eventoEvent.findMany({
    where: {
      // city city, // this solution does not work because of a lowercase city from params URL and uppercase in database
      //city: {     // this solution works
      //  equals: city,
      //  mode: "insensitive",
      //},
      city: capitalize(city), // this solution also works
    },
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
```


----
## Let's break down how this `db.ts` file works step by step. 

(Prisma ChatGPT - Author: Widenex- Advanced Prisma assistant and schema builder that will write complete, performant, clean, and scalable schemas for your database)

This `db.ts` file ensures that there is a single instance of `PrismaClient` throughout the application, especially in development mode. It uses a combination of a factory function, type casting, and the global object to achieve this. This singleton pattern helps to manage database connections efficiently and avoid potential connection issues caused by having multiple instances of `PrismaClient`.
### Importing PrismaClient

`import { PrismaClient } from "@prisma/client";`

This line imports the `PrismaClient` class from the `@prisma/client` package. The `PrismaClient` is used to interact with the database.

### Creating a Singleton Function

`const prismaClientSingleton = () => {   return new PrismaClient(); };`

Here, we define a function `prismaClientSingleton` that returns a new instance of `PrismaClient`. This function acts as a factory function for creating Prisma clients.

### Defining the Singleton Type

`type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;`

This line defines a type alias `PrismaClientSingleton` which is the return type of the `prismaClientSingleton`function. Essentially, it is equivalent to `PrismaClient`.

### Global Object Setup

`const globalForPrisma = globalThis as unknown as {   prisma: PrismaClientSingleton | undefined; };`

- `globalThis` is a standard built-in object that provides a standard way of accessing the global scope.
- We cast `globalThis` to a type that includes a `prisma` property. This property can either be an instance of `PrismaClient` or `undefined`.

### Instantiating or Reusing the Prisma Client

`const prisma = globalForPrisma.prisma ?? prismaClientSingleton();`

- This line checks if `globalForPrisma.prisma` already has an instance of `PrismaClient`. If it does, it reuses that instance.
- If not, it creates a new instance using `prismaClientSingleton()` and assigns it to `prisma`.

### Exporting the Prisma Client

`export default prisma;`
### Ensuring Singleton in Development

`if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;`

- This conditional statement ensures that in development mode (when `NODE_ENV` is not `"production"`), the `prisma`instance is stored in `globalForPrisma.prisma`.
- This prevents the creation of multiple instances of `PrismaClient` during development, which can lead to issues with database connections.

----


Now Prisma works for `http://localhost:3000/events/seattle` but does not work for  `http://localhost:3000/events/all`, we do not see the expected outcome.

When we go to `events-list.tsx` to `EventsList` component, we get `city` is `all`, and we call this `getEvents()` function with `all` (V240). We go to `utils.ts` `getEvents()`, `city` is `all`, here we are going to Prisma `prisma.eventoEvent`, get all events from `city` where `city` is `all`, that does not exist, there is no event with `city` `all`. Previously with Fetch API we were passing all to the URL, server new how to deal with that, but here Prisma is going to compare `city` with the string `"all"`  `where: { city: capitalize(city), }`  and it does not exist. 

What we can do is to check if the `city` is `all`, we can put `undefined` here, if we do `undefined` it will actually find all of them. `city: city === "all" ? undefined : capitalize(city),`. By default if we run this `prisma.eventoEvent.findMany();`, if we do not pass anything it will actually get all of the events. If we pass `undefined` here `prisma.eventoEvent.findMany(undefined);` it will actually be the same as calling it like this `prisma.eventoEvent.findMany();`. If it is `all` we make `undefined`. Now `http://localhost:3000/events/all` it is working properly. 

`utils.ts` fragment
```tsx
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
```


