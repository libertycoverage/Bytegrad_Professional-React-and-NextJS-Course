import React from "react";

type EventPageProps = {
  params: {
    slug: string;
  };
};

export default async function EventPage({ params }: EventPageProps) {
  const slug = params.slug;
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
  );
  const data = await response.json();
  console.log(data);

  return <main>Event Page</main>;
}

// V222 - Event Page Params (Get Event Slug From URL)
// We should go to individual pages e.g. `http://localhost:3000/event/dj-practice-session`
// We edit `/event/[slug]/page.tsx` This page needs to work for all events.
// It is a slug `dj-practice-session`, here it is an identifier for a specific event.
// Function EventPage (React component) takes `params`, we type that `EventPageProps`. Then we can fetch information related to that event.

// V223 - Fetch Event From URL
// Let's extract slug first `const slug = params.slug;`, we have `/event/[slug]/page.tsx`, `[slug]` refers to  `params.slug`, whatever we name in square brackets, we can refer into in the code
// `/event/[something]/page.tsx` refers to `const something = params.something;`
// console log from Node.js terminal (`/evento/$ npm run dev`)-> individual event
// We are fetching data again (going to `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`)
// We can ask why are we fetching this again?
// We already had the data (Before we fetched it in EventsPage component `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`) in `/evets/[city]/page.tsx` as All Events or a particular city.
// That is because people can go directly to the URL, and people will share URL `http://localhost:3000/event/dj-practice-session` without the need to go
// to the list of events `http://localhost:3000/events/all` or `http://localhost:3000/events/austin`. This needs to work even if you do not have data from the previous page.
