  // V255 moved from utils.ts to server-utils.ts - start - 
import "server-only"; // V255 installed package server-only

import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import prisma from "./db";
import { capitalize } from "./utils";

// export async function getEvents(city: string, page = 1) {  //V246 // V254 
export const getEvents = unstable_cache(async (city: string, page = 1) => { // V254
    //V246
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
  ); // V254
  
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
  // V243 end
  
  // V255 moved from utils.ts to server-utils.ts - end - 