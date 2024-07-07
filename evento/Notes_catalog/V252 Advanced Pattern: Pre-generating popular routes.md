## V252 Advanced Pattern: Pre-Generating Popular Routes

Description: A route that is dynamic will not be statically rendered during the build. However, you can still statically render some popular routes in Next.js.

Here both routes are dynamically rendered

```bash
├ λ /event/[slug]
├ λ /events/[city]
```

but we can imagine that we go to e.g. `/event/[slug]/page.tsx`, that maybe some of these events are going to be popular. Maybe there is a way to make some of those statically rendered.

Here we have `EventPage`, maybe we can make some of these slugs `const slug = params.slug;`, we can also make them static.

That is more advanced technique, what we can do in here

We can create another function. Because here in the page component, we are using `params` -> `EventPage({ params }`, we can already tell Next.js that during the build it should run this component for certain `params`. Basically pre-render those pages as HTML as well.

In here `generateStaticParams()` what we will need to return is an array, and then each one of this is an object. In there we could have `params`. In there we have the `slug`. We may create the HTML during the build

```tsx
export async function generateStaticParams() {
 // top 100 most popular events
return [
  {
    slug: 'comedy-extravaganza',
  }, {
    slug: 'dj-practice-session',
  },
];
```

What this will do is during the build task, it will make these statically rendered. So the HTML of those pages will already be waiting. It does not have to directly render this `EventPage` component for every request. It can re-use the same HTML result.

```tsx
import H1 from "@/components/h1";
import { getEvent, sleep } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { capitalize } from "@/lib/utils";
import { Metadata } from "next";

type EventPageAndMetadataProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: EventPageAndMetadataProps): Promise<Metadata> {
  const slug = params.slug;

  const event = await getEvent(slug);

  return {
    title: event.name,
  };
}

// <- just inserted now V252
export async function generateStaticParams() {
  // top 100 most popular events
  return [
    {
      slug: "comedy-extravaganza",
    },
    {
      slug: "dj-practice-session",
    },
  ];
}
// <- just inserted now V252

export default async function EventPage({ params }: EventPageAndMetadataProps) {
  const slug = params.slug;

  const event = await getEvent(slug);

  console.log(event);

  return (
    <main>
      <section className="relative overflow-hidden flex justify-center items-center py-14 md:py-20">
        <Image
          src={event.imageUrl}
          className="object-cover blur-3xl z-0"
          alt="Event background image"
          fill
          quality={50}
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />

        <div className="z-1 relative flex flex-col lg:flex-row gap-6 lg:gap-16">
          <Image
            src={event.imageUrl}
            alt={event.name}
            width={300}
            height={201}
            className="rounded-xl border-2 border-white/50 object-cover"
          />

          <div className="flex flex-col">
            <p className="text-white/75">
              {new Date(event.date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <H1 className="mb-2 mt-1 whitespace-nowrap lg:text-5xl">
              {event.name}
            </H1>
            <p className="whitespace-nowrap text-xl text-white/75">
              Organized by <span className="italic">{event.organizerName}</span>
            </p>
            <button className="bg-white/20 text-lg capitalize mt-5 lg:mt-auto w-[95vw] sm:w-full py-2 rounded-md border-white/10 border-2 bg-blur state-effects">
              Get tickets
            </button>
          </div>
        </div>
      </section>

      <div className="text-center px-5 py-16 min-h-[75vh]">
        <Section>
          <SectionHeading>About this event</SectionHeading>
          <SectionContent>{event.description}</SectionContent>
        </Section>

        <Section>
          <SectionHeading>Location</SectionHeading>
          <SectionContent>{event.location}</SectionContent>
        </Section>
      </div>
    </main>
  );
}

function Section({ children }: { children: React.ReactNode }) {
  return <section className="mb-12">{children}</section>;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl mb-8">{children}</h2>;
}

function SectionContent({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-lg leading-8 text-white/75 max-w-4xl mx-auto">
      {children}
    </p>
  );
}
```

Now if we re-run the build we get some information again `$ npm run build`

How when we request certain events, we will be served events using static HTML. In production when we go to this route it should be very fast. The HTML has already been created for us. How can we check that actually? We can run this build. There is another script, the `start` script `$ npm run start`.

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
   Generating static pages (0/9)  [    ]{
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
/privacy-policy
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
/_not-found
/event/comedy-extravaganza
   Generating static pages (2/9)  [=   ]
/event/dj-practice-session
/
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

```bash
user@MacBook-Air-user evento % npm run start

> evento@0.1.0 start
> next start

   ▲ Next.js 14.0.1
   - Local:        http://localhost:3000
```

Now the `dj-practice-session` as well as other is super fast.
