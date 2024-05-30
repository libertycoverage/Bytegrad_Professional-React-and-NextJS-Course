import H1 from "@/components/h1";
import Image from "next/image";
import React from "react";

type EventPageProps = {
  params: {
    slug: string;
  };
};

export default async function EventPage({ params }: EventPageProps) {
  const slug = params.slug;
  const response = await fetch(
    `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`
  );
  const event = await response.json();
  console.log(event);

  // V224 - Event Page Scaffolding
  // When styling `/event/[slug]/page.tsx`, we have two parts essentially, introductory area with background image, below we have information, description of the event and location.
  // First area on the top is marked by `<section>` tags (in here everything will be related), and `<div>` tags for the other part
  return (
    <main>
      {/* <section className="relative h-[361px] overflow-hidden flex justify-center items-center py-14 md:py-20"> */}
      <section className="relative overflow-hidden flex justify-center items-center py-14 md:py-20">
        <Image
          src={event.imageUrl}
          className="object-cover blur-3xl z-0"
          alt="Event background image"
          fill
          quality={50}
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />

        <div className="z-1 relative flex flex-col lg:flex-row gap-6 lg:gap-16">
          <Image
            src={event.imageUrl}
            alt={event.name}
            width={300}
            height={201}
            className="rounded-xl border-2 border-white/50 object-cover"
          />
          {/* // V226 */}
          <div className="flex flex-col">
            {/* display date in day name comma name of the month and then day number of month */}
            {/* e.g. Friday, July 12 */}
            <p className="text-white/75">
              {
                //here after opening curly braces appears Github Copilot hint
                new Date(event.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })
              }
            </p>
            <H1 className="mb-2 mt-1 whitespace-nowrap lg:text-5xl">
              {event.name}
            </H1>
            <p className="whitespace-nowrap text-xl text-white/75">
              Organized by <span className="italic">{event.organizerName}</span>
            </p>

            <button className="bg-white/20 text-lg capitalize mt-5 lg:mt-auto w-[95vw] sm:w-full py-2 rounded-md border-white/10 border-2 bg-blur hover:scale-105 active:scale-[1.02] transition focus:scale-105">
              Get tickets
            </button>
          </div>
        </div>
      </section>

      <div></div>
    </main>
  );
}

// V225 - Image Component Advanced (+ Design Tips) - Description: Let's take a look at some more advanced options for the Image component and some design tips for images.
// 1) We specify properties for Next.js Image component, we need to specify alt, width and height ourselves, this will be a little bit tricky because this image is meant to not to have standard width and height.
// When we will change the size of the Viewport, the image will be small too, (Viewport - visible area of the website), like with having a smaller screen (responsive website).
// 2) Instead of height and width like we would simply do in `Image` component, we can say fill up the entire container that is sitting in it `fill`, basically the parent element (HTML),
// the parent element for `Image` is `<section>` here.
// 3) When we use `fill`, we also should also specify `sizes=""` property, this is for the source set attributes,
// this `Image` component will render `<img srcset />`, `srcset` this it for responsiveness, so we are not loading a huge image on mobile let's say,
// also some other optimizations like loading a bigger image on Retina screens, because they can handle more pixels;
// 4) we have `sizes=""` where we can give some information, so Next.js can automatically create good `source set` for us, what we need to specify here, is how big image is gonna be on different Viewports
// 5) The width of the image we want to have on  `/event/[slug]/page.tsx` `localhost:8080/event/dj-practice-session` 1280 pixels, but if the viewport is smaller that is gonna be the entire width of the viewport.
// It is like a media query CSS technique. It is going to be 1280 pixels except, when the viewport width is actually 1280px or below `(max-width: 1280px)`,
// it is going to be whatever the width is of the viewport `100vw`.
// It is going to be 1280px when the viewport is very wide, but as soon as viewport is actually 1280 or smaller the image will be 100% of the viewport width `(max-width: 1280px) 100vw`.
// 6) If we use `fill` Next.js will automatically make this position absolute, let's make `section className="relative"`, now the image disappears, now let's give height of 361px `h-[361px]`,
// 7) now the image appears again but does not look great, so we are going to add styles to `Images` component, we can add anywhere we want, in the beginning or somewhere else.
// Here we can use `object-cover` that will make it so that the aspect ratio is preserved, it will do that by cutting off the image actually, which in this case is fine,
// because we are using image for stylistic reasons and the image will be gaussian-blurred for the effect.
// We give a className `blur-3xl`. Now blur is overflowing the area of the image everywhere, so we want to add to `<section>` surrounding `Image` component a className of `overflow-hidden`
// ### the design tip of using the image as blurred background
// The design tip, when we need some kind of background and we do not know what to do, instead of having a plain color background, we can take foreground image and use that as a background image,
// just use it very blurred. It almost always looks good.
// ### other settings of `<Image>` component
// 8) One other thing is we can set `quality` prop, by default it is `={75}`, but for the de facto blurred image we can set it really small, we can set `={50}`, we do not really care about the quality in this case,
// it can optimize for the size of the image, because we are going to blur that anyway, it does not really makes sense to make this `100` percent quality.
// With the base for the blurred image we can go pretty low in quality to save on size.
// 9) Another thing we can specify in `Image` component is `priority`.
// Since it is the biggest image on the page `/event/[slug]/page.tsx` we can make this priority, that the browser will prioritize loading this image instead of other assets, let being said,
// that is mostly useful if that big image is also shifting other elements around, however in this case is position absolute, so other elements will not be affected by this size of this image,
//  `priority` here is not as important.
// 10) We can make an argument that instead we should `priority` on the small image of the event details in `/event/[slug]/page.tsx`, not here.
// 11) We have information (details of the event) displayed on top of the image. Inside the `<section>` surrounding the image we create `<div>`, to hold that information.
// There we will have an actual image connected to the event, and details of the event on the right side.
// 12) Actually `priority` will not matter here (`<Image>` in `<div>`), because `event.imageUrl` in this project is the same image used in both places,
// it should not matter which one we put priority on, because the browser will only load that once.
// 13) We need to specify width and height `width={300} height={201}`. These numbers come from previous prototyping/styling in Next.js, previous iteration of a project before this showcase/tutorial.
// For detailed numbers "inspect element" in the browser is used.
// 14) We can see that the foreground image we want is displayed under the background image (background image is on the top), which is not what we want.
// We want to reduce the z-index in z-axis, we set the background image z to zero `z-0`, then for the `<div>` surrounding  `Image` we want to be higher we set z a little bit higher`z-1`,
// that alone won't work, because z-index only work on positioned element, meaning we have to set position property to something else than the default one `<div className="z-1 relative">`

// V222 - Event Page Params (Get Event Slug From URL)
// We should go to individual pages e.g. `http://localhost:3000/event/dj-practice-session`
// We edit `/event/[slug]/page.tsx` This page needs to work for all events.
// It is a slug `dj-practice-session`, here it is an identifier for a specific event.
// Function EventPage (React component) takes `params`, we type that `EventPageProps`. Then we can fetch information related to that event.

// V223 - Fetch Event From URL
// Let's extract slug first `const slug = params.slug;`, we have `/event/[slug]/page.tsx`, `[slug]` refers to  `params.slug`, whatever we name in square brackets, we can refer into in the code
// `/event/[something]/page.tsx` refers to `const something = params.something;`
// console log from Node.js terminal (`/evento/$ npm run dev`)-> individual event
// We are fetching data again (going to `https://bytegrad.com/course-assets/projects/evento/api/events/${slug}`)
// We can ask why are we fetching this again?
// We already had the data (Before we fetched it in EventsPage component `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`) in `/events/[city]/page.tsx` as All Events or a particular city.
// That is because people can go directly to the URL, and people will share URL `http://localhost:3000/event/dj-practice-session` without the need to go
// to the list of events `http://localhost:3000/events/all` or `http://localhost:3000/events/austin`. This needs to work even if you do not have data from the previous page.

// V226
// We have an `Image` on one side and we have other information on the other side, we have another `div`, we have the name of the event, we can use `<H1></H1>` component,
// we also set a paragraph `p`, we want the content of the paragraph in italic, we use the method with wrapping in a `<span className="italic"> </span>`
//
// We have red underline on `H1` used here `/event/[slug]/page.tsx`, `H1` needs a `className` passed as a prop, the solution to that is to make it optional,
// we need to add a question mark in h1.tsx in `type H1Props = {children: React.ReactNode; className?: string; };`, we do not want that prop to be mandatory when we use H1 component
// -> error intellisense on `H1` -> Property „className” is missing in type „{ children: any[]; }”, but required in type „H1Props”.ts(2741) (...)
// Type for H1.tsx component with obligatory `className` prop  -> `type H1Props = {children: React.ReactNode; className: string; };`
//
// Above the `event.name` we want the name of the week, comma, month and the day of the month.
// It is a little bit tricky, we have a string `event.date` and we need to retrieve information from that string.
// We can use Github Copilot writing in place`{/* display date in day name comma name of the month and then day number of month */}`,
// we can also give example to Github Copilot `{/* e.g. Friday, July 12 */}` then we write like we want an object below using curly braces `{ }`, we receive a hint we want.
//
// We are gonna style the button we have created `<button>Get tickets</button>`.
// The `Image` component should be side by side with the information about the event (`event.date` as well as `event.name` and `event.organizerName`),
// we use Flexbox to do that, add a className `flex` to the `<div>` surrounding both `Image` component and information.
// That side by side layout should be in the center as well, so we also may use Flexbox, adding `flex` to the parent element of that `<div>` which is this `<section className="relative h-[361px] overflow-hidden">`,
// then we also want to center content, we add `justify-center` and `items-center` -> `<section className="relative h-[361px] overflow-hidden flex justify-center items-center">`.
// We also want to have some space between `<Image>` and the `<div>` for information, so we add to the `<div className="z-1 relative flex">` surrounding these, className `gap-x-6`,
// but on larger viewport it should be a little bit more `lg:gap-x-16` -> `<div className="z-1 relative flex gap-x-6 lg:gap-x-16">`.
//
// Using Flexbox by default it is a `flex-row`, the layout is in the same horizontal line, but if it on some small mobile (viewport) it is better to have one column layout,
// so by default it should be `flex-col`, because Tailwind CSS is mobile first, and then on a larger (wider) viewports it should be that row layout (on large an up) `lg:flex-row`.
// We add that to the div surrounding `Image` and information -> `<div className="z-1 relative flex flex-col lg:flex-row gap-x-6 lg:gap-x-16">`
//
// On a smaller viewport column layout of `Image` and information is sitting close against the edges on the top and the bottom of the `section` (background image),
// to the `section` we add padding vertically with className `py-14`, and on medium and up it should be even more `md:py-20`, for some reason it did not change anything.
// Typically you want to have padding anyway. -> fragment of `/event/[slug]/page.tsx` (this file) -> <section className="relative h-[361px] overflow-hidden flex justify-center items-center py-14 md:py-20">
//
// Let's style spacing a little bit better, we start with Date, surrounding that in a paragraph `<p>`,
// there is no need to use text medium size `text-md` because the default is text (font) base size `text-base`, text white with 75% opacity `text-white/75`
// -> fragment of `/event/[slug]/page.tsx` (this file) -> `<p className="text-white/75"> { new Date(event.date).toLocaleDateString("en-US", {`
//
// We modify `<H1>{event.name}</H1>` we can use className here, because that is how we structured this React component, we add margin bottom 2 `mb-2`, margin top 1 `mt-1`, then add some space,
// we do not want any wrapping `whitespace-nowrap`, we want to increase size of the text on bigger viewports `lg:text-5xl` (we want to overwrite default style for that),
// on bigger viewports text appears to be a little bit smaller (which is what we want).
// -> fragment of `/event/[slug]/page.tsx` (this file) -> <H1 className="mb-2 mt-1 whitespace-nowrap lg:text-5xl">{event.name}</H1>
//
// Now we go to organizer name, we edit paragraph `p`, we do not want any wrapping, sometimes wrapping may occur when the size of the viewport is very small, it breaks up text in multiple lines,
// we add `whitespace-nowrap`, we set `text-xl`, also de-emphasize text with opacity 75% `text-white/75`
// -> fragment of `/event/[slug]/page.tsx` (this file) -> <p className="whitespace-nowrap text-xl text-white/75">
//
// Now we modify the button, background color white of 20% opacity `bg-white/20`, text large `text-lg`, we want to capitalize text `capitalize`, add margin to the top for spacing `mt-5`,
// default width on small viewport is 95% of width of the viewport `w-[95vw]` (on small viewport button is large and wide),
// but on wide viewport (bigger visible area of the website) button should have initial width (undoing widening of the button) -
// - on small viewport and upwards (bigger viewports) `sm:w-[initial]`(for some reason that does not work so instead we should do `sm:w-full` that takes up space in width) ;
// we add some padding vertically `py-2`, we also add border radius rounded medium `rounded-md`, we set border of a button, white 10% opacity `border-white/10`, the border size should be 2 `border-2`
// -> fragment of `/event/[slug]/page.tsx` (this file) ->  <button className="bg-white/20 text-lg capitalize mt-5 w-[95vw] sm:w-full rounded-md border-white/10 border-2">Get tickets</button>
// What is a cool effect sometimes if we have see-thru background color of a button, we can also blur the background (especially helpful if there is some clear vivid background image)
// (in this project it may not make a difference) `bg-blur`
// -> fragment of `/event/[slug]/page.tsx` (this file) ->  <button className="bg-white/20 text-lg capitalize mt-5 w-[95vw] sm:w-full rounded-md border-white/10 border-2 bg-blur">Get tickets</button>
//
// Now it would be nice if the end (bottom) of the button was aligned with the bottom of the image on the right. That is a layout problem and even that is something we can solve with flexbox,
// because it is essentially the same as sticky footer we have seen before.
// We need to identify the parent element of the button which is `<div>`, we add className `flex`(that will do everything in one horizontal line),
// we want the vertical flow to be back, layout to be column `flex-col`.
// After making `flex`, in `<button>` we can change `mt-5` and instead we give margin top auto `mt-auto` which will push the button down as much as possible (aligning Image on the left and button on the right)
// -> fragment of `/event/[slug]/page.tsx` (this file) ->
// ```tsx
//           <div className="flex flex-col">
//             <p className="text-white/75">
//             (...)
//             <button className="bg-white/20 text-lg capitalize mt-5 w-[95vw] sm:w-full py-2 rounded-md border-white/10 border-2 bg-blur">
//               Get tickets
//             </button>
// ```
// Flexbox by default will stretch the elements, we need width full `sm:w-full`, that will make the same with as the overall `div` here `<div className="flex flex-col">`
//
// Now we do styling on the `Image` as well, we add className `rounded-xl`, border of 2 `border-2`, with 50% opacity `border-white/50`,
// since we are playing with height and width of an image we can add `object-cover` (when we play with image it is good practice to add that className) in case aspect ratio changes.
// -> fragment of `/event/[slug]/page.tsx` (this file) ->
// ```tsx
//         <div className="z-1 relative flex flex-col lg:flex-row gap-x-6 lg:gap-x-16">
//           <Image
//             src={event.imageUrl}
//             alt={event.name}
//             width={300}
//             height={201}
//             className="rounded-xl border-2 border-white/50 object-cover"
//           />
// ```
//
// Initially there is a space between `Image` on the left and `<div>` holding an information on the right, but when the viewport is mobile (very small),
// the layout becomes vertical and there is no gap between `div` (holding information) and `Image` component.
// In a parent `div` surrounding `Image` and  the `div` (holding information) there is a gap only for horizontal, (`gap-x-`) not for vertical,
// `<div className="z-1 relative flex flex-col lg:flex-row gap-x-6 lg:gap-x-16">`. Sometimes it helpful to just do `gap-6` for both horizontal and vertical so then it is automatically responsive,
// but if we would do that, that will also add vertical gap.
// We change `gap-x-6 lg:gap-x-16` to `gap-6 lg:gap-16` to add vertical spacing between event Image on the top and date (information) on smaller viewports.
// Because of that `py-14 md:py-20` in `<section>` we have a vertical padding difference between mid and small viewports (some kind of the 3rd state).
//
// For some reason we do not have padding on the top of `Image` on a very small viewport which we want, it is because of this height `h-[361px]` in the section surrounding background Image,
// event Image on the left and information with date on the right, if we remove `h-[361px]` it can grow bigger than that on smaller viewports.
// `{/* <section className="relative h-[361px] overflow-hidden flex justify-center items-center py-14 md:py-20"> */}`
//
// On small viewports we have a problem with lack of vertical spacing between a button itself and information with date above the button, we add `className` margin top 5 `mt-5` to the `<button>` .
// We get a warning that `mt-5 mt-auto` are in conflict, we correct that doing that for large viewports and up `lg:mt-auto`
//
// When we click on the button in `/event/[slug]/page.tsx` we want to have hover effect, when we hover over button it is bigger, when we click it is bigger than default but smaller than when it is in hover state.
// In `/event/[slug]/page.tsx` we alter `<button>` adding `className`s `hover:scale-105` (105%), when we click (or click and hold) on that it is `active:scale-[1.02]`,
// (it does not have to be 102 but 1.02), to enforce that it will be smooth we add `transition`.
// With `<button> </button>` we also want to have focused state (usually when we point with the mouse or keyboard if that is available), only one element on the page at any time can be focused.
// Here when we click a button it should be focused element and we can have special styling to indicate that, very ofter it just should be the same as the hover state `focus:scale-105`.
// Now when we click a button it stays at the focused state (after click it remains a little bit bigger that default).
