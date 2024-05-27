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
      <section className="relative h-[361px] overflow-hidden">
        <Image
          src={event.imageUrl}
          className="object-cover blur-3xl z-0"
          alt="Event background image"
          fill
          quality={50}
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />

        <div className="z-1 relative">
          <Image
            src={event.imageUrl}
            alt={event.name}
            width={300}
            height={201}
          />
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
// We already had the data (Before we fetched it in EventsPage component `https://bytegrad.com/course-assets/projects/evento/api/events?city=${city}`) in `/evets/[city]/page.tsx` as All Events or a particular city.
// That is because people can go directly to the URL, and people will share URL `http://localhost:3000/event/dj-practice-session` without the need to go
// to the list of events `http://localhost:3000/events/all` or `http://localhost:3000/events/austin`. This needs to work even if you do not have data from the previous page.
