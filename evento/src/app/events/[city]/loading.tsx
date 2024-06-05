import SkeletonCard from "@/components/skeleton-card";
import React from "react";

export default function Loading() {
  // return <div>Loading events...</div>;
  return (
    <div className="flex flex-wrap justify-center max-w-[1100px] mx-auto px-[20px] py-24 gap-20">
      {/* <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard /> */}
      {Array.from({ length: 6 }).map((item, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// V233 - Skeleton Card Component (Description: Create a skeleton card component for the events page while loading.)
// Now it looks much better, now when we go to the individual event page, we can see loading indicator (Loading component holding a Skeleton components)
// while it is making a network request to this server component (client, browser is making a network request to server component), it will render on the server which will take some time,
// finally it will send back a response (result of a render). In the meantime while we are waiting we that loading skeleton.
//
// Now we are going to do the same for "All Events" page `localhost:3000/events/all` `/events/[city]/page.tsx`, it would be nice if we can show a loading indicator
//
// We have `/events/[city]/loading.tsx`, here we also want skeletons. Here it would be nice if we could mimic a skeleton card.
// Sometimes with skeleton we are trying to mimic the UI that we are loading essentially. instead of bars we would like to have a skeleton cards,
// something that resembles a card and we will have multiple of them.
//
// Lets's create `/components/skeleton-card.tsx`, here in loading.tsx we want to use Skeleton component we have already created, instantiated 3 times.
// On the Skeleton component (in skeleton-card.tsx) we want to use `className`s: height 12 `h-12`, width 12 `w-12` , `rounded-full` - this will mimic the Image of the card
// The second Skeleton component should have: height 4 `h-4`, width of 250px `w-[250px]`.
// The third Skeleton component should have: height 4 `h-4`, width of 200px `w-[200px]`.
// Let's add some space between them, here we do not need flexbox, we only need space, we may want to use `space` utility here, vertical space 4 `space-y-4`.
// We can make it more sophisticated but it will do for now.
//
// We may want to center that (center layout of the skeleton cards).
//
// Now we edit `/events/[city]/loading.tsx`. SkeletonCards they need to have the same layout as the actual site `/events/[city]/page.tsx`, mimicking the layout.
// We have to use flexbox in  `/events/[city]/loading.tsx`, it is going to be very similar to the normal page, `flex`, they should be able to wrap `flex-wrap`,
// gave them maximum width of 1100px `max-w-[1100px]`, we want to center all of them `mx-auto` (margin horizontally auto),
// we add margin (padding) to both left and right (horizontally) of 20px `px-[20px]`, we add margin (padding) vertical `py-24`,
// and we also add gap between them (flex items) (20 which calculates to 5rem which is 80px) `gap-20`, very similar to EventsList component
//
// We have only 3 cards, but we want to have 6 or even 9, we could duplicate ` <SkeletonCard />` 9 times, maybe a cleaner way is to do a bit of a trick,
// after opening curly braces we have an interesting suggestion from copilot
// ->
// {
//   Array.from(Array(10).keys()).map((_, i) => (
//     <SkeletonCard key={i} />
//   ))
// }
// ->
//
// ### Advanced implementation for mapping over SkeletonCards array
// but we will use author's trick here, here it is a bit advanced JS trick, if we have an array in JS it is just an object, and one of the thing you can do on array,
// on array we can take the length of array `array.length` and it will tell us how many things are in the array, that is possible because array is just an object,
// on object we have properties. Everything in JavaScript is an object, objects that allows to do methods and properties on objects.
//
// If we do this object with property length, we can actually do `Array.from`, we can create array out of that and because array has a length property,
// this will work  `{ Array.from({length: 6}) }`, what we will get is basically an array with 6 empty elements, and we want to create a SkeletonCard for each one (each of elements).
// We are mapping over empty item essentially (nothing in the array). We will have 6 of SkeletonCard components.
// We need to specify key, here when we `map`, we get an `item` in the array and the second argument will be an index actually.
// In SkeletonCard component we will use index as a key, it is not typically what you want to do, but here it does not really matter,
// because we are not gonna reshuffle or sort this set of SkeletonCards.
// Now we can see we have 6 SkeletonCards , there are not centered perfectly, we are using flexbox so we can use `justify-center` in the `div` surrounding mapping over array
// ->
// {
//   Array.from({length: 6}).map((item, i) => (
//     <SkeletonCard key={i}/>
//   ))
// }
// ->
// Using skeletons improves UX of the website.
// At least we can see some loading indicator while we are waiting for network request to the server, server component rendering and giving the result on the front-end.
//
// Sometimes we do not see loading indicator because once we have received that result on the front-end, Next.js will put that in the cache, basically store the result.
// Next time we go to the route we already have that result, it does not need to make a network request again, it will reuse that.
// It is a little bit unpredictable sometimes when it is using cache (here Router Cache).
