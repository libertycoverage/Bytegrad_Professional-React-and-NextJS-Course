## V189 When & Where To Add 'Use Client'

Description: Learn when and where to add 'use client' in Next.js

Mistake that has to do with server and client component

e.g. we have page.tsx

```tsx
import Button from "@/app/components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

button.tsx

```tsx
export default function Button() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
      onClick={() => console.log("Hello world")}
    >
      Click me
    </button>
  );
}
```

if we save we will get an error, that is because these client-side interactivities are only possible in client component. By default everything in the /app/ directory in Next.js is a server component

page.tsx and button.tsx are server components and we are trying to add interactivity that is only possible in client component.

If you do not pay attention you may think, ooh turn this thing into a client component using "use client", actually the whole page, when you do the whole page, error is gone and this will work, but we lose all the benefits that come from server components. What happens now is not only the Button will become a client component, because if you import something into client component, this button now also becomes a client component.

That means if you import something else e.g. Post component which is just a server component, does not need any client-side activity which is perfectly fine staying a server component, but because you are importing that here in page.tsx which is a client component, this post now will also become a client component, and that is not what we want.

page.tsx

```tsx
"use client";

import Button from "@/app/components/button";
import Post from "@/app/components/post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

post.tsx

```tsx
import sanitizeHtml from "sanitize-html";

export default function Post() {
  return <article>Post content</article>;
}
```

Ideally components can stay server components, there is, there is a reason why Next.js made everything server component by default, it is because server components come with a lot of benefits

https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#when-to-use-server-and-client-components

| What do you need to do?                                                            | Server Component | Client Component |
| ---------------------------------------------------------------------------------- | ---------------- | ---------------- |
| Fetch data                                                                         | +                | -                |
| Access backend resources (directly)                                                | +                | -                |
| Keep sensitive information on the server (access tokens, API keys, etc)            | +                | -                |
| Keep large dependencies on the server / Reduce client-side JavaScript              | +                | -                |
| Add interactivity and event listeners (`onClick()`, `onChange()`, etc)             | -                | +                |
| Use State and Lifecycle Effects (`useState()`, `useReducer()`, `useEffect()`, etc) | -                | +                |
| Use browser-only APIs                                                              | -                | +                |
| Use custom hooks that depend on state, effects, or browser-only APIs               | -                | +                |
| <br>Use [React Class components](https://react.dev/reference/react/Component)      | -                | +                |

they actually show this on their website so let's quickly go through it

they have server components versus client components

so here Dimension if you want to fetch data well they're basically saying you can do it on a server component you can't do it in a client component

it's not entirely true you can still you know fetch data in a client component what they mean here is in many cases it's it's optimal to do it from a server component because server component can be closer to the source of data

You can also access back-end resources for example you can update your database directly from a server component

You can keep sensitive information like token API Keys

now a big one is actually this one, keep large dependencies on the server so for example in our example here let's say this post component is actually using some third-party Library like sanitize HTML this is a big import as you can see ideally we can keep this on the server

we don't want to ship this to the client

post.tsx

```tsx
import sanitizeHtml from "sanitize-html";

export default function Post() {
  return <article>Post content</article>;
}
```

but now we are importing this post component here into a client component therefore this post component will actually become a client component and this will be shipped to the client all because we just wanted to add some interactivity to this button right, we don't we didn't even need to do this

page.tsx

```tsx
"use client";

import Button from "@/app/components/button";
import Post from "@/app/components/post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

we don't want to do this we want to remove this here and we want to add the use client to the button instead

page.tsx

```tsx
import Button from "@/app/components/button";
import Post from "@/app/components/post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

button.tsx

```tsx
"use client";

export default function Button() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
      onClick={() => console.log("Hello world")}
    >
      Click me
    </button>
  );
}
```

if we do this the button component will become a client component

we are still importing the button here and now if we go back to our page here you can see the error is still gone this still works but the page is still a server component, the post is still a server component so this big third-party library is still only on the server and the button is now client component and we can add client side interactivity

post.tsx

```tsx
import sanitizeHtml from "sanitize-html";

export default function Post() {
  return <article>Post content</article>;
}
```

these third parties can take up a lot of space, imagine you're working with like 3D assets or maybe video or audio assets and you're doing some analytics on them, or big data charts

there's lots of third-party libraries that you're going to use in in those contexts and if you can try keeping that a server components (not always possible) sometimes there's no way around, you really need that client-side interactivity but there's already people they're coming up with hacks right now but there's going to be more standards in the future around this that will allow you to keep it a server component, really try to see if you can keep it a server component,

it's really important that you understand as a React developer that your react app is basically a tree of components

there is a root component this is where it all starts

In Next.js that's actually this layout component, layout file (layout.tsx) and then there's the RootLayout component this wraps all of your pages in Next.js

layout.tsx

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "/components/container";

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
        <Container>
          <Header /> {children} <Footer />
        </Container>
      </body>
    </html>
  );
}
```

then you can have these pages below there, maybe a home page, about page, post page

and there is the root, that's basically it

Root fIle  
| | |
Page Page Page
| |
Button Post

Now these pages can import many different components maybe you have a button component like we has in this example or a post component or some date component (data when it was posted) and you're going to import these components all in this page

and a naive React developer when you want to add some interactivity only to this component may decide to mark this whole page component as a client component with "use client" and when you do that all of these components (leaves in the tree) now become client components

even though these two pages may not even need any client-side interactivity and you're losing all the benefits from server components

so the React or Next.js teams they recommend that you mark the components as a client component only on the outer edges of the tree (the leaves of the tree)

you don't want to add it here (page in this example)

you want to add it to the button, only the button is a client component now and these (pages and post) can all stay server components

try to use "use client" directive at the edge, the outer edges of your tree, at the leaves of the tree

---

Sometimes there is required some refactoring

let's say we have some kind of form components and in there we have a form and maybe other elements as well and then eventually you want to have a button as well

```tsx
export default function Form() {
  return (
    <div>
      <form></form>

      <button
        className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
        onClick={() => console.log("Hello world")}
      >
        Click me
      </button>
    </div>
  );
}
```

now if we want to do some interactivity on this button we can say onClick={() => console.log("Hello world")} so if you would do this, you would get an error now because this is a server component and we're trying to add interactivity

so now something here needs to become a client component, now if we would make this Form() a client component "use clients";

```tsx
"use clients";

export default function Form() {
  return (
    <div>
      <form></form>

      <button
        className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
        onClick={() => console.log("Hello world")}
      >
        Click me
      </button>
    </div>
  );
}
```

all of this is affected by it, so the form and other elements that don't even need any interactivity, now they also become client components, and maybe you're using some big third-party library in the form or some other elements here, now that will also get shipped to the client, all because we're making this a client component just for this button here

so it's better to basically remove this

```tsx
<button
  className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
  onClick={() => console.log("Hello world")}
>
  Click me
</button>
```

put it into its own component like here, mark this as the client component

button.tsx

```tsx
"use client";

export default function Button() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
      onClick={() => console.log("Hello world")}
    >
      Click me
    </button>
  );
}
```

then just import it here and use it like this, we can remove this "use client" here
and this this can stay a server component with all the benefits that we get from it and still import this client component here ` <Button />` , you get the same result with all the benefits from server components

Form.tsx

```tsx
import Button from "./button";

export default function Form() {
  return (
    <div>
      <form></form>

      <Button />
    </div>
  );
}
```

---

There is a big misconception, a big mistake that people are making with these provider components

let's say you're using the context API are you using some third-party library that has some kind of Provider component

ThemeContext.tsx

```tsx
"use client";

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
```

so basically this happens when a lot of your components in your React app need access to data,

with the context API for example you have this ThemeContextProvider, context details are left here and it takes in children and it also passes through the children, that's very typical here

and then you want to wrap parts of your app that need access to the data with this provider component

so typically a third typical pattern here is if we go into this RootLayout file

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "/components/container";

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
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}
```

if you're going to wrap basically the entire app in that Provider component, this is a very typical pattern, where all the pages essentially get access to the value that you are passing through with the Provider component

now these Provider components are typically client components

ThemeContext.tsx

```tsx
"use client";

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
```

Now the question is, since this is a client component and we are wrapping basically our entire app with this, do all of these other components now also become client components?

and the answer is no

something becomes a client component if you add "use client" in the file or you import it in another client component

you need to pay attention to basically the the import tree not the render tree

so these children here, all these components in here can still be server components

```tsx
<ThemeContextProvider>{children}</ThemeContextProvider>
```

and `<ThemeContextProvider>` this can be a client's component because here it's just taking the children and passing through the children

ThemeContext.tsx

```tsx
"use client";

export default function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
```

if you want to have server components inside a client component you have to use this children pattern to pass through the server components like this

that was a common misconception that if this is a client's component `<ThemeContextProvider>` and everything in here `<ThemeContextProvider>{children}` automatically becomes a client component

that's not true if you're using that children pattern (as in ThemeContext.tsx), so this can all stay server components `<ThemeContextProvider>{children}`

Would also be kind of strange, because this is such a typical pattern in react (Context Provider) and would be kind of strange if this would undo all those benefits from server components. That doesn't really make sense so that's not how it works.

so the way to think about it is it's not about the structure of how we're rendering it here

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Container from "/components/container";

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
        <ThemeContextProvider>{children}</ThemeContextProvider>
      </body>
    </html>
  );
}
```

it's about the structure of the import

Form.tsx

```tsx
import Button from "./button";

export default function Form() {
  return (
    <div>
      <form></form>

      <Button />
    </div>
  );
}
```

here if I import button into this client component (Form), the button becomes a client component

but here just because we are rendering server components {children} within a client component (ThemeContextProvider) as long as we're using the children pattern, that doesn't change anything

```tsx
<ThemeContextProvider>{children}</ThemeContextProvider>
```

it's really about the imports and not really about this rendering tree

### Boundary

but another way of looking at it is that's basically this "use client" is basically the boundary for server and client components

as soon as you add a "use client" here, everything that gets imported will also become client component, so this is basically a boundary

page.tsx

```tsx
"use client";

import Button from "@/app/components/button";
import Post from "@/app/components/post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

So this button right now I don't even need to add "use client" here

button.tsx

```tsx
//"use client";

export default function Button() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
      onClick={() => console.log("Hello world")}
    >
      Click me
    </button>
  );
}
```

The fact that I'm importing is here in this page here will mean that it becomes a client component so it's basically like a boundary

page.tsx

```tsx
"use client";

import Button from "@/app/components/button";
import Post from "@/app/components/post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

and then if I import something else here like an icon component that would also become a client component even though this file itself does not have "use client" (button.tsx)

If I would import another components in here (button.tsx) that also becomes a client component

So here we're basically defining a boundary in the reactory. Like from now on everything that gets importers here will also become client component

page.tsx

```tsx
"use client";

import Button from "@/app/components/button";
import Post from "@/app/components/post";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-y-5 p-24">
      <h1>Home page</h1>
      <Button />
    </main>
  );
}
```

and those components in turn when they import something they also become client components

button.tsx

```tsx
//"use client";

export default function Button() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
      onClick={() => console.log("Hello world")}
    >
      Click me
    </button>
  );
}
```

### Import twice

Now very tricky, what if you have a button and let's say we're importing that here in a form and let's make this form use client so this is going to be a client component

this button itself does not have "use client", so this is not inherently a client component

button.tsx

```tsx
//

export default function Button() {
  return (
    <button
      className="bg-blue-500 hover:bg-blue700 text-white font-bold py-2 px-4 rounded"
      onClick={() => console.log("Hello world")}
    >
      Click me
    </button>
  );
}
```

this is a client component we're importing the button here

form.tsx

```tsx
"use client";

import Button from "./button";

export default function Form() {
  return (
    <div>
      <form></form>

      <Button />
    </div>
  );
}
```

Now as you know you can import components in multiple other components so this post could also import button. Right so here we could add button here and this post is a server component so now I'm importing the same component in a server component as well as in a client component

post.tsx

```tsx
import sanitizeHtml from "sanitize-html";
import Button from "./button";

export default function Post() {
  return (
    <article>
      Post content
      <Button />
    </article>
  );
}
```

so what's going to happen here? Well it actually works as expected, basically this component here (button.tsx) is instantiated twice and in the in relation to this form here in the context of the form it's going to be a client component,

but in relation to the Post() here in the context of the post component here it will stay a server component

All of this is very confusing at first
