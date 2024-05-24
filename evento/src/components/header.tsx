"use client";

import Link from "next/link";
import React from "react";
import Logo from "./logo";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Typically in React we define `routes` (or `links` ) outside, each one represented as the object, and then we map over routes
const routes = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "All Events",
    path: "/events/all",
  },
];

export default function Header() {
  const activePathname = usePathname();

  console.log(activePathname);

  return (
    <header className="flex items-center justify-between border-b border-white/10 h-14 px-3 sm:px-9">
      <Logo />
      <nav className="h-full">
        <ul className="flex gap-x-6 h-full text-sm">
          {routes.map((route) => (
            <li
              key={route.path}
              // className="text-white/50 hover:text-white transition"
              //
              // V207
              // 1) Implementation of active route in the header, on the route (Home, All Events) there is an indicator on which page we are on.
              // There is an opacity gradation of the text depending on the activity status of the route (treated like a button), there is also a green indicator line.
              // We can see that both `<li>`s have 50% percent opacity. But when we are on the route, link or `<li>` should have text opacity 100%.
              // To implement this we need to know on which route we are currently on, or which pathname we have in the URL.
              // With the `route` we can check if `route.path` when we are mapping over is the same as what is currently here in URL,
              // that is gonna be the active. To know which path we are on we can use Next.js Hook `usePathname`
              // When we use `usePathname()` we run into issue caused by server and client component.
              // When we use hooks using name "use-" we need to make sure we are calling that hook in a client component, right now everything is a server component by default in Next.js.
              // We are trying to read from URL, we need to add `"use client";`, server does not see URL like that.
              // We use `const activePathname = usePathname();`, when we log `  console.log(activePathname);` we can see `/events/all` in console or `/`. It will give what is after domain name or localhost.
              // When we are mapping over those routes, we can check if that is the same as the `activePathname`, when that is true we change to 100% opacity `text-white/100`
              // There is a better way to do that in Tailwind CSS (using clsx), but we can do also something like this (This technically works but the syntax is not great)->
              // className={`${
              //   activePathname === route.path ? "text-white" : "text-white/50"
              // } hover:text-white transition`}
              //
              // 2) Now clsx implementation of the class manipulation in case of a highlight of an active Link,
              // we want to make sure that the active route is always visible ->
              // First, we install clsx package, `/evento/$ npm install clsx`, string will be the function input
              // This is what we always want `"hover:text-white transition"`; in object {} we have conditions
              // (This is an object and `text-white` is a key (string), class we want to apply, we want to get the class `text-white`, this condition is true `activePathname === route.path` )
              // className={clsx(
              //   "hover:text-white flex items-center relative transition",
              //   {
              //     "text-white": activePathname === route.path,
              //     "text-white/50": activePathname !== route.path,
              //   }
              // )} // we need curly braces {clsx()} to open a window for JS
              className={cn(
                "hover:text-white flex items-center relative transition",
                {
                  "text-white": activePathname === route.path,
                  "text-white/50": activePathname !== route.path,
                }
              )}
            >
              {/* We can use `{route.name}` as key, but better is to use `{route.path}`, path is more likely to be unique */}
              <Link href={route.path}>
                {/* We do not need anchor tag, `<Link>` component will actually render an anchor tag for us */}
                {/* <a className="text==white/70 hover:text=white/100"> */}
                {route.name}
                {/* </a> */}
              </Link>

              {/* 3) What we also have is a green (theme accent colour) highlighted underline of an active Link, that will nicely animate when we go to the route, it is easy to animate with something called Framer Motion  */}
              {/* `/evento/ $ npm install framer-motion@10.16.04` */}
              {/* To create green (accent colour) bar we will use empty div; background colour of accent `bg-accent`; height 1 `h-1`; width full `w-full`; absolutely positioned `absolute`; 
              zero pixels from the bottom `bottom-0` (bottom of `<li>`) - so add `relative` class to `<li>`. 
              It is currently sitting 0 pixels from the bottom of Links, but we want this to be sitting as the end of entire header, 
              `<ul>` needs to be the full height of the header - height full `h-full`, that does not work alone, we also need to give `<nav>` a class of `h-full`; 
              because of this `<nav>` a class of `h-full` (Home & All Events) Links are close to the top of the website, 
              to prevent that we also need to add to `<li>` classes `flex` and `items-center` - this is basic centering in flexbox */}
              {/* Now we always see these underline highlight bars, but it should only be visible for the active route. 
              We want to check if the `activePathname` is the same as `route.path` we are mapping over, then we want to show the div */}
              {/* We want to animate this bar, Framer Motion makes it easy to animate, we only need to change this into Framer Motion component,
               we rename `<div>` to `<motion.div>`, that alone is not enough. We are gonna have 2 divs here for each route, Framer Motion needs to know they are the same, 
               therefore they need to be animated, we add `layoutId`, that could be anything, if we do this Framer Motion will know when you animate and go to the new route, 
               these divs are the same, so that the difference between them needs to be animated. */}
              {activePathname === route.path && (
                <motion.div
                  layoutId="header-active-link"
                  className="bg-accent h-1 w-full absolute bottom-0"
                ></motion.div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

// / Here we have 2 `<li>`, but in the big navigation we can have dozens of links,
// / what if we want some styling for a particular `<li className-"h-full">`, now you would have to copy-paste that to other ones as well?
// / That is a little bit messy, instead we define `routes` (or `links` ) outside, each one represented as the object, and then we map over routes, as above
// /
// export default function Header() {
//   return (
//     <header className="flex items-center justify-between border-b border-white/10 h-14 px-3 sm:px-9">
//       <Logo />
//       <nav>
//         <ul className="flex gap-x-6 text-sm">
//           <li>
//             <Link href="/">Home</Link>
//           </li>
//           <li>
//             <Link href="/events/all">All Events</Link>
//           </li>
//         </ul>
//       </nav>
//     </header>
//   );
// }

// V202 Tailwind CSS
// 1) Flex container -> `flex`, it will put everything in one row, this is how flexbox works
// 2) `justify-between` ->  If we want horizontal space as much between them,
// 3) we do not want space between the two link, we need to group two links together, so it is one group for two link,
// typically we want to use `<nav>` for that, because it is the most important block of navigation on the page
// 4) Typically in `<nav> </nav>` we have `<ul> </ul>` (list of links), and then we have `<li> </li>`  for each link, this is typical how links are structured
// 5) By default when we use flexbox, it is going to stretch items vertically, instead we want links to be in the center of the row (horizontal), we add `items-center`
// 6) We also want the border on the bottom of the header `border-b` , we want it 100% white color, but then the lower opacity, in Tailwind we can use forward slash `/` `boredr-white/10` - 10 percent opacity
// 7) We want a header to be of fixed height `h-14`, when we want to know how much the 14 is, when we hover over it Tailwind CSS extension tells us through intellisense,
// it will tell the actual CSS that will apply height is 56 pixels, it is actually in `rem` units (3.5rem), which is for accessibility essentially, the user can set the font size in the browser settings,
// with `rem` units we can actually scale up or down depending on what user have set, using rem is technically a little bit better for accessibility,
// if somebody have increased the default font setting it will be more than 56px, it will scale accordingly
// 8) logo on the left and links on the right are sitting against the edges (on the left and right), we also want to add a padding on the horizontal sight, we add `px-9`,
// 9) Responsiveness: Maybe on the smaller size like mobile we want smaller padding, maybe this one `px-9` should only be on medium screen sizes and up.
// When the viewport (visible area of the web page) we want to have `md:px-9`, on screens smaller than that it should be `px-3`.
// The way Tailwind CSS works it is mobile-first, we specify the default one like this e.g. `px-3`, and then on bigger devices we can specify different one (in this case when the viewport is medium or bigger).
// When we hover over `md:px-9` we can see it translates to 768px.
// We can also have `sm:px-9` (small), from this size 640px onwards and bigger, it will have that specific padding, below 640px we are going to have `px-3`
// It is a little bit confusing, because it is mobile-first, a lot of web developers are not thinking mobile-first,
// with Tailwind CSS the assumption is that we start from mobile and then define the styling with break points for bigger devices.
// We have `px` - horizontal padding, `py` - vertical padding, `p` - padding for everything
// 10) These links sit on top of each other, we want these `<li>` to sit next to each other in the same line, we can use flexbox for that, with flexbox you always need to identify the parent element (parent element is `<ul>`)
// 11) Then if we want a space between these flex items we use `gap-x-6`, `gap-x-` is horizontal space
// 12) We want text to be smaller `text-sm`
//
// The other benefit of Tailwind CSS is that, we do not have to go to different files to style something, in the past how would you style this `<ul>`?
// You would have to come up with some creative name e.g. `links-list` and then in CSS file you would have to select
//`.links-list { display: flex; flex-direction: column; alsign-items: center; justify-content: center; margin-top: 2 rem; margin bottom: 2rem; }`
// The benefit of using Tailwind CSS is that you do not have to context switch on a styling files (.css), and you have already created classes from Tailwind CSS.
//
// `<li key={route.path} className="text-white/50 hover:text-white">`
// We want these links to be text white, a little bit more subtle `/50` 50 percent opacity, when we hover over text we want 100% white,
// in the hover state you can have typical classNames when you want to apply when the hover state is true
