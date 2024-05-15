import H1 from "@/components/h1";
import React from "react";

export default function EventsPage() {
  return (
    <main className="flex flex-col items-center py-24 px-[20px] min-h-[110vh]">
      <H1>Events in Austin</H1>
    </main>
  );
}

// V211
// 1) We want to have centered `H1` in EventsPage, let's do that with flexbox className `flex`;
// 2) right now we have only `H1` but we are going to have list of events also, if we use only `flex` they are going to sit next to each other horizontally,
// but we want them to be next to each other vertically (keep vertical flow), we use `flex-col`;
// 3) now we can center them horizontally with `items-center`;
// 4) Remember with flexbox we have `align-items`(y) and `justify-content`(x) and they switch (x switches with y) when you use "column flex" `flex-col`
// https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Aligning_Items_in_a_Flex_Container
// 5) add padding both top and bottom `py-24`
// 6) also add padding horizontally when the viewport gets smaller `px-[20px]`and the content won't sit against the edge
// 7) add a scrollbar here, minimum height of the field will be 110% of the viewport `min-h-[110vh]`, there appears a scrollbar
// 8) scrollbar does not look great, let's style the scrollbar, this is a good example of something we cannot easily do in Tailwind right now
// 9) let's style the scrollbar, we can actually do that in CSS, in CSS `global.css` file we get from Next.js, this is where we should put a style for that
// (this is something we got from resources in repository to evento project;
// width; scrollbar-track it is the entire thing of scrollbar, a background; scrollbar-thumb it is the bar we click and hold when moving the scrollbar up and down;
// scrollbar-thumb:hover when we hover over thumb), for Firefox it needs to be slightly different
// --
// 10) Something that can be disliked when using scrollbars is the shift of the page when scrollbar appears on the side (right or left),
// that happens when you click on some other page that does not have enough content in length of the site to enable sidebar on the side and then again on the site with long-enough content.
// 11) One thing to prevent this is to give every page a scrollbar. What we can do is go to the `<body>` in layout.tsx and in there add className `overflow-y-scroll`,
// when we do that scrollbar, at least the track will appear on every page (almost not noticeable).
// Now when we switch back and forth between pages, there sis no layout shift due to scroll bar.
