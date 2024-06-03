import Skeleton from "@/components/skeleton";
import React from "react";

export default function Loading() {
  // return <div>Loading city...</div>;
  return (
    <div className="animate-pulse flex flex-col items-center gap-y-4 pt-28">
      <Skeleton className="h-4 w-[550px]" />
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[430px]" />
    </div>
  );
}

// V232
// We can make it a little bit fancier, instead of displaying "Loading...." we can actually show some skeletons, which is a professional way of showing indicator,
// let's start for the individual event page `/event/[slug]/page.tsx`, for this page we want skeleton, create file `/components/skeleton.tsx`
// It will be an empty `div`, self-closing tag in JSX/TSX, (that is not possible in HTML),
// then we can easily do this with Tailwind CSS, height would be 4 `h-4`, width 550px `w-[550px]`, rounded border radius `rounded-md`, background white colour with 5% opacity `bg-white/5`
//
// Now we want to include skeleton in `loading.tsx` file
//
// First `/event/[slug]/loading.tsx`, loading for the individual city, in here let's add 3 `Skeleton`s,
// let's add space between them, we also want to center them, add Flexbox, we are adding a className `flex` to the `div` surrounding `Skeleton`s.
// In that `div` we want to keep the column layout, add flexbox column `flex-col`, to center we use `items-center`, we also add vertical gap `gap-y-4`, we add padding on the top `pt-28`.
// With Tailwind CSS we can also animate that easily, to the `div` we can add className `animate-pulse`.
//
// It could look better if we change its width, instead of having all the same width, we could change the width of the other ones.
// We want to create className as a prop varying height and width of a skeleton, (and also maybe in other places we would like it to have a different height).
//
// In `skeleton.tsx` className should not be mandatory, we need to make it optional `className?: string;`
// Now we need to pass input here `<div className=""`. We have seen that before, we used Tailwind-Merge for such a thing. Here we only need Tailwind-Merge.
// We have already created such utility function called `cn()` that uses both Tailwind-Merge as well as clsx (that is for conditional classes). We can use `cn()` everywhere even if we do not need clsx features.
// Here In `skeleton.tsx` we use `cn()`, we need to wrap that in curly braces or square brackets, the initial argument will be base classes, the second argument is whatever we pass in through as prop `className`
// With Tailwind-Merge we are going to merge that intelligently, if there is a clash, whatever we write as a `className` (here input, props for Skeleton component) will overwrite default styles - CSS `className`s
// Now we have skeleton that have different width.
