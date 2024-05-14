import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/">
      <Image
        src="https://bytegrad.com/course-assets/react-nextjs/evento.png"
        alt="EVENTO logo"
        width={53}
        height={12}
      />
    </Link>
  );
}
// V210
// When we click on the logo we want to go to the home page. We can wrap Logo component in Link component.

// V201
//
// Error: Image with src "https://bytegrad.com/course-assets/react-nextjs/evento.png" is missing required "width" property.
// We need to add alt, width, length to the `<Image />`  according to documentation.
// We need to add parameters as props to the `<Image />` component. https://nextjs.org/docs/pages/api-reference/components/image
//
// ### Avoiding "content layout shift" CLS
// The reason we need to specify the width and height is so that is does not shift content around when the image is loaded;
// it is not an issue here because it s a small image, if the image takes a lot of space it is technically possible that when we load the page,
// text will be loaded first, and it takes some time before the image will load, when the image is loaded it may shift content around.
//
// This is called "content layout shift" or CLS, this is one of the web vitals that Google looks at when ranking a website,
// CLS is seen as very undesirable. With width and height we can set how big the image is gonna be on the page
// and it will reserve that space, so the text will be put in desired place already, when the image is loaded
//
// ----------------------------------------------
//
// ### External image, domain, hostname for image
// We have got an error ->
// Unhandled Runtime Error; Error: Invalid src prop https://bytegrad.com/course-assets/react-nextjs/evento.png on `next/image`,
// hostname "bytegrad.com" is not configured under images in your `next.config.js`
// See more info: https://nextjs.org/docs/messages/next-image-unconfigured-host]
//
// The problem is, with this `<Image />` component we cannot just start using external images, this is for safety.
// If we want to load an image from a different domain, we need to make it explicit to Next.js,
// we need to specify that in next.config.js file, change to next.config.js will also restart development server
//
// If the image comes from the tree of catalogs of an app we do not need to specify width or height, Next.js can do that for you automatically
// we do not need to specify in next.config.js either
