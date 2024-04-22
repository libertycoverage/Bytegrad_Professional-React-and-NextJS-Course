## V193 Before You Use `<Div>` In React

Description: Learn when and when not to use `<div>` in React. It is not the end of the world if you use many div's, but sometimes it can break your css or there is clearly a better semantic tag.

also here: https://www.youtube.com/watch?v=duoNlz5uTYk

One of the biggest mistakes that Junior React developers make is using the div element too much

let's take a look at unnecessary usage of the div elements and some alternatives that you have

### div problems

In this example I just have a subscription component and here we have this button "View current plan". If the person has an active subscription we may also want to show these two other buttons "Upgrade plan" and "Cancel plan". We are checking for hasActiveSubscription and if that's truthy we're going to render these two buttons

In jsx you do need to wrap these two buttons ("Upgrade plan" and "Cancel plan") in something, so if we leave off (omit) the div here, we can see red squiggly underline. We're going to get an error because we always need to return one React Node, not two (now we returning two buttons)

Typically the junior React developer is going to try to wrap this in a div, if we do this the error will be gone but we have two other problems, the layout has been disrupted because with flexbox as well as CSS grid there is a relationship about the parent and child component

subscription.tsx - react-semantic-html

```tsx
import React from "react";

export default function Subscription() {
	const hasActiveSubscription = true;

	return (
		<section className="flex flex-col gap-5 w-[75%] px-5 py-5 bg-white border border-black/10 rounded">

			<button className="border border-black/20 rounded-full px-5 py-3">
				View current plan
			</button>

			{hasActiveSubscription && (
				//<div>
					<button className="border border-black/20 rounded-full px-5 py-3">
						Upgrade plan
					</button>
					<button className="border border-black/20 rounded-full px-5 py-3">
						Cancel plan
					</button>
				//</div>
			)}
		</section>
	);
}
```

If you add a div in between there, you can disrupt the layout, that's the first problem with using unnecessary div

The second problem is you clutter up the HTML output, so if we inspect our project in the DOM's inspector developer tool in the browser, we're going to see this div surrounding the buttons (as expected from the code), this is just one div, but in a bigger project you're going to have a lot of unnecessary divs, a lot of unnecessary nesting

### React Fragment

We don't really need this div. Instead of what you can use in React is the React Fragment element

We can use `<React.Fragment> </React.Fragment>` instead of divs. People typically just write the
shorthand `<> </>`

We can see that the layout has been fixed and everything still works and if we now inspect the HTML output (in dev tools in the browser) here you can see we have a nice clean structure here no unnecessary nesting

#### Second example: long vs short

Should you always use the shorthand format of that React Fragment and the answer is no

Here we have another example here, let's say we have some subscription options that we put in an array and this time we're going to map over that array.

We are mapping over each element in the array and we want to create a button and then if the index is zero for the first button we want to output a little dot (at least that's intention here). For the first button ("View current plan") we're gonna have this span as well.

We are again returning two elements and we need to wrap that in something. Here we wrapped this (as a junior React developer would do) in a div. We can see the layout has been disrupted this is not the layout that we want (dot displayed just right to the first button, but we want dot to be in the column like a 4th button, second row in the column). Ideally of course we could just wrap this in a React Fragment. If we save here now we can see that this is indeed the layout that we want.

subscription-2.tsx

```tsx
import React from "react";

const subscriptionOptions = [
  "View current plan",
  "Upgrade plan",
  "Cancel plan",
];

export default function Subscription() {
  return (
    <section className="flex flex-col gap-5 w-[75%] px-5 py-5 bg-white border border-black/10 rounded">
      {subscriptionOptions.map((option, index) => (
        //<div>
        <>
          <button className="border border-black/20 rounded-full px-5 py-3">
            {option}
          </button>

          {index === 0 && <span className="text-center">.</span>}
        </>
        // </div>
      ))}
    </section>
  );
}
```

There is one problem with this and that's because we are mapping over something we need to use the key. Now if you have the shorthand format of this React Fragment `<> </>` you cannot just write the key like this `<key={index}>` (inside the shorthand version), this will not work.

If you are mapping over something you do need to use that long form of React Fragment and then with the key `<React.Fragment key={index}> </React.Fragment>` .

Now everything works and now we also have the key properly set up.

We can of course also import this separately, so instead of writing React.Fragment just use Fragment but then you have to import it separately like this `import React, {Fragment} from "react";`

subscription-2.tsx

```tsx
import React from "react";
// import React, {Fragment} from "react";

const subscriptionOptions = [
  "View current plan",
  "Upgrade plan",
  "Cancel plan",
];

export default function Subscription() {
  return (
    <section className="flex flex-col gap-5 w-[75%] px-5 py-5 bg-white border border-black/10 rounded">
      {subscriptionOptions.map((option, index) => (
        //<Fragment>
        <React.Fragment key={index}>
          <button className="border border-black/20 rounded-full px-5 py-3">
            {option}
          </button>

          {index === 0 && <span className="text-center">.</span>}
        </React.Fragment>
        //</Fragment>
      ))}
    </section>
  );
}
```

### Semantic Tags

Now the problem goes beyond React Fragments though

You also want to use semantic tags throughout your jsx

3 reasons for semantic tags:

1. easier to read / scan code (or output code)
2. better for SEO (higher chance of ranking in Google if you have a public website)
3. better for screen readers / accessibility (people with disabilities)

Let's quickly talk about the semantic tags that we have from HTML that we can use here in jsx

#### html, head, body

We have to think about it in terms of a page and a page starts with an `<html> </html>` tag, and in the HTML tag you typically have a `<head> </head>` and then a `<body> </body>`

layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head> </head>
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
```

we are using Next.js here and it depends a bit on how your framework is set up, but Next.js has the concept of pages and it does make all of this much easier

so if you create a new Next.js project you're going to get this RootLayout file this is basically the root component of your application and it's wrapping every page so on every page we will automatically have `<html> </html>` tag and body tag `<body> </body>`. Typically next to body you also have this `<head> </head>` element where you specify essentially metadata for the page.

Since we are using Next.js we shouldn't do it like this `<head> </head>` we now have this metadata that will take care of that so you just export a metadata constant where you can specify the title and description of the page

since I'm exporting this in my RootLayout file the title will be the same for all pages now unless I override it specifically in some other page and you can override it by simply exporting another constant metadata in that particular page file or layout file if you have nested layout

Usually in this head you also want to have these two meta tags for the character set as well as for the viewport. Next.js will automatically include that even if you don't define your own metadata for a route.

```
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

We can leave it out here (Metadata)

---

https://nextjs.org/docs/app/building-your-application/optimizing/metadata

##### [Default Fields](https://nextjs.org/docs/app/building-your-application/optimizing/metadata#default-fields)

There are two default `meta` tags that are always added even if a route doesn't define metadata:

- The [meta charset tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset) sets the character encoding for the website.
- The [meta viewport tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) sets the viewport width and scale for the website to adjust for different devices.

```
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

---

What about things like fav icon and open graph images that you usually would also specify in the `<head> </head>`?

That's now based on files, so if you create a favicon file here in the app directory this will be the favicon for your project and you also use a separate file for opengraph images, for robots and for the sitemap. We don't want to specify hat like this ourselves.

---

https://nextjs.org/docs/app/building-your-application/optimizing/metadata#file-based-metadata

##### [File-based metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata#file-based-metadata)

These special files are available for metadata:

- [favicon.ico, apple-icon.jpg, and icon.jpg](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)
- [opengraph-image.jpg and twitter-image.jpg](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [sitemap.xml](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

You can use these for static metadata, or you can programmatically generate these files with code.

For implementation and examples, see the [Metadata Files](https://nextjs.org/docs/app/api-reference/file-conventions/metadata) API Reference and [Dynamic Image Generation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-image-generation).

---

#### main

Basically in the RootLayout component you determine what you want to have on every page, that page will basically be substituted for children here

layout.tsx fragment

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head> </head>
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        {children}
      </body>
    </html>
  );
}
```

for example here then in this page, the home page we can have `<main> </main>` tag

so if I go to the home page here and I inspect the HTML in development tools in the browser you can see we have an `<html> </html>` tag, we have a `<head> </head>` tag from Next.js, `<body> </body>` tag and then in there now we have `<main> </main>` tag.

```tsx
export default function Home() {
  return <main className="min-h-screen"></main>;
}
```

The main tag is for the dominant content on the page so the most important content.

#### header

Typically you also have a header and footer.

You want to have the same header and footer typically on every page, so it makes sense that here in the `<body> </body>` we also add a header and footer.

This is what a typical structure on the page looks like. If we do it like this, every page will have the same header and footer because it's in the root components, it will automatically add this to each page.

layout.tsx fragment

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*<head> </head> */}
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        <header></header>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
```

#### nav, ul, li, a, Link, img

What do you typically have in a header?

You have a `<nav> </nav>`, you use the nav tag for an important block of navigation.
In there (`<nav> </nav>`) you usually we have a set of links, so it's going to be something like `<ul> </ul>` which is unordered list meaning the order doesn't matter.

If the order does matter you also have ordered lists `<ol> </ol>`, for example you have the result of some championship and list of candidates, you may want to have that an ordered list of the champion at top.

Typically the order of the links doesn't really matter and then you have a bunch of list items `<li> </li>` and then in there you have the actual anchor tag `<a href="/">Home</a> `. It's quite nested here usually.

```tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*<head> </head> */}
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        <header>
          <nav>
            <ul>
              <li>
                <a href="/">Link 1</a>
              </li>
              <li>
                <a href="/">Link 2</a>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
```

In Next.js you ask typically you want to use the link components `<Link> </Link>` that you get from Next.js. This link component under the hood will actually just give you an anchor tag.

```tsx
import Link from "next/link";
...
...
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
	  {/*<head> </head> */}
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        <header>

	     {/*<img />*/}

	     <nav>
	       <ul>
	         <li>
	           <Link href="/">Link 1</Link>
	         </li>
	         <li>
	           <Link href="/">Link 2</Link>
	         </li>
	       </ul>
	     </nav>
        </header>
        {children}
	    <footer>

        </footer>
      </body>
    </html>
  );
}
```

In the header you often also want your logo and typically that would just be an image.

Now we are writing it all here in the RootLayout component and doesn't matter where you define it.
We could create a separate component out of this, we could call those header.tsx, and we would just create a separate component for Header, would be the exact same here. Then we can just replace that with header in layout.tsx.

We're going to see the exact same in the HTML structure (browser's devtools). Same with footer we could define that as its own component in its own file footer.tsx. It doesn't change anything for the structure.

header.tsx

```tsx
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header>
      {/*<img />*/}

      <nav>
        <ul>
          <li>
            <Link href="/">Link 1</Link>
          </li>
          <li>
            <Link href="/">Link 2</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
```

layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        <Header />
        {children}
        <footer></footer>
      </body>
    </html>
  );
}
```

#### footer

What do we typically have in the footer?

Actually in the footer you also have links, usually but these are typically not an important set of Links at least not as important as you typically have in the header, so typically you don't wrap that in a `<nav> </nav>` tag but you can still have a list and again it's very nested, so you could still have that same structure like in the header. Don't use div instead of a footer tag, you can just use footer, this is a semantic tag, it conveys extra meaning, same with header, technically you can use div and it will work the same way but you lose semantic meaning

Header comes with certain semantic meaning which gives us these benefits:

3 reasons for semantic tags:

1. easier to read / scan code (or output code)
2. better for SEO (higher chance of ranking in Google if you have a public website)
3. better for screen readers / accessibility (people with disabilities)

Same with `<nav> </nav>`, we could use a div instead of nav and will work the same.

div is divider, it has basically no semantic meaning, but nav does have some semantic meaning and it gives us these benefits

layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        <Header />
        {children}
        <footer>
          <ul>
            <li>
              <Link href="/">Link 1</Link>
            </li>
            <li>
              <Link href="/">Link 2</Link>
            </li>
          </ul>
        </footer>
      </body>
    </html>
  );
}
```

let's create a separate component for footer as well so it's more symmetric looking,

```tsx
import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer>
      {/* <nav> */}
      <ul>
        <li>
          <Link href="/">Link 1</Link>
        </li>
        <li>
          <Link href="/">Link 2</Link>
        </li>
      </ul>
      {/* </nav> */}
    </footer>
  );
}
```

layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header, Footer from "";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={inter.className}>{children}</body> */}
      <body className={`${inter.className} bg-zinc-100 text-zinc-900`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

#### section

let's go into the main , that's typically good to start every page with main because this is going to be the dominant content on the page, the most important content

What other tags do we have?

Typically you're going to have multiple sections on your page, a section is pretty much the same as div, the only difference is that in section everything inside there is related to each other semantically speaking.

On the home page we may have some kind of landing page.

It could be an introductory section and these two elements (h1 and paragraph) in there belong to that same overall semantic meaning.

We can have another section maybe the benefits, here we could have the benefits of using this particular service, and then maybe about us.

```tsx
export default function Home() {
  return (
    <main className="min-h-screen">
      <section>
        <h1>Saas Metrics Inc.</h1>
        <p>We provide the best metrics for your SaaS business.</p>
      </section>
      <section>
        <h2>Benefits</h2>
        <p>text...</p>
      </section>
      <section>
        <h2>About us</h2>
        <p>We started because...</p>
      </section>
    </main>
  );
}
```

Here we have three different sections and we could use div tags instead of section tags, but section is just a little bit more semantically correct, because everything in there belongs to that same overall semantic meaning.

#### h1, h2, h3

We are using heading tags here and here H1 means it's the most important heading on the page and it's a hierarchy so H2 is slightly less important, we also have H3 even less important.
H2 are equally important so you can give them the same tag.

#### p (paragraph tag)

We are using this paragraph tag, you could use also div for that, but let's use a paragraph because that actually describes properly what that is

#### aside

There are some other tags that you're going to see sometimes, aside tag `<aside> </aside>`, this is for example for a sidebar, this should not be the main `<main> </main>` focus essentially, this is just something on the sides.

#### article

We also have article tag, articles a little bit more common.

Article is essentially the same as section, but an article you should be able to pull out of that website and put it somewhere else on a different website let's say and it should still make sense.

```tsx
export default function Home() {
	return <main className="min-h-screen">
	  <section>
	    <h1>Saas Metrics Inc.</h1>
	    <p>We provide the best metrics for your SaaS business.</p>
	  </section>
	  <section>
	    <h2>Benefits</h2>
	    <p>text...</p>
	  </section>
	  <section>
	    <h2>About us</h2>
	    <p>We started because...</p>
	  </section>

      <aside> </aside>

      <article> </article>

      <button> </button> and <a></a>

      <input /> and <textarea />

      <p>
        Lorem <b>ipsum</b> dolor <span className="font-bold">sit amet<span> consectatur, <strong>adipisicing elit</strong>. Culpa, isam.
      </p>
	</main>;
}
```

If we pull out this section here from this particular website and put it somewhere else it loses its meaning essentially, it's not clear the benefits of what exactly. This section needs the overall context here to make sense.

```tsx
<section>
  <h2>Benefits</h2>
  <p>text...</p>
</section>
```

An article, for example a blog article I can take the entire article, put put it somewhere else, it's still clear what it is.

It's an article talking about something, so it's self-contained.

In a world of web apps you may have some kind of widgets, like a weather widget or maybe a chat widget. Those types of widgets are also self-contained, you can put them anywhere, you can take them out and put them somewhere else and it still makes sense.

And actually it's a good idea to use article tag for that, although that's not really a great name for that, but it does semantically make sense to use the article tag for that because it's self-contained.

#### button vs a (anchor tag)

We also often have button tag `<button> </button>` , people confuse it sometimes with anchor tags `<a> </a>` .

When we click on an anchor tag the goal is navigation we should be navigating to some different route.

When we click on a button something interactive should happen, maybe we are opening up a modal.

You shouldn't use button for navigation, navigation is anchor tags, button is more "interactivity on the same page"

#### input vs textarea

We also have input tag and textarea tag.

You want to use input for one line of input,

textarea for multiple lines of input.

#### b, strong, i, em vs span (tags)

Let's say we have some text here and we want to make some part of the text bold.

We have some other tags that are a little bit strange to be honest, for example we have the b tag `<b> </b>` from "bold". We can wrap part of the text in b tag and it will become bold, this b tag one actually doesn't have semantic meaning.

There's also strong tag `<strong> </strong>`, it makes it bold but also adds semantic meaning as in this is more important.

We shouldn't use these tags just for styling, so styling we should really try to contain to CSS.

If we would just need this for styling we would just wrap this in a span `<span> sit amet </span>`which is essentially the same as div tag, span has no semantic meaning, this is an inline level element so it will not put this "sit amet" on a different line.

Div `<div> sit amet </div>` is a block level element, it will put text on a different line.

Here you can just style this. `<span className="font-bold"> sit amet </span>`, we can make it "font-bold", we will also get more granular control this way, we can make it medium "font-medium" or semi-bold "font-semibold".

The same with italic by the way, if we want to make it italic `<span className="italic"> sit amet </span>`. We are using a Tailwind class here and it could be preferred. In HTML we also have i tag `<i> sit amet </i>` it's the same as the b tag `<b> </b>`, it just makes it italic without semantic meaning.

Then there's also em tag (emphasized) `<em> sit amet </em>` so this also adds some additional meaning. Same as strong tag.

Using these tags could be disliked, usage of span tag and styling with CSS could be more preferred.

### Stripe website analysis

Let's take a look look at some examples (Stripe website) to see how other websites have done this and also show when you can actually use div.

At the top they do have a header tag and if we open this up (in browser devtools) they have a bunch of divs, div stands for divider.

Sometimes you need to do particular styling and it makes sense to group one part of the layout from other part. You often need div for styling to separate certain parts, divide them.

If you open up some part you will eventually see that Stripe website uses the nav tag.

They have mobile versions as well so the markup (HTML) here is a bit cluttered, but it does follow what you would expect.

For Stripe logo they actually use an anchor tag that wraps an SVG, if you click the logo you will actually go back to the home page.

They are also using section here, they don't seem to be using the main tag, it can be mistake, they have a bunch of different sections after the header.

For the hero section (typically that's the first part you see when you come to a page) they are using the section tag.

They are also using a section tag for the next section with logos of the clients, because all of these logos belong to the same overall semantic meaning, which is in this context that client are using Stripe. All of the elements in there (clients section) they have the same semantic purpose therefore it's better to wrap it in section than with div.

But not wrap that with article an article means we should be able to pull this out of here and put it somewhere else and should still make sense, that's not the case here, if we pull this (clients logos) out here and put it somewhere else it's not really clear what this is. But here in the context of the overall website we understand what this is, these are companies that are using Stripe. Companies logos are for section tag, this is correct one.

They also have a bunch of other sections, they are using an H1 and an H2 for this subheading

For subheadings it is better to use a paragraph tag actually, typically you don't want to use an actual heading tag for these subheadings. It's better to just use paragraphs but it's not a big deal.

That is usually these landing pages, right so just a bunch of different sections and then at the bottom they have a footer.

### MDN website

The good example is also a MDN website, let's take a look at their article page.

They are actually using the main tag, and they actually wrap the entire article actually in an article tag, which makes sense, because if we pull article out of here we can put it somewhere else, but the article still makes sense, it's still clear what it is. Article is self-contained it doesn't need the other context to make sense. The article tag is essentially the same as section tag but the additional requirement is that you should be able to pull it out and put it somewhere else and it should still make sense.

They actually have an interesting site navigation part (In this article) and they are actually using the aside tag for that, in there they have nav tag, nav is not only in the header, you can also use it in navigation part (in aside), because this is also an important block of navigation, it's perfectly fine to wrap this in a nav as well.

On the left side (left menu with link to articles) they are using the aside tag again for the sidebar on the left side.

### Web apps

What about web apps? We live in the age of applications which are much more interactive than these more static website pages. Can you still use semantic tags there?

In one of the projects in Bytegrad's CSS course we are using semantic tags here, so we have a header at the top.

When you can actually use a div?

A good use case for div is in info bar.
In info bar we have a publish button as well as these breadcrumbs on the left pointing on which site we are (Facebook posts ">"(icon) Happy-hour-friday - (whitespace gap) - button on the right).
They are two different things, they don't belong to the same overall semantic meaning but we still need to wrap them in something, because we need to style them separately from the rest.

We need to wrap them in some element to get this layout, we should not use a section tag here because they don't belong to the same semantic meaning, we should use a div, divider here, and then in there for the breadcrumbs themselves we should use section tag because the elements in there, this icon, this text, they belong together semantically speaking.

And with the button we want to publish whatever the result of this work is. That is a button, it should not be an anchor tag, we don't want to navigate (as with breadcrumbs on the left). We want to do something, maybe open up a modal for example.

```tsx
<main class="main">
  <div class="info-bar">
    <section class="breadcrumbs"> </section>
    <button class="button">Publish</button>
  </div>
</main>
```
