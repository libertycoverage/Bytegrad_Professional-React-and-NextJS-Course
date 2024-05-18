import { EventoEvent } from "@/lib/types";
import React from "react";
import EventCard from "./event-card";

type EventsListProps = {
  events: EventoEvent[];
};

export default function EventsList({ events }: EventsListProps) {
  return (
    <section>
      {events.map((event) => (
        // <section key={event.id}>{event.name}</section>
        <EventCard key={event.id} event={event} />
      ))}
    </section>
  );
}

// V215
// 3) import @ naming -> We are using `@`, for import paths e.g. `import { EventoEvent } from "@/lib/types";`
// We would have to look up the folder structure and do `import { EventoEvent } from "../../lib/types";`
// Now we have `@` and `"at"` will always start at the `./src/` of directory and then it will search deeper in the folder structure, imagine that it is equal to `./src/lib/types`
// When we start new Next.js project it asks for the convention of imports (if we want to change the default `@` to the second option), it is configured in `tsconfig.json` -> "paths": { "@/*": ["./src/*"] }
// 4) Especially with Next.js we want to split things up into a separate components quickly, because let's say we have a click event on `EventCard`,
// now only `EventCard` needs to become a client component, if we would do it in `EventsList` now this entire thing `EventsList` needs to become a client component and maybe other things would be affected by that
// 6) We can use a key on our own custom component, we need to pass the entire `event` to the card, in `EventCard` we accept `event` as a prop
// 7) We fetch the data on the page.tsx, we pass that to `<EventsList />` component, this list component receives these events, it just map over them, and pass the individual events to `<EventCard />` component,
// this component will receive the actual event object and create the card
