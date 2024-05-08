import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center pt-36">
      <h1 className="text-3xl lg:text-6xl font-bold tracking-tight">
        Find events around you
      </h1>
      <p className="mb-12 mt-7 text-2xl lg:text-3xl opacity-75">
        Browse more than{" "}
        <span className="font-bold text-[#a4f839] italic underline">
          10,000 events
        </span>{" "}
        around you
      </p>

      {/* We want input field wrapped in the form */}
      <form className="w-full sm:w-[580px]">
        <input
          className="w-full h-16 rounded-lg bg-white/[7%] px-6 outline-none ring-[#a4f839]/50 transition focus:ring-2 focus:bg-white/10"
          placeholder="Search events in any city..."
          spellCheck={false}
        />
      </form>

      <section className="mt-4 flex gap-x-4 text-sm text-white/50">
        <p>Popular:</p>
        <div className="space-x-2">
          <Link href="/events/austin">Austin</Link>
          <Link href="/events/seattle">Seattle</Link>
        </div>
      </section>
    </main>
  );
}

// V203
// 1) Let's make sure everything is sitting in the center, that is a layout problem, and for layout problems we can use flexbox,
// (there is also a CSS grid but 95% of the time you want to use flexbox), we are styling `<main className="">`
// 2) When we use `flex` everything is sitting in the same row, which is not what we want, we want to keep vertical flow,
// we want to convert from flex row to flex column, we want to use `flex-col`, we need to use `flex flex-col` together
// 3) `items-center` - for horizontal centering
// 4) We want to add padding on the top `pt-36`
// 5) We also add horizontal padding `px-3`, so it does not stick against the edge of the viewport (visible area of the website), when the viewport becomes smaller
// 6) The footer is awkwardly sticking, we will push that further down in the second
// ---
// 7) We style `<h1 className="">` with `text-3xl font-bold`, `text-3xl` will be a font size on mobile,
// on wider viewports we want to make it bigger, when the viewport is large it will be `lg:text-6xl`
// 8) There is also something called `tracking-tight` which is basically the letter spacing, text will be a little bit closer to each other
// ---
// 9) `<p className="">Browse more than 10,000 events around you</p>` we add margin bottom `mb-12` and margin top `mt-7`,
// 10) We make text 2xl `text-2xl`, but on the large viewport it will become `lg:text-3xl`
// 11) We give text an opacity to make it more subtle `opacity-75`
// 12) Text `Browse more than <span className="">10,000 events</span> around you` wa add classes `font-bold italic underline`
// 13) Typically in the project we will have accent colors, basically to highlight something, to draw attention to it,
// typically it is going to be a part of a branding. For now we will hardcode that color but in the future we will manage that a little bit
// easier. If we look at the color of `<span className="">10,000 events</span>`, it has the color used throughout the application, `text-[#a4f839]`, this is RGB color
// ---
// 14) We will add some width on the form itself, on the small viewport we want this to take the entire width `w-full`,
//  but on a larger viewports we will make custom width of `sm:w-[580px]` (custom 580px). Tailwind CSS uses rem units,
// you may wanna do this in rem (it is a little bit better to use rem), rem is more complicated to work with,
// to calculate what pixels are in rem,  we will use pixels here. There is no convenient tool to calculate rem units and pixels yet in Q4 2023, but is should be soon
// 15) `<input>` inside the form should be the same width as the `<form>` is, we add className of `w-full`;
// 16) we also give a height of 16 `h-16`;
// 17) we want to add some border radius `rounded-lg`;
// 18) we want background to be more subtle `bg-white/[7%]` (custom 7%), custom values are in square brackets;
// 19) we want to add some padding horizontal `px-6`;
// 20) we also want to remove outline `outline-none` (there is no frame around that input field when we put cursor there, trying to type in the field);
// 21) we want the frame around to be green (static outline around, without a cursor), it is `ring`, we want ring of custom color `ring-[#a4f839]`,
// we want 50% opacity `ring-[#a4f839]/50`; we want to be smooth, we add `transition`. We do not see anything because ring has no size,
// we want to give ring a size when we click in here (this is gonna be the focused state) `focus:ring-2`;
// also we want to change background colour a little bit `focus:bg-white/10` (technically we could  do custom 7% `focus:bg-white/[7%]`)
// ---
// 22)  `<section className="">` we want some margin on top `mt-4`;
// 23) we want `<p>Popular:</p>` to be in the same line as `<Link href="/events/austin">Austin</Link> <Link href="/events/seattle">Seattle</Link>`,
// we add flexbox `flex` to the `<section>`
// 24) we want to add some horizontal space `gap-x-4` property when using flexbox
// 25) we want to decrease the size of the text because it should be deemphasized `text-sm`,
// 26) and also decrease the opacity (50%) `text-white/50`
// 27) In `<div>` that holds `<Link>`, we want a space between Links, we could technically do `<div className="flex gap-x-1">`,
// but we do need to make a flex container; if we do not have flexbox, there is some utility,
// space horizontal, we can make that space horizontal property 2 `<div className="space-x-2`.
// 28) The way that flexbox works is we have parent element - `flex` container, the direct child elements are going to be flex items,
// `flex` only works with with container and its' direct child elements, it will not works with grandchildren
// e.g. Links here `<Link href="/events/austin">Austin</Link> <Link href="/events/seattle">Seattle</Link>`
// Here if we want space between Links we need to modify `<div>` as their nearest parent element
// 29) Let's give both of these Links `font-semibold`, we do not need to do that one by one but once in the parent element in `<div>`
// ---
// 30) We want to get footer to the bottom of the page, not sticking to the bottom of the `<main>` section.
// That is a layout problem, we want to think about flexbox.
// To get a sticky footer we can make a parent element a `flex` container. What is a parent element of Footer?
// The parent element of a Footer is actually a `<body>` element in RootLayout in layout.tsx
// ---
// next part in container.tsx
