## V242 Setup SQLite With Prisma (Setup local PostgreSQL / SQLite with Prisma ORM)

### installation of Prisma ORM

Description: Add a database to the project with SQLite and Prisma. This is now a full-stack website with a database -- all within Next.js.

So far we've been fetching this data from a domain bytegrad.com (now URLs in `utils.ts`), but in real world we will have our own data, we have collected own data and it is in database, we are not fetching from 3rd party API.

Let's add a database using SQLite, it is the easiest way to add a database, we are going to use Prisma as ORM, as a way to interact with database. SQLite actually becomes a part of an app, we do not need to log in somewhere, setup external database.

We are going to use Prisma to interact with database, with Prisma we can also create a database. Everytime we want to interact with the database we are going to do it through Prisma

it will be a development dependency, we are not gonna need this in production

in the project we run
`/evento$ npm install prisma@5.6.0 --save-dev`

Now we have installed Prisma as dev dependency,

`evento/package.json`

```tsx
{
  "name": "evento",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^10.16.4",
    "next": "14.0.1",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.1",
    "postcss": "^8",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

## 1. SQLite alternative route

One of the things we can do is simply spin up, we can create database with prisma, we want to initialize this

`/evento$ npx prisma init --datasource-provider sqlite`

other options are postgresql , mongodb
-> `$ npx prisma init --datasource-provider postgresql`
-> `$ npx prisma init --datasource-provider mongodb`

The benefit of using Prisma, whatever the database is, with Prisma it basically always works the same, there is one way to query data, to get the data, one way to update the data. We can swap out databases, but the code will stay the same.

Author of the course decided to work with SQLite,

although for convenient prototyping with PostgreSQL, local PostgreSQL will be used

Let's start with SQLite `/evento$ npx prisma init --datasource-provider sqlite`

it automatically created new folder with a file `/prisma/schema.prisma`.  
`schema.prisma` has it's own syntax

Prisma will generate client for us, client is what we will use in code to interact with our database. File will have an information about the `datasource`. `DATABASE_URL` is an environment variable to connect to database. That `DATABASE_URL` residues in `.env` file, that environment variable for SQLite is a file.

`schema.prisma` file

```tsx
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

`.env` file

```bash
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public" ##this is default
DATABASE_URL="file:./dev.db"
```

Right now we do not have that file `dev.db` yet.

Let's go to `schema.prisma` file, before we create database and add data to the database, we should specify to Prisma what our data is going to look like, what shape does our data have. We do it with so called `model`, in SQL it is called `table`

We will create `model` `EventoEvent`, that is very similar to the type we have created before in `types.ts`. `EventoEvent` should have an id.

`schema.prisma` has it's own syntax.
In VS Code we should install extension called Prisma, that adds syntax highlighting, formatting, auto-completion, jump-to-definition etc. so we can easily deal with `schema.prisma` files.

### `EventoEvent` model (table) in Prisma

`Id` field of `EventoEvent` model (table) should be an integer and it should be an `@id`, `@id` is basically what Prisma will use to uniquely identify event. By `@default` it should auto increment.

Every event will have a `name`, that is going to be `String`

`slug` is `String` `@unique` - make sure you add this `@unique` to the `slug`, because these events what we have, we need to be able to distinguish them by the `slug`, we go to `localhost:3000/event/[slug]`, e.g. `http://localhost:3000/event/dj-practice-session`, there should only be one event in the database that matches that, if we get 2 matches in the database we won't show them in the one URL, in Prisma if `@unique` is forgotten we will run into issues

`city` is `String`
`location` is `String`
`date` should be `DateTime`
`organizerName` `String`
`imageUrl` `String`
`description` `String`

In Prisma also we want to keep track of when this event was created in the database, we can use `createdAt DateTime @default(now())`, when it is actually inserted or created in the database it will take current timestamp, ant that will be the default value for `createdAt`

And we also want to keep track when it is updated `updatedAt DateTime @updatedAt`. The first `updatedAt` we can call it whatever we want, but here `@updatedAt` we tell Prisma, that this is what we want to use to keep track of the update

`schema.prisma`

```tsx
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model EventoEvent {
  id            Int      @id @default(autoincrement())
  name          String
  slug          String   @unique
  location      String
  date          DateTime
  organizerName String
  imageUrl      String
  description   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

types.ts

```ts
export type EventoEvent = {
  id: number;
  name: string;
  slug: string;
  city: string;
  location: string;
  date: Date;
  organizerName: string;
  imageUrl: string;
  description: string;
};
```

Now we have a description what we want our database to look like, now we can actually create a database and immediately here `schema.prisma` create a table for a database as well.

What we can do in terminal `/evento/ $ npx prisma db push`

```
Datasource "db": SQLite database "dev.db" at "file:./dev.db"
```

Now (when choosing SQLite previously) we have `dev.db` file in `prisma` folder, that is actually our database.

It also generates something called
`Generated Prisma Client (v5.6.0) to ./node_modules/@prisma/client in 54ms`
which is what we will actually use to interact with database in our code
Now everything is ready for us to use that.

### One source of truth, using model (SQL table) from Prisma just as imported type is TypeScript

We are using type `EventoEvent` from `types.ts`, now we also have `model EventoEvent`(table) in Prisma. Now we have 2 ways to describe `EventoEvent`, and typically you do not wanna have that. You want one source of truth.

`types.ts`

```ts
export type EventoEvent = {
  id: number;
  name: string;
  slug: string;
  city: string;
  location: string;
  date: Date;
  organizerName: string;
  imageUrl: string;
  description: string;
};
```

We use that `EventoEvent`type in `event-card.tsx`

```tsx
import { EventoEvent } from "@/lib/types";
```

We can now import that from Prisma Client now, Prisma automatically when we run command `/evento/ $ npx prisma db push` will create type out of `model EventoEvent` as well. We can import type from there.

```tsx
import { EventoEvent } from "@prisma/client";
```

we change source of the type for `utils.ts` and `event-card.tsx`

### fetching not from URL, but locally

Right now we are fetching the data from other server (URL), we want to get from our database now, our database will need that data

`utils.ts` fragment

```ts
`https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
`https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
);
```

We need to add data to the database, before we can grab data from there.

How we can see what is in the database? Prisma helps us out as well, we can run in terminal

`/evento/$ npx prisma studio`

that will open up web tool Prisma Studio at http://localhost:5555

It will open up database in the new tab, it will actually show what is in the database

We can look up what is in the model we have created.

For now we do not see any data, no rows in the table (we did not put any data whatsoever yet), we only see columns in the table according to our model we defined in the schema.

How can we add data into the database. What we want to do is to seed the database, we want to add initial data, so we can play around and get started.

Inside the `/prisma/` folder we can create `seed.ts` file.

In `seed.ts` we import Prisma client, so we can programmatically interact with database.
We have `events` that holds the array, of objects that hold key-value pair for each column in the table, Prisma's `model`. Each event is represented by the object that has properties.

`main()` function is called at the bottom, we have `main()` definition `async function main() {`
What this function will do, it will go over all of the events and put it in the database. Previously we were fetching these, now we are hardcoding here in `seed.ts` file so we can input it in the database.

We do not interact with our database directly, we are using Prisma here, more specifically the `PrismaClient()`

we call `prisma.eventoEvent`, we can use that because we have created a `model EventoEvent` in `schema.prisma`, then we call `upsert` (there is also other methods such as `create` instead of `upsert`) `const result = await prisma.eventoEvent.upsert`

The benefit of using `upsert` is that it will not create new one, if it already exists. Especially with seeding data you may be running a quite of few times, we do not want to duplicate ourselves so we just use `upsert`.

---

methods we can invoke on our model here after the dot `const result = await prisma.eventoEvent. `
`aggregate, count, create, createMany, delete, deleteMany, fields, findFirst, findFirstOrThrow, findMany, findUnique, findUniqueOrThrow, groupBy, update, updateMany, upsert `

---

Here `where: { id: event.id },` we want to check for the `id`is the `event.id` we are mapping over, if it already exists, it will not create anything else.
If it does not exist yet, we add data we want to create, that would be the entire `event`, the entire object should be inserted to the database.
If it does exist, we may `update` that, we leave that empty `{}`

`seed.ts`

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const events = [
  {
    id: 1,
    name: "DJ Practice Session",
    slug: "dj-practice-session",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-10-12T00:00:00.000Z",
    organizerName: "DJ Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
  },
  {
    id: 2,
    name: "Harmony Festival",
    slug: "harmony-festival",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "Music Enthusiasts LLC",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Harmony Festival is a celebration of all music genres, bringing together musicians, artists, and music enthusiasts from around the world. Experience a day filled with live performances, interactive workshops, and a vibrant atmosphere of creativity and harmony. Join us for an unforgettable musical journey!",
  },
  {
    id: 3,
    name: "3D Animation Workshop",
    slug: "3d-animation-workshop",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-12-08T00:00:00.000Z",
    organizerName: "3D Animators Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Dive into the captivating world of 3D animation at our exclusive 3D Animation Masterclass! Whether you're an aspiring animator, a student studying animation, or a professional looking to enhance your skills, this workshop offers a unique opportunity to learn from industry experts and elevate your animation prowess.",
  },
  {
    id: 4,
    name: "Rock the City Concert",
    slug: "rock-the-city-concert",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-11-18T00:00:00.000Z",
    organizerName: "Rock On Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Get ready to rock out at Rock the City Concert! Experience electrifying performances by top rock bands, enjoy high-energy music, and immerse yourself in an unforgettable night of pure rock and roll.",
  },
  {
    id: 5,
    name: "Artisan Craft Fair",
    slug: "artisan-craft-fair",
    city: "Seattle",
    location: "Seattle Exhibition Center",
    date: "2030-12-01T00:00:00.000Z",
    organizerName: "Craftsmanship Guild",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover unique handmade crafts and artworks at the Artisan Craft Fair. Meet talented artisans, shop for one-of-a-kind items, and support local craftsmanship. Join us for a day of creativity and craftsmanship.",
  },
  {
    id: 6,
    name: "Jazz Fusion Night",
    slug: "jazz-fusion-night",
    city: "Austin",
    location: "Austin Jazz Lounge",
    date: "2030-11-29T00:00:00.000Z",
    organizerName: "Groove Masters Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Indulge in the smooth melodies and rhythmic beats of jazz fusion at Jazz Fusion Night. Experience world-class jazz performances, savor delicious cocktails, and immerse yourself in the soulful ambiance of live jazz music.",
  },
  {
    id: 7,
    name: "Indie Music Showcase",
    slug: "indie-music-showcase",
    city: "Austin",
    location: "Austin Indie Spot",
    date: "2030-11-25T00:00:00.000Z",
    organizerName: "Indie Vibes Records",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the next big indie artists at the Indie Music Showcase. Experience live performances by emerging talents, support independent music, and be part of a vibrant community of music enthusiasts and artists.",
  },
  {
    id: 8,
    name: "Global Food Festival",
    slug: "global-food-festival",
    city: "Seattle",
    location: "Seattle Waterfront Park",
    date: "2030-10-30T00:00:00.000Z",
    organizerName: "Foodie Ventures Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Embark on a culinary journey around the world at the Global Food Festival. Delight your taste buds with international cuisines, cooking demonstrations, and food tastings. Experience the flavors of different cultures in one delicious event.",
  },
  {
    id: 9,
    name: "Tech Innovators Summit",
    slug: "tech-innovators-summit",
    city: "Seattle",
    location: "Seattle Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "InnovateTech Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "The Tech Innovators Summit is where visionaries, entrepreneurs, and tech enthusiasts converge. Explore the latest technological advancements, attend insightful keynotes from industry leaders, and participate in hands-on workshops. Connect with innovators, pitch your ideas, and be a part of shaping the future of technology.",
  },
  {
    id: 10,
    name: "Enchanted Garden Gala",
    slug: "enchanted-garden-gala",
    city: "Austin",
    location: "Austin Museum of Art",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Cultural Garden Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Step into a world of wonder at the Enchanted Garden Gala, a magical evening of art, music, and fantasy. Explore enchanting garden installations, experience live performances by world-class musicians and dancers, and indulge in gourmet delicacies. Dress in your most glamorous attire and immerse yourself in a night of elegance and enchantment.",
  },
  {
    id: 11,
    name: "Comedy Extravaganza",
    slug: "comedy-extravaganza",
    city: "Austin",
    location: "Austin Laugh Factory",
    date: "2030-11-06T00:00:00.000Z",
    organizerName: "Laugh Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Prepare for a night of laughter with top comedians from around the world. Enjoy stand-up, improv, and sketches that will have you in stitches!",
  },
  {
    id: 12,
    name: "Science and Space Expo",
    slug: "science-space-expo",
    city: "Seattle",
    location: "Seattle Science Center",
    date: "2030-10-29T00:00:00.000Z",
    organizerName: "Cosmic Explorers Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Explore the wonders of science and space at this interactive expo. Engage in hands-on experiments, meet scientists, and learn about the mysteries of the universe.",
  },
  {
    id: 13,
    name: "Fashion Runway",
    slug: "fashion-runway",
    city: "Austin",
    location: "Austin Fashion Week Venue",
    date: "2030-11-12T00:00:00.000Z",
    organizerName: "Chic Trends Agency",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Witness the latest trends on the runway. Top designers will showcase their collections, setting the stage for the future of fashion.",
  },
  {
    id: 14,
    name: "Culinary Masterclass",
    slug: "culinary-masterclass",
    city: "Seattle",
    location: "Seattle Epicurean Institute",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Gourmet Chefs Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join renowned chefs for a culinary journey. Learn cooking techniques, taste exquisite dishes, and elevate your skills in the art of gastronomy.",
  },
  {
    id: 15,
    name: "Film Buffs Symposium",
    slug: "film-buffs-symposium",
    city: "Austin",
    location: "Austin Film Institute",
    date: "2030-11-08T00:00:00.000Z",
    organizerName: "Cinema Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "A gathering for film enthusiasts! Screen classic movies, engage in discussions with filmmakers, and gain insights into the world of cinema.",
  },
  {
    id: 16,
    name: "Literary Salon",
    slug: "literary-salon",
    city: "Seattle",
    location: "Seattle & Co. Bookstore",
    date: "2030-12-15T00:00:00.000Z",
    organizerName: "Words Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Celebrate the written word at this literary gathering. Listen to readings by acclaimed authors, participate in book discussions, and embrace the magic of storytelling.",
  },
  {
    id: 17,
    name: "Wellness Expo",
    slug: "wellness-expo",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-30T00:00:00.000Z",
    organizerName: "Wellness Warriors Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Immerse yourself in the world of fitness and well-being. Attend fitness classes, learn about nutrition, and explore holistic approaches to health.",
  },
  {
    id: 18,
    name: "Digital Art Symposium",
    slug: "digital-art-symposium",
    city: "Seattle",
    location: "Seattle Art Gallery",
    date: "2030-11-01T00:00:00.000Z",
    organizerName: "Tech Creatives Collective",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the intersection of technology and art. Experience digital art installations, attend VR workshops, and meet digital artists pushing creative boundaries.",
  },
  {
    id: 19,
    name: "Dance Fusion Festival",
    slug: "dance-fusion-festival",
    city: "Austin",
    location: "Austin Street Dance Studio",
    date: "2030-11-28T00:00:00.000Z",
    organizerName: "Rhythm Revolution",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Experience a blend of dance styles from around the world. Participate in dance workshops, watch electrifying performances, and dance the night away.",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const event of events) {
    const result = await prisma.eventoEvent.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
    console.log(`Created event with id: ${result.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Note, that there is an issue dealing with PostgreSQL, during the seed of the database, we replace `create: event,` with a fix code

error description in terminal

```bash
user@MacBook-Air-user evento % npx prisma db seed
Environment variables loaded from .env
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
Start seeding ...
PrismaClientValidationError:
Invalid `prisma.eventoEvent.upsert()` invocation in
/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/prisma/seed.ts:259:45

  256 console.log(`Start seeding ...`);
  257
  258 for (const event of events) {
→ 259   const result = await prisma.eventoEvent.upsert({
          where: {
            id: 1
          },
          update: {},
          create: {
            id: 1,
            ~~
            name: "DJ Practice Session",
            slug: "dj-practice-session",
            city: "Austin",
            location: "Austin Music Hall",
            date: "2030-10-12T00:00:00.000Z",
            organizerName: "DJ Inc.",
            imageUrl: "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
            description: "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
        ?   createdAt?: DateTime,
        ?   updatedAt?: DateTime
          }
        })

Unknown argument `id`. Available options are marked with ?.
    at Zn (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:117:5888)
    at ni.handleRequestError (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:124:6516)
    at ni.handleAndLogRequestError (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:124:6206)
    at ni.request (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:124:5926)
    at async l (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:129:10023) {
  clientVersion: '5.6.0'
}

An error occurred while running the seed command:
Error: Command failed with exit code 1: ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts
```

seed.ts fix

```ts
      //   create: event, // this has been replaced by the code below; V242 Prisma id issue
      // manually added between this; V242 Prisma id issue
      create: {
        name: event.name,
        slug: event.slug,
        location: event.location,
        date: event.date,
        organizerName: event.organizerName,
        imageUrl: event.imageUrl,
        description: event.description,
        // and this, to solve issue with id
```

`seed.ts` after fix

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const events = [
  {
    id: 1,
    name: "DJ Practice Session",
    slug: "dj-practice-session",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-10-12T00:00:00.000Z",
    organizerName: "DJ Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
  },
  {
    id: 2,
    name: "Harmony Festival",
    slug: "harmony-festival",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "Music Enthusiasts LLC",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Harmony Festival is a celebration of all music genres, bringing together musicians, artists, and music enthusiasts from around the world. Experience a day filled with live performances, interactive workshops, and a vibrant atmosphere of creativity and harmony. Join us for an unforgettable musical journey!",
  },
  {
    id: 3,
    name: "3D Animation Workshop",
    slug: "3d-animation-workshop",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-12-08T00:00:00.000Z",
    organizerName: "3D Animators Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Dive into the captivating world of 3D animation at our exclusive 3D Animation Masterclass! Whether you're an aspiring animator, a student studying animation, or a professional looking to enhance your skills, this workshop offers a unique opportunity to learn from industry experts and elevate your animation prowess.",
  },
  {
    id: 4,
    name: "Rock the City Concert",
    slug: "rock-the-city-concert",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-11-18T00:00:00.000Z",
    organizerName: "Rock On Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Get ready to rock out at Rock the City Concert! Experience electrifying performances by top rock bands, enjoy high-energy music, and immerse yourself in an unforgettable night of pure rock and roll.",
  },
  {
    id: 5,
    name: "Artisan Craft Fair",
    slug: "artisan-craft-fair",
    city: "Seattle",
    location: "Seattle Exhibition Center",
    date: "2030-12-01T00:00:00.000Z",
    organizerName: "Craftsmanship Guild",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover unique handmade crafts and artworks at the Artisan Craft Fair. Meet talented artisans, shop for one-of-a-kind items, and support local craftsmanship. Join us for a day of creativity and craftsmanship.",
  },
  {
    id: 6,
    name: "Jazz Fusion Night",
    slug: "jazz-fusion-night",
    city: "Austin",
    location: "Austin Jazz Lounge",
    date: "2030-11-29T00:00:00.000Z",
    organizerName: "Groove Masters Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Indulge in the smooth melodies and rhythmic beats of jazz fusion at Jazz Fusion Night. Experience world-class jazz performances, savor delicious cocktails, and immerse yourself in the soulful ambiance of live jazz music.",
  },
  {
    id: 7,
    name: "Indie Music Showcase",
    slug: "indie-music-showcase",
    city: "Austin",
    location: "Austin Indie Spot",
    date: "2030-11-25T00:00:00.000Z",
    organizerName: "Indie Vibes Records",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the next big indie artists at the Indie Music Showcase. Experience live performances by emerging talents, support independent music, and be part of a vibrant community of music enthusiasts and artists.",
  },
  {
    id: 8,
    name: "Global Food Festival",
    slug: "global-food-festival",
    city: "Seattle",
    location: "Seattle Waterfront Park",
    date: "2030-10-30T00:00:00.000Z",
    organizerName: "Foodie Ventures Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Embark on a culinary journey around the world at the Global Food Festival. Delight your taste buds with international cuisines, cooking demonstrations, and food tastings. Experience the flavors of different cultures in one delicious event.",
  },
  {
    id: 9,
    name: "Tech Innovators Summit",
    slug: "tech-innovators-summit",
    city: "Seattle",
    location: "Seattle Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "InnovateTech Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "The Tech Innovators Summit is where visionaries, entrepreneurs, and tech enthusiasts converge. Explore the latest technological advancements, attend insightful keynotes from industry leaders, and participate in hands-on workshops. Connect with innovators, pitch your ideas, and be a part of shaping the future of technology.",
  },
  {
    id: 10,
    name: "Enchanted Garden Gala",
    slug: "enchanted-garden-gala",
    city: "Austin",
    location: "Austin Museum of Art",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Cultural Garden Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Step into a world of wonder at the Enchanted Garden Gala, a magical evening of art, music, and fantasy. Explore enchanting garden installations, experience live performances by world-class musicians and dancers, and indulge in gourmet delicacies. Dress in your most glamorous attire and immerse yourself in a night of elegance and enchantment.",
  },
  {
    id: 11,
    name: "Comedy Extravaganza",
    slug: "comedy-extravaganza",
    city: "Austin",
    location: "Austin Laugh Factory",
    date: "2030-11-06T00:00:00.000Z",
    organizerName: "Laugh Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Prepare for a night of laughter with top comedians from around the world. Enjoy stand-up, improv, and sketches that will have you in stitches!",
  },
  {
    id: 12,
    name: "Science and Space Expo",
    slug: "science-space-expo",
    city: "Seattle",
    location: "Seattle Science Center",
    date: "2030-10-29T00:00:00.000Z",
    organizerName: "Cosmic Explorers Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Explore the wonders of science and space at this interactive expo. Engage in hands-on experiments, meet scientists, and learn about the mysteries of the universe.",
  },
  {
    id: 13,
    name: "Fashion Runway",
    slug: "fashion-runway",
    city: "Austin",
    location: "Austin Fashion Week Venue",
    date: "2030-11-12T00:00:00.000Z",
    organizerName: "Chic Trends Agency",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Witness the latest trends on the runway. Top designers will showcase their collections, setting the stage for the future of fashion.",
  },
  {
    id: 14,
    name: "Culinary Masterclass",
    slug: "culinary-masterclass",
    city: "Seattle",
    location: "Seattle Epicurean Institute",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Gourmet Chefs Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join renowned chefs for a culinary journey. Learn cooking techniques, taste exquisite dishes, and elevate your skills in the art of gastronomy.",
  },
  {
    id: 15,
    name: "Film Buffs Symposium",
    slug: "film-buffs-symposium",
    city: "Austin",
    location: "Austin Film Institute",
    date: "2030-11-08T00:00:00.000Z",
    organizerName: "Cinema Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "A gathering for film enthusiasts! Screen classic movies, engage in discussions with filmmakers, and gain insights into the world of cinema.",
  },
  {
    id: 16,
    name: "Literary Salon",
    slug: "literary-salon",
    city: "Seattle",
    location: "Seattle & Co. Bookstore",
    date: "2030-12-15T00:00:00.000Z",
    organizerName: "Words Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Celebrate the written word at this literary gathering. Listen to readings by acclaimed authors, participate in book discussions, and embrace the magic of storytelling.",
  },
  {
    id: 17,
    name: "Wellness Expo",
    slug: "wellness-expo",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-30T00:00:00.000Z",
    organizerName: "Wellness Warriors Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Immerse yourself in the world of fitness and well-being. Attend fitness classes, learn about nutrition, and explore holistic approaches to health.",
  },
  {
    id: 18,
    name: "Digital Art Symposium",
    slug: "digital-art-symposium",
    city: "Seattle",
    location: "Seattle Art Gallery",
    date: "2030-11-01T00:00:00.000Z",
    organizerName: "Tech Creatives Collective",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the intersection of technology and art. Experience digital art installations, attend VR workshops, and meet digital artists pushing creative boundaries.",
  },
  {
    id: 19,
    name: "Dance Fusion Festival",
    slug: "dance-fusion-festival",
    city: "Austin",
    location: "Austin Street Dance Studio",
    date: "2030-11-28T00:00:00.000Z",
    organizerName: "Rhythm Revolution",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Experience a blend of dance styles from around the world. Participate in dance workshops, watch electrifying performances, and dance the night away.",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const event of events) {
    const result = await prisma.eventoEvent.upsert({
      where: { id: event.id },
      update: {},
      //   create: event, // this has been replaced by the code below; V242 Prisma id issue
      // manually added between this; V242 Prisma id issue
      create: {
        name: event.name,
        slug: event.slug,
        location: event.location,
        date: event.date,
        organizerName: event.organizerName,
        imageUrl: event.imageUrl,
        description: event.description,
        // and this, to solve issue with id
    });
    console.log(`Created event with id: ${result.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Basically we need to run the script that will fill our database with data. This is the exact data we were fetching from bytegrad URL.

Now we need to run the `seed.ts` script, we go to `package.json`. Prisma recommends to add script in `package.json`, just like we have other scripts, Prisma also gives way to do that. Prisma recommends to add `"prisma"` key to `package.json`, and there is going to be a `seed` script here. It will use something called `ts-node`, we are going to run `seed.ts`, we need something that can interpret TypeScript, compile it properly, we are going to use `ts-node` for that, we have `--compiler-options`, we have module CommonJS, this is necessary because we are using Next.js, and there `prisma/seed.ts` we have link to the actual file.

To run this seed file we do need `ts-node`, we need to install that as dev dependency
`/evento/ $ npm install ts-node@10.9.1 --save-dev`

Now to run the `seed.ts` we run `/evento/ $ npx prisma db seed`

Seeding succeeded!

```bash
user@MacBook-Air-user evento % npx prisma db seed
Environment variables loaded from .env
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
Start seeding ...
Created event with id: 1
Created event with id: 2
Created event with id: 3
Created event with id: 4
Created event with id: 5
Created event with id: 6
Created event with id: 7
Created event with id: 8
Created event with id: 9
Created event with id: 10
Created event with id: 11
Created event with id: 12
Created event with id: 13
Created event with id: 14
Created event with id: 15
Created event with id: 16
Created event with id: 17
Created event with id: 18
Created event with id: 19
Seeding finished.

🌱  The seed command has been executed.
```

`package.json` before change

```tsx
{
  "name": "evento",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "clsx": "^2.1.1",
    "framer-motion": "^10.16.4",
    "next": "14.0.1",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.1",
    "postcss": "^8",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

seed-script.txt

```txt
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
},
```

`package.json` after change

```tsx
{
  "name": "evento",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "prisma": {  // <- added
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "clsx": "^2.1.1",
    "framer-motion": "^10.16.4",
    "next": "14.0.1",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.1",
    "postcss": "^8",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.0",
    "ts-node": "^10.9.1", // <- added
    "typescript": "^5"
  }
}
```

---

## hot fix for type in `utils.ts` fragment

in `utils.ts` we add type `EventoEvent` to `const event` as a quick fix to be consistent

`utils.ts` fragment

```ts
// V240
export async function getEvents(city: string) {
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
  );
  const events: EventoEvent[] = await response.json();
  return events;
}

export async function getEvent(slug: string) {
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
  );
  const event: EventoEvent = await response.json(); // <- V242 quick fix type
  return event;
}
// V240 end
```

---

## Prisma syntax formatting

To make sure we have Prisma `schema.prisma` formatting, we open **Open User Settings (JSON) command in the Command Palette** using (Ctrl+Shift+P) or Cmd+Shift+P on MacOS
Then we need to make sure we have Prisma formatting working:

```json
  "[prisma]": {
    "editor.defaultFormatter": "Prisma.prisma"
  },
```

---

## 2. PostgreSQL alternative route by MN

-> `$ npx prisma init --datasource-provider postgresql`

it automatically created new folder with a file `/prisma/schema.prisma`

Prisma will generate client for us, client is what we will use in code to interact with our database. File will have an information about the `datasource`. `DATABASE_URL` is an environment variable to connect to database. That `DATABASE_URL` residues in `.env` file, for PostgreSQL that is an URL to connect to the database

`schema.prisma` file

```tsx
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

`.env` file, `DATABASE_URL` is checked and working

```bash
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public" ##this is default
DATABASE_URL="postgresql://evento:evento@localhost:5432/evento_db?schema=public"
```

Let's go to `schema.prisma` file, before we create database and add data to the database, we should specify to Prisma what our data is going to look like, what shape does our data have. We do it with so called `model`, in SQL it is called `table`

We will create `model` `EventoEvent`, that is very similar to the type we have created before in `types.ts`. `EventoEvent` should have an id.

`schema.prisma` has it's own syntax.
In VS Code we should install extension called Prisma, that adds syntax highlighting, formatting, auto-completion, jump-to-definition etc. so we can easily deal with `schema.prisma` files.

### `EventoEvent` model (table) in Prisma

`Id` field of `EventoEvent` model (table) should be an integer and it should be an `@id`, `@id` is basically what Prisma will use to uniquely identify event. By `@default` it should auto increment.

Every event will have a `name`, that is going to be `String`

`slug` is `String` `@unique` - make sure you add this `@unique` to the `slug`, because these events what we have, we need to be able to distinguish them by the `slug`, we go to `localhost:3000/event/[slug]`, e.g. `http://localhost:3000/event/dj-practice-session`, there should only be one event in the database that matches that, if we get 2 matches in the database we won't show them in the one URL, in Prisma if `@unique` is forgotten we will run into issues

`city` is `String`
`location` is `String`
`date` should be `DateTime`
`organizerName` `String`
`imageUrl` `String`
`description` `String`

In Prisma also we want to keep track of when this event was created in the database, we can use `createdAt DateTime @default(now())`, when it is actually inserted or created in the database it will take current timestamp, ant that will be the default value for `createdAt`

And we also want to keep track when it is updated `updatedAt DateTime @updatedAt`. The first `updatedAt` we can call it whatever we want, but here `@updatedAt` we tell Prisma, that this is what we want to use to keep track of the update

`schema.prisma`

```tsx
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model EventoEvent {
  id            Int      @id @default(autoincrement())
  name          String
  slug          String   @unique
  location      String
  date          DateTime
  organizerName String
  imageUrl      String
  description   String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

types.ts

```ts
export type EventoEvent = {
  id: number;
  name: string;
  slug: string;
  city: string;
  location: string;
  date: Date;
  organizerName: string;
  imageUrl: string;
  description: string;
};
```

Now we have a description what we want our database to look like, now we can actually create a database and immediately here `schema.prisma` create a table for a database as well.

What we can do in terminal `/evento/ $ npx prisma db push`

```
Datasource "db": PostgreSQL database "evento_db", schema "public" at "localhost:5432"
```

Now this PostgreSQL local database is convenient for local development.

It also generates something called
`Generated Prisma Client (v5.6.0) to ./node_modules/@prisma/client in 54ms`
which is what we will actually use to interact with database in our code
Now everything is ready for us to use that.

### One source of truth, using model (SQL table) from Prisma just as imported type is TypeScript

We are using type `EventoEvent` from `types.ts`, now we also have `model EventoEvent`(table) in Prisma. Now we have 2 ways to describe `EventoEvent`, and typically you do not wanna have that. You want one source of truth.

`types.ts`

```ts
export type EventoEvent = {
  id: number;
  name: string;
  slug: string;
  city: string;
  location: string;
  date: Date;
  organizerName: string;
  imageUrl: string;
  description: string;
};
```

We use that `EventoEvent`type in `event-card.tsx`

```tsx
import { EventoEvent } from "@/lib/types";
```

We can now import that from Prisma Client now, Prisma automatically when we run command `/evento/ $ npx prisma db push` will create type out of `model EventoEvent` as well. We can import type from there.

```tsx
import { EventoEvent } from "@prisma/client";
```

we change source of the type for `utils.ts` and `event-card.tsx`

### fetching not from URL, but locally

Right now we are fetching the data from other server (URL), we want to get from our database now, our database will need that data

`utils.ts` fragment

```ts
`https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`
`https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
);
```

We need to add data to the database, before we can grab data from there.

How we can see what is in the database? Prisma helps us out as well, we can run in terminal

`/evento/$ npx prisma studio`

that will open up web tool Prisma Studio at http://localhost:5555

It will open up database in the new tab, it will actually show what is in the database

We can look up what is in the model we have created.

For now we do not see any data, no rows in the table (we did not put any data whatsoever yet), we only see columns in the table according to our model we defined in the schema.

How can we add data into the database. What we want to do is to seed the database, we want to add initial data, so we can play around and get started.

Inside the `/prisma/` folder we can create `seed.ts` file.

In `seed.ts` we import Prisma client, so we can programmatically interact with database.
We have `events` that holds the array, of objects that hold key-value pair for each column in the table, Prisma's `model`. Each event is represented by the object that has properties.

`main()` function is called at the bottom, we have `main()` definition `async function main() {`
What this function will do, it will go over all of the events and put it in the database. Previously we were fetching these, now we are hardcoding here in `seed.ts` file so we can input it in the database.

We do not interact with our database directly, we are using Prisma here, more specifically the `PrismaClient()`

we call `prisma.eventoEvent`, we can use that because we have created a `model EventoEvent` in `schema.prisma`, then we call `upsert` (there is also other methods such as `create` instead of `upsert`) `const result = await prisma.eventoEvent.upsert`

The benefit of using `upsert` is that it will not create new one, if it already exists. Especially with seeding data you may be running a quite of few times, we do not want to duplicate ourselves so we just use `upsert`.

---

methods we can invoke on our model here after the dot `const result = await prisma.eventoEvent. `
`aggregate, count, create, createMany, delete, deleteMany, fields, findFirst, findFirstOrThrow, findMany, findUnique, findUniqueOrThrow, groupBy, update, updateMany, upsert `

---

Here `where: { id: event.id },` we want to check for the `id`is the `event.id` we are mapping over, if it already exists, it will not create anything else.
If it does not exist yet, we add data we want to create, that would be the entire `event`, the entire object should be inserted to the database.
If it does exist, we may `update` that, we leave that empty `{}`

`seed.ts`

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const events = [
  {
    id: 1,
    name: "DJ Practice Session",
    slug: "dj-practice-session",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-10-12T00:00:00.000Z",
    organizerName: "DJ Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
  },
  {
    id: 2,
    name: "Harmony Festival",
    slug: "harmony-festival",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "Music Enthusiasts LLC",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Harmony Festival is a celebration of all music genres, bringing together musicians, artists, and music enthusiasts from around the world. Experience a day filled with live performances, interactive workshops, and a vibrant atmosphere of creativity and harmony. Join us for an unforgettable musical journey!",
  },
  {
    id: 3,
    name: "3D Animation Workshop",
    slug: "3d-animation-workshop",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-12-08T00:00:00.000Z",
    organizerName: "3D Animators Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Dive into the captivating world of 3D animation at our exclusive 3D Animation Masterclass! Whether you're an aspiring animator, a student studying animation, or a professional looking to enhance your skills, this workshop offers a unique opportunity to learn from industry experts and elevate your animation prowess.",
  },
  {
    id: 4,
    name: "Rock the City Concert",
    slug: "rock-the-city-concert",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-11-18T00:00:00.000Z",
    organizerName: "Rock On Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Get ready to rock out at Rock the City Concert! Experience electrifying performances by top rock bands, enjoy high-energy music, and immerse yourself in an unforgettable night of pure rock and roll.",
  },
  {
    id: 5,
    name: "Artisan Craft Fair",
    slug: "artisan-craft-fair",
    city: "Seattle",
    location: "Seattle Exhibition Center",
    date: "2030-12-01T00:00:00.000Z",
    organizerName: "Craftsmanship Guild",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover unique handmade crafts and artworks at the Artisan Craft Fair. Meet talented artisans, shop for one-of-a-kind items, and support local craftsmanship. Join us for a day of creativity and craftsmanship.",
  },
  {
    id: 6,
    name: "Jazz Fusion Night",
    slug: "jazz-fusion-night",
    city: "Austin",
    location: "Austin Jazz Lounge",
    date: "2030-11-29T00:00:00.000Z",
    organizerName: "Groove Masters Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Indulge in the smooth melodies and rhythmic beats of jazz fusion at Jazz Fusion Night. Experience world-class jazz performances, savor delicious cocktails, and immerse yourself in the soulful ambiance of live jazz music.",
  },
  {
    id: 7,
    name: "Indie Music Showcase",
    slug: "indie-music-showcase",
    city: "Austin",
    location: "Austin Indie Spot",
    date: "2030-11-25T00:00:00.000Z",
    organizerName: "Indie Vibes Records",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the next big indie artists at the Indie Music Showcase. Experience live performances by emerging talents, support independent music, and be part of a vibrant community of music enthusiasts and artists.",
  },
  {
    id: 8,
    name: "Global Food Festival",
    slug: "global-food-festival",
    city: "Seattle",
    location: "Seattle Waterfront Park",
    date: "2030-10-30T00:00:00.000Z",
    organizerName: "Foodie Ventures Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Embark on a culinary journey around the world at the Global Food Festival. Delight your taste buds with international cuisines, cooking demonstrations, and food tastings. Experience the flavors of different cultures in one delicious event.",
  },
  {
    id: 9,
    name: "Tech Innovators Summit",
    slug: "tech-innovators-summit",
    city: "Seattle",
    location: "Seattle Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "InnovateTech Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "The Tech Innovators Summit is where visionaries, entrepreneurs, and tech enthusiasts converge. Explore the latest technological advancements, attend insightful keynotes from industry leaders, and participate in hands-on workshops. Connect with innovators, pitch your ideas, and be a part of shaping the future of technology.",
  },
  {
    id: 10,
    name: "Enchanted Garden Gala",
    slug: "enchanted-garden-gala",
    city: "Austin",
    location: "Austin Museum of Art",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Cultural Garden Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Step into a world of wonder at the Enchanted Garden Gala, a magical evening of art, music, and fantasy. Explore enchanting garden installations, experience live performances by world-class musicians and dancers, and indulge in gourmet delicacies. Dress in your most glamorous attire and immerse yourself in a night of elegance and enchantment.",
  },
  {
    id: 11,
    name: "Comedy Extravaganza",
    slug: "comedy-extravaganza",
    city: "Austin",
    location: "Austin Laugh Factory",
    date: "2030-11-06T00:00:00.000Z",
    organizerName: "Laugh Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Prepare for a night of laughter with top comedians from around the world. Enjoy stand-up, improv, and sketches that will have you in stitches!",
  },
  {
    id: 12,
    name: "Science and Space Expo",
    slug: "science-space-expo",
    city: "Seattle",
    location: "Seattle Science Center",
    date: "2030-10-29T00:00:00.000Z",
    organizerName: "Cosmic Explorers Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Explore the wonders of science and space at this interactive expo. Engage in hands-on experiments, meet scientists, and learn about the mysteries of the universe.",
  },
  {
    id: 13,
    name: "Fashion Runway",
    slug: "fashion-runway",
    city: "Austin",
    location: "Austin Fashion Week Venue",
    date: "2030-11-12T00:00:00.000Z",
    organizerName: "Chic Trends Agency",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Witness the latest trends on the runway. Top designers will showcase their collections, setting the stage for the future of fashion.",
  },
  {
    id: 14,
    name: "Culinary Masterclass",
    slug: "culinary-masterclass",
    city: "Seattle",
    location: "Seattle Epicurean Institute",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Gourmet Chefs Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join renowned chefs for a culinary journey. Learn cooking techniques, taste exquisite dishes, and elevate your skills in the art of gastronomy.",
  },
  {
    id: 15,
    name: "Film Buffs Symposium",
    slug: "film-buffs-symposium",
    city: "Austin",
    location: "Austin Film Institute",
    date: "2030-11-08T00:00:00.000Z",
    organizerName: "Cinema Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "A gathering for film enthusiasts! Screen classic movies, engage in discussions with filmmakers, and gain insights into the world of cinema.",
  },
  {
    id: 16,
    name: "Literary Salon",
    slug: "literary-salon",
    city: "Seattle",
    location: "Seattle & Co. Bookstore",
    date: "2030-12-15T00:00:00.000Z",
    organizerName: "Words Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Celebrate the written word at this literary gathering. Listen to readings by acclaimed authors, participate in book discussions, and embrace the magic of storytelling.",
  },
  {
    id: 17,
    name: "Wellness Expo",
    slug: "wellness-expo",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-30T00:00:00.000Z",
    organizerName: "Wellness Warriors Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Immerse yourself in the world of fitness and well-being. Attend fitness classes, learn about nutrition, and explore holistic approaches to health.",
  },
  {
    id: 18,
    name: "Digital Art Symposium",
    slug: "digital-art-symposium",
    city: "Seattle",
    location: "Seattle Art Gallery",
    date: "2030-11-01T00:00:00.000Z",
    organizerName: "Tech Creatives Collective",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the intersection of technology and art. Experience digital art installations, attend VR workshops, and meet digital artists pushing creative boundaries.",
  },
  {
    id: 19,
    name: "Dance Fusion Festival",
    slug: "dance-fusion-festival",
    city: "Austin",
    location: "Austin Street Dance Studio",
    date: "2030-11-28T00:00:00.000Z",
    organizerName: "Rhythm Revolution",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Experience a blend of dance styles from around the world. Participate in dance workshops, watch electrifying performances, and dance the night away.",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const event of events) {
    const result = await prisma.eventoEvent.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
    console.log(`Created event with id: ${result.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Note, that there is an issue dealing with PostgreSQL, during the seed of the database, we replace `create: event,` with a fix code

error description in terminal

```bash
user@MacBook-Air-user evento % npx prisma db seed
Environment variables loaded from .env
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
Start seeding ...
PrismaClientValidationError:
Invalid `prisma.eventoEvent.upsert()` invocation in
/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/prisma/seed.ts:259:45

  256 console.log(`Start seeding ...`);
  257
  258 for (const event of events) {
→ 259   const result = await prisma.eventoEvent.upsert({
          where: {
            id: 1
          },
          update: {},
          create: {
            id: 1,
            ~~
            name: "DJ Practice Session",
            slug: "dj-practice-session",
            city: "Austin",
            location: "Austin Music Hall",
            date: "2030-10-12T00:00:00.000Z",
            organizerName: "DJ Inc.",
            imageUrl: "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
            description: "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
        ?   createdAt?: DateTime,
        ?   updatedAt?: DateTime
          }
        })

Unknown argument `id`. Available options are marked with ?.
    at Zn (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:117:5888)
    at ni.handleRequestError (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:124:6516)
    at ni.handleAndLogRequestError (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:124:6206)
    at ni.request (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:124:5926)
    at async l (/Users/user/_DEVELOPER/_Bytegrad_Professional-React-and-NextJS-Course/evento/node_modules/@prisma/client/runtime/library.js:129:10023) {
  clientVersion: '5.6.0'
}

An error occurred while running the seed command:
Error: Command failed with exit code 1: ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts
```

seed.ts fix

```ts
      //   create: event, // this has been replaced by the code below; V242 Prisma id issue
      // manually added between this; V242 Prisma id issue
      create: {
        name: event.name,
        slug: event.slug,
        location: event.location,
        date: event.date,
        organizerName: event.organizerName,
        imageUrl: event.imageUrl,
        description: event.description,
        // and this, to solve issue with id
```

`seed.ts` after fix

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const events = [
  {
    id: 1,
    name: "DJ Practice Session",
    slug: "dj-practice-session",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-10-12T00:00:00.000Z",
    organizerName: "DJ Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join us for an immersive DJ practice session at the DJ Beats Workshop! Whether you're a beginner aspiring to spin the decks or an experienced DJ looking to refine your skills, this event is tailored just for you. Dive into the world of beats, mixes, and electronic rhythms under the guidance of seasoned DJs and music producers. Showcase your skills during our open decks session. Share your favorite tracks, experiment with live remixing, and receive applause and feedback from a supportive audience.",
  },
  {
    id: 2,
    name: "Harmony Festival",
    slug: "harmony-festival",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "Music Enthusiasts LLC",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Harmony Festival is a celebration of all music genres, bringing together musicians, artists, and music enthusiasts from around the world. Experience a day filled with live performances, interactive workshops, and a vibrant atmosphere of creativity and harmony. Join us for an unforgettable musical journey!",
  },
  {
    id: 3,
    name: "3D Animation Workshop",
    slug: "3d-animation-workshop",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-12-08T00:00:00.000Z",
    organizerName: "3D Animators Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Dive into the captivating world of 3D animation at our exclusive 3D Animation Masterclass! Whether you're an aspiring animator, a student studying animation, or a professional looking to enhance your skills, this workshop offers a unique opportunity to learn from industry experts and elevate your animation prowess.",
  },
  {
    id: 4,
    name: "Rock the City Concert",
    slug: "rock-the-city-concert",
    city: "Austin",
    location: "Austin Music Hall",
    date: "2030-11-18T00:00:00.000Z",
    organizerName: "Rock On Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Get ready to rock out at Rock the City Concert! Experience electrifying performances by top rock bands, enjoy high-energy music, and immerse yourself in an unforgettable night of pure rock and roll.",
  },
  {
    id: 5,
    name: "Artisan Craft Fair",
    slug: "artisan-craft-fair",
    city: "Seattle",
    location: "Seattle Exhibition Center",
    date: "2030-12-01T00:00:00.000Z",
    organizerName: "Craftsmanship Guild",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover unique handmade crafts and artworks at the Artisan Craft Fair. Meet talented artisans, shop for one-of-a-kind items, and support local craftsmanship. Join us for a day of creativity and craftsmanship.",
  },
  {
    id: 6,
    name: "Jazz Fusion Night",
    slug: "jazz-fusion-night",
    city: "Austin",
    location: "Austin Jazz Lounge",
    date: "2030-11-29T00:00:00.000Z",
    organizerName: "Groove Masters Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Indulge in the smooth melodies and rhythmic beats of jazz fusion at Jazz Fusion Night. Experience world-class jazz performances, savor delicious cocktails, and immerse yourself in the soulful ambiance of live jazz music.",
  },
  {
    id: 7,
    name: "Indie Music Showcase",
    slug: "indie-music-showcase",
    city: "Austin",
    location: "Austin Indie Spot",
    date: "2030-11-25T00:00:00.000Z",
    organizerName: "Indie Vibes Records",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the next big indie artists at the Indie Music Showcase. Experience live performances by emerging talents, support independent music, and be part of a vibrant community of music enthusiasts and artists.",
  },
  {
    id: 8,
    name: "Global Food Festival",
    slug: "global-food-festival",
    city: "Seattle",
    location: "Seattle Waterfront Park",
    date: "2030-10-30T00:00:00.000Z",
    organizerName: "Foodie Ventures Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Embark on a culinary journey around the world at the Global Food Festival. Delight your taste buds with international cuisines, cooking demonstrations, and food tastings. Experience the flavors of different cultures in one delicious event.",
  },
  {
    id: 9,
    name: "Tech Innovators Summit",
    slug: "tech-innovators-summit",
    city: "Seattle",
    location: "Seattle Convention Center",
    date: "2030-11-15T00:00:00.000Z",
    organizerName: "InnovateTech Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "The Tech Innovators Summit is where visionaries, entrepreneurs, and tech enthusiasts converge. Explore the latest technological advancements, attend insightful keynotes from industry leaders, and participate in hands-on workshops. Connect with innovators, pitch your ideas, and be a part of shaping the future of technology.",
  },
  {
    id: 10,
    name: "Enchanted Garden Gala",
    slug: "enchanted-garden-gala",
    city: "Austin",
    location: "Austin Museum of Art",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Cultural Garden Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Step into a world of wonder at the Enchanted Garden Gala, a magical evening of art, music, and fantasy. Explore enchanting garden installations, experience live performances by world-class musicians and dancers, and indulge in gourmet delicacies. Dress in your most glamorous attire and immerse yourself in a night of elegance and enchantment.",
  },
  {
    id: 11,
    name: "Comedy Extravaganza",
    slug: "comedy-extravaganza",
    city: "Austin",
    location: "Austin Laugh Factory",
    date: "2030-11-06T00:00:00.000Z",
    organizerName: "Laugh Productions",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Prepare for a night of laughter with top comedians from around the world. Enjoy stand-up, improv, and sketches that will have you in stitches!",
  },
  {
    id: 12,
    name: "Science and Space Expo",
    slug: "science-space-expo",
    city: "Seattle",
    location: "Seattle Science Center",
    date: "2030-10-29T00:00:00.000Z",
    organizerName: "Cosmic Explorers Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Explore the wonders of science and space at this interactive expo. Engage in hands-on experiments, meet scientists, and learn about the mysteries of the universe.",
  },
  {
    id: 13,
    name: "Fashion Runway",
    slug: "fashion-runway",
    city: "Austin",
    location: "Austin Fashion Week Venue",
    date: "2030-11-12T00:00:00.000Z",
    organizerName: "Chic Trends Agency",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Witness the latest trends on the runway. Top designers will showcase their collections, setting the stage for the future of fashion.",
  },
  {
    id: 14,
    name: "Culinary Masterclass",
    slug: "culinary-masterclass",
    city: "Seattle",
    location: "Seattle Epicurean Institute",
    date: "2030-12-02T00:00:00.000Z",
    organizerName: "Gourmet Chefs Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Join renowned chefs for a culinary journey. Learn cooking techniques, taste exquisite dishes, and elevate your skills in the art of gastronomy.",
  },
  {
    id: 15,
    name: "Film Buffs Symposium",
    slug: "film-buffs-symposium",
    city: "Austin",
    location: "Austin Film Institute",
    date: "2030-11-08T00:00:00.000Z",
    organizerName: "Cinema Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "A gathering for film enthusiasts! Screen classic movies, engage in discussions with filmmakers, and gain insights into the world of cinema.",
  },
  {
    id: 16,
    name: "Literary Salon",
    slug: "literary-salon",
    city: "Seattle",
    location: "Seattle & Co. Bookstore",
    date: "2030-12-15T00:00:00.000Z",
    organizerName: "Words Society",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Celebrate the written word at this literary gathering. Listen to readings by acclaimed authors, participate in book discussions, and embrace the magic of storytelling.",
  },
  {
    id: 17,
    name: "Wellness Expo",
    slug: "wellness-expo",
    city: "Austin",
    location: "Austin Convention Center",
    date: "2030-11-30T00:00:00.000Z",
    organizerName: "Wellness Warriors Inc.",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Immerse yourself in the world of fitness and well-being. Attend fitness classes, learn about nutrition, and explore holistic approaches to health.",
  },
  {
    id: 18,
    name: "Digital Art Symposium",
    slug: "digital-art-symposium",
    city: "Seattle",
    location: "Seattle Art Gallery",
    date: "2030-11-01T00:00:00.000Z",
    organizerName: "Tech Creatives Collective",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Discover the intersection of technology and art. Experience digital art installations, attend VR workshops, and meet digital artists pushing creative boundaries.",
  },
  {
    id: 19,
    name: "Dance Fusion Festival",
    slug: "dance-fusion-festival",
    city: "Austin",
    location: "Austin Street Dance Studio",
    date: "2030-11-28T00:00:00.000Z",
    organizerName: "Rhythm Revolution",
    imageUrl:
      "https://images.unsplash.com/photo-1642178225043-f299072af862?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=100",
    description:
      "Experience a blend of dance styles from around the world. Participate in dance workshops, watch electrifying performances, and dance the night away.",
  },
];

async function main() {
  console.log(`Start seeding ...`);

  for (const event of events) {
    const result = await prisma.eventoEvent.upsert({
      where: { id: event.id },
      update: {},
      //   create: event, // this has been replaced by the code below; V242 Prisma id issue
      // manually added between this; V242 Prisma id issue
      create: {
        name: event.name,
        slug: event.slug,
        location: event.location,
        date: event.date,
        organizerName: event.organizerName,
        imageUrl: event.imageUrl,
        description: event.description,
        // and this, to solve issue with id
    });
    console.log(`Created event with id: ${result.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Basically we need to run the script that will fill our database with data. This is the exact data we were fetching from bytegrad URL.

Now we need to run the `seed.ts` script, we go to `package.json`. Prisma recommends to add script in `package.json`, just like we have other scripts, Prisma also gives way to do that. Prisma recommends to add `"prisma"` key to `package.json`, and there is going to be a `seed` script here. It will use something called `ts-node`, we are going to run `seed.ts`, we need something that can interpret TypeScript, compile it properly, we are going to use `ts-node` for that, we have `--compiler-options`, we have module CommonJS, this is necessary because we are using Next.js, and there `prisma/seed.ts` we have link to the actual file.

To run this seed file we do need `ts-node`, we need to install that as dev dependency
`/evento/ $ npm install ts-node@10.9.1 --save-dev`

Now to run the `seed.ts` we run `/evento/ $ npx prisma db seed`

Seeding succeeded!

```bash
user@MacBook-Air-user evento % npx prisma db seed
Environment variables loaded from .env
Running seed command `ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts` ...
Start seeding ...
Created event with id: 1
Created event with id: 2
Created event with id: 3
Created event with id: 4
Created event with id: 5
Created event with id: 6
Created event with id: 7
Created event with id: 8
Created event with id: 9
Created event with id: 10
Created event with id: 11
Created event with id: 12
Created event with id: 13
Created event with id: 14
Created event with id: 15
Created event with id: 16
Created event with id: 17
Created event with id: 18
Created event with id: 19
Seeding finished.

🌱  The seed command has been executed.
```

`package.json` before change

```tsx
{
  "name": "evento",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "clsx": "^2.1.1",
    "framer-motion": "^10.16.4",
    "next": "14.0.1",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.1",
    "postcss": "^8",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}
```

seed-script.txt

```txt
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
},
```

`package.json` after change

```tsx
{
  "name": "evento",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "prisma": {  // <- added
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "^5.6.0",
    "clsx": "^2.1.1",
    "framer-motion": "^10.16.4",
    "next": "14.0.1",
    "react": "^18",
    "react-dom": "^18",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "eslint": "^8",
    "eslint-config-next": "14.0.1",
    "postcss": "^8",
    "prisma": "^5.6.0",
    "tailwindcss": "^3.3.0",
    "ts-node": "^10.9.1", // <- added
    "typescript": "^5"
  }
}
```

---

## PostgreSQL

To initialize a new Prisma project with PostgreSQL as the data source provider, you can use the `npx prisma init` command with the appropriate options. Here’s how you can do it:

1. Open your terminal.
2. Run the following command:

```bash
npx prisma init --datasource-provider postgresql
```

This command sets up the Prisma configuration for PostgreSQL. Additionally, you will need to provide the connection URL to your PostgreSQL database in the `.env` file that Prisma creates.

Here’s an example of what your `.env` file might look like:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials and database details. For example:

```env
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public"
```

After setting up the `.env` file with your database connection URL, you can proceed to use Prisma with your PostgreSQL database.

---

## MongoDB

To initialize a new Prisma project with MongoDB as the data source provider, you can use the `npx prisma init` command with the appropriate options. Here’s how you can do it:

1. Open your terminal.
2. Run the following command:

```bash
npx prisma init --datasource-provider mongodb
```

This command sets up the Prisma configuration for MongoDB. Additionally, you will need to provide the connection URL to your MongoDB database in the `.env` file that Prisma creates.

Here’s an example of what your `.env` file might look like:

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@CLUSTER/DATABASE"
```

Replace `USER`, `PASSWORD`, `CLUSTER`, and `DATABASE` with your MongoDB credentials and database details. For example:

```env
DATABASE_URL="mongodb+srv://myuser:mypassword@cluster0.mongodb.net/mydatabase"
```

After setting up the `.env` file with your database connection URL, you can proceed to use Prisma with your MongoDB database.

---
