import React from "react";

export default function Loading() {
  return <div>Loading...</div>;
}

// V231 - Cache And Loading.tsx - Despite the cache, the loading component is still needed
// We have client-side cache (Router Cache), despite that cache initially when we go to "All Events" Link, we have to wait, initially it is still slow.
// When we click on each event card in `/events/[city]/page.tsx` we also have to wait.
// While we click we do not see any loading indicator, that is not good UX user experience, when we click again, now it is instant because it can reuse that form the cache.
// Sometime it does not work, sometimes it is a little bit unpredictable how this works, especially in development, but sometimes it would be very fast, when it has to re-render it can be slow again.
//
// Sometimes we have to wait and it would be nice if there is a loading indicator, so the user know there is a loading behind the scenes.
//
// In /app/ directory we have special files like `page.tsx`, `not-found.tsx`, `layout.tsx`, there is another special file `loading.tsx`
// We can create file `/app/loading.tsx` (we put that at the root of directory), and when we export some components out of this file, that will be used during the loading period e.g. we return `Loading...`,
// now when we click around the whole page is swapped (replaced) for a while for this `Loading...` text. That is because we put that file in the root of directory,
// but it will work also for the routes that are down in catalogs in root directory (/app/).
// If we want loading to be used specifically for the page which is on some route e.g. `/event/[slug]/page.tsx` or `/events/[city]/page.tsx`,
// we move `loading.tsx` file to the specific route catalog e.g. `/event/loading.tsx` or  `/events/[city]/loading.tsx` (text -> "Loading...") or `/events/[city]/loading.tsx` (text -> "Loading events..."),
// `/event/[slug]/page.tsx` (text -> "Loading city...")
//
// When it is reusing that cache that could be a bit annoying, because you can't opt out of it, one thing you can do is to refresh the project (by F5 (refresh in the browser)) and that should clear cache as well.
