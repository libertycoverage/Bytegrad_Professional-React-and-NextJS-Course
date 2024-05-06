import Link from "next/link";
import React from "react";
import Logo from "./logo";

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
  return (
    <header className="flex items-center justify-between border-b border-white/10 h-14 px-3 sm:px-9">
      <Logo />
      <nav>
        <ul className="flex gap-x-6 text-sm">
          {routes.map((route) => (
            <li
              key={route.path}
              className="text-white/50 hover:text-white transition"
            >
              {/* We can use `{route.name}` as key, but better is to use `{route.path}`, path is more likely to be unique */}
              <Link href={route.path}>
                {/* We do not need anchor tag, `<Link>` component will actually render an anchor tag for us */}
                {/* <a className="text==white/70 hover:text=white/100"> */}
                {route.name}
                {/* </a> */}
              </Link>
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
