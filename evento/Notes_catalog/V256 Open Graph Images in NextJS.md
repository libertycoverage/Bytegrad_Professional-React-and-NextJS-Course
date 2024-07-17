## V256 Open Graph Images in NextJS
Description: Learn how to generate Open Graph images in Next.js very easily.

Last thing before we try to push the project to production is something that is quite common with projects.

People want to share these events on social media. It would be nice if for example somebody shares this link (`http://localhost:3000/event/dj-practice-session`) on social media, that we can also show preview image.

On the project, page like this it would be nice if somebody shares the link, we can also have nice image. It draws the user into click on that image. This is called Open Graph image. It is easy to create in Next.js as well.

Here for event for example (`/event/[slug]/page.tsx`) there is another special file called `/event/[slug]/opengraph-image.tsx`

Now Next.js will give an example, we will modify it so it will be more suitable for our project

`/event/[slug]/opengraph-image.tsx`
```tsx
import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Evento";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  return new ImageResponse(
    (
      <section>
        <h1>{params.slug}</h1>
        <p>Evento - Browse events around you</p>
      </section>
    )
  );
}
```

What we can do in this file, we can export component (`Image`), we get the `params` of that page, we have the `slug`

For that image we have to `return new ImageResponse` from `"next/og"`, then we use `params.slug` as the `h1`. We could also fetch the complete event data here `params.slug`  and use the name of the event, but we only use `slug`

This will also run during the build, it will create these images for us.

This is one way to add easily these Open Graph images, when users share links on social media they get nice preview image.

After we deploy the project we will see that this also works as well.