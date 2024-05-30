import { cn } from "@/lib/utils";
import React from "react";
import { twMerge } from "tailwind-merge";

type H1Props = {
  children: React.ReactNode;
  className?: string;
};

//export default function H1({ children }: H1Props) {
export default function H1({ children, className }: H1Props) {
  return (
    // <h1 className="text-3xl lg:text-6xl font-bold tracking-tight">
    <h1
      // className={twMerge(
      //   "text-3xl lg:text-6xl font-bold tracking-tight",
      //   className
      // )}
      className={cn("text-3xl lg:text-6xl font-bold tracking-tight", className)}
    >
      {children}
    </h1>
  );
}

// V219 - H1 Reusability (Reusability Best Practices, Tailwind-Merge) `[reusable layout CSS className as prop]`
// We have an issue with the heading, it should not sit so close to the event cards, we want to add space in `events/[city]/page.tsx`
// How to solve this? We want to add margin somewhere, maybe a margin on the bottom of the heading `H1`, so that will push down the `EventsList`.
// We can go to `H1` React component and add a className for margin on the bottom `mb-28`.
// If we would do that, that will solve the problem, but it may be incorrect way, that will affect reusable component in undesirable way,
// by adding a className to reusable component that will affect around in all unnecessary places also.
// ### solution 1
// But the problem is this `H1` is a reusable component, we are using it in many other places as well potentially.
// Actually we are using it also on the homepage (main page.tsx), this one will also get margin on the bottom which is not what we want.
// We want margin only on the site page.tsx  `/events/all/` or for a city `/events/[city]/`.
// This is not a reusable way of doing it, typically when it comes to layout or margins and paddings, or width and height, we have to be careful with adding that
// if the component is meant to be a reusable component. What we could do is to wrap `H1` in the place we use it let's say in a `<div>`, margin on the bottom `<div className="mb-28">`.
// Only this local usage of `H1` has this additional property class due to usage of additional `<div>`, other usages of `H1` reusable components are not affected by that.
// -> `events/[city]/page.tsx` with wrapping in a `<div>` with a className ->
// e.g.   <div className="mb-28">
//            <H1>
//              {city === "all" && "All Events"}
//              {city !== "all" &&
//                `Events in ${city.charAt(0).toUpperCase() + city.slice(1)}`}
//            </H1>
//        </div>
// ### solution 2
// We can also do the same for `EventsList` used in `EventsPage`, we could also wrap this in a `<div>` and give margin on the top,
// we also do not want to add additional className to (within)`EventsList` component, only to the `<div>` wrapping that component
// ### solution to a problem of overwriting a className with a className value passed to React component as a prop
// One other thing that would also be is to use a `className` on `H1` React component just like a native HTML element `<H1 className="mb-28">` but if we try doing this we get a warning
// (red squiggly underline for the word `className`), because in `H1` React component we are not accepting `className` as a prop, unfortunately this does not work as expected in Tailwind CSS.
// -> `events/[city]/page.tsx` with a className is passed as a prop to `H1` React component ->
// ```tsx
//       <H1 className="mb-28">
//         {city === "all" && "All Events"}
//         {city !== "all" &&
//           `Events in ${city.charAt(0).toUpperCase() + city.slice(1)}`}
//       </H1>
// ```
// -> h1.tsx with modification accepting a `className` as a prop, as it would be a native HTML element ->
// ```tsx
// import React from "react";
//
// type H1Props = {
//   children: React.ReactNode;
//   className: string;
// };
//
// export default function H1({ children, className }: H1Props) {
//   return (
//     <h1 className={`text-3xl lg:text-6xl font-bold tracking-tight ${className}`}>
//       {children}
//     </h1>
//   );
// }
// ```
// The problem with this is if we would have another margin bottom e.g. 10 in `<h1>`, `mb-10`, and we pass in (as className prop) margin of the bottom 28,
// the intention for us is we overwrite `mb-10` and it looks like we overwrite it because this `${className}` comes later in this className list, unfortunately the result will be unpredictable,
// just becomes later in the list of classNames, does not mean it will overwrite this previous one. If we wanna make sure, in case there is a conflict that we actually pass in,
// that the value form the prop will overwrite e.g. some of the default styles (classNames) of the `H1` React component. We need to find different solution.
// -> h1.tsx with margin bottom 10 ->
// ```tsx
// import React from "react";

// type H1Props = {
//   children: React.ReactNode;
// };

// export default function H1({ children, className }: H1Props) {
//   return (
//     <h1 className={`text-3xl mb-10 lg:text-6xl font-bold tracking-tight ${className}`>
//       {children}
//     </h1>
//   );
// }
// ```
// ### tailwind-merge
// The solution (to the problem of overwriting classNames) we are gonna use names Tailwind-Merge
// Terminal: `evento/$ npm install tailwind-merge@2.0.0`
// -> h1.tsx with modification accepting a `className` as a prop, as it would be a native HTML element ->
// ```tsx
// import React from "react";

// type H1Props = {
//   children: React.ReactNode;
//   className: string;
// };

// export default function H1({ children, className }: H1Props) {
//   return (
//     <h1 className={twMerge("text-3xl lg:text-6xl font-bold tracking-tight", className)}>
//       {children}
//     </h1>
//   );
// }
// ```
// What we do here will be very similar what we have done with `clsx` package before, but `clsx` was for conditional classNames, here is for merging together multiple classNames,
// we import `twMerge`, we import entire string of classNames there, as the second argument (after the comma) we pass in the className that we get as a prop.
// What Tailwind-Merge will do is, if we a conflict, maybe we have marin in the bottom `mb-10` or margin everywhere `m-10`, this is also a kind of a conflict,
// Tailwind-Merge will intelligently merge these classes, if there isa conflict it will make sure that this externally delivered `className` wins `${className}`.
// What we pass in will overwrite any of the default styles (`className`s), which is what we expect. We do need to accept `className` as a prop.
// It is a little difficult to type this, we could type this as a string, TypeScript out of the box does not have an easy way of typing this, right now we make it a string,
// but this is not as specific as we would like it to be, specifically it should be a "Tailwind className"...
// ```tsx
// type H1Props = {
//   children: React.ReactNode;
//   className: string;
// };
// ```
// In page.tsx we could use any sting here accepting it as a prop in React H1 component `<H1 className="blablah">` , we do not get a warning, of course we do not have such className in Tailwind.
// Ideally we could also type this as some className in Tailwind, however it is not possible right now.
// Right now when we want to customize a reusable component in some instance, we can style it like any other element (native HTML), we do not have to create some wrapper `div` or anything like that.
// Right now we have `<H1 className="mb-28">` and it does work. // AS ABOVE -> `events/[city]/page.tsx` with a className is passed as a prop to `H1` React component
