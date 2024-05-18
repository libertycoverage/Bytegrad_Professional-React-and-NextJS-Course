import { EventoEvent } from "@/lib/types";
import React from "react";

type EventCardProps = {
  event: EventoEvent;
};

export default function EventCard({ event }: EventCardProps) {
  return <section>{event.name}</section>;
}

// V215
// 5) For each event we still map over events, but we want to use `<section>{event.name}</section>` for the event card, we do not want to copy the key here
