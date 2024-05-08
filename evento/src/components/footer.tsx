import Link from "next/link";
import React from "react";

const routes = [
  {
    path: "/terms-conditions",
    name: "Terms & Conditions",
  },
  {
    path: "/privacy-policy",
    name: "Privacy Policy",
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-between h-16 border-t border-white/10 px-3 sm:px-9 text-xs text-white/25">
      <small className="text-xs">
        &copy; 2050 Master. All rights reserved.
      </small>

      <ul className="flex gap-x-3 sm:gap-x-8">
        {routes.map((route) => (
          <li key={route.path}>
            <Link href={route.path}>{route.name}</Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}

// V203
// 35) We want to add to a footer a copyright statement and two links
// 36) For copyright there is a `<small>` tag in HTML, to get the copyright symbol we use HTML entity `&copy;`
// 37) On the other side we gonna have a list of links, it will be done the React way, we map over the routes
// 38) We want copyright statement and links to be in the same line,
// to fix the layout problem we can modify `<footer className="mt-auto">` with `flex`;
// we want to center them vertically `items-center`;
// then we want space between them `justify-between;`
// we give height 16 `h-16`;
// we give border on the top `border-t`;
// colors with opacity 10% `border-white/10`;
// we give padding on the side, horizontal padding of 3 `px-3`, but on the bigger ones (smaller and bigger) we want `sm:px-9`;
// we set the font size to extra small `text-xs`;
// text should be more subtle with opacity 25% `text-white/25`
// 39) with the font size of a `<small>` tag, `<small>` tag by default has some styling which makes font size relative to the parent element,
// therefore here we changed it to a smaller font size `text-xs` in `<footer>`, this makes it even smaller,
// we will also set this individually for this `<small className="text-xs">` component
// 40) We also have two links (Terms & Conditions and Privacy Policy), they should not be one above the other,
// they should be next to each other, that is a layout problem, use flexbox `<ul className="flex">`;
// there should be space between links, horizontal gap of 3 `gap-x-3`,
// and on bigger screens (on small and upwards we want even more space `sm:gap-x-8`
