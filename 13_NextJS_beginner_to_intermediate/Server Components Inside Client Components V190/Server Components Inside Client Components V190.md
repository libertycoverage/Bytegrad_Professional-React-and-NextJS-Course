## Video 190 Server Components Inside Client Components

Description: Learn how to use server components inside client components, without accidentally converting the server component into a client component.

Also inside the course and here https://www.youtube.com/watch?v=9YuHTGAAyu0

There's a major misconception which is that you cannot have server components in a client component and that's actually wrong you can easily do that in Next.js

Let's take a look at an example, we're going to have the server components going to be a page and in there we're going to have a client component, pretty standard

maybe you have a page in Next.js and in there you can have client components

But now what if you want to have a server component in that client component

a lot of people think that's not possible or if you do that that it will automatically become a client component as well and that's not true

let's take a look at how that would work

you can imagine a provider component usually that's a client component and you wrap a lot a big part of your app with that client component so you would think oh maybe everything then becomes a client component and that's not true

you can have a client component and in there you can still have server components

### Client Component in Server Component

We have a page component and this is just displaying some text so this text is in a server component
Now this is a server component because everything by default in the /app/ directory in Next.js is a server component

page.tsx

```tsx
export default function Home() {
  return (
    <main className="bg-gray-300 p-5">
      <p>1. This text is a server component (page)</p>
    </main>
  );
}
```

now we want to have let's say a client component in here let's quickly create a client component I will just call that example-client-component.tsx

example-client-component.tsx

```tsx
"use client"; //"use client" directive

export default function ExampleClientComponent() {
  return (
    <div className="bg-slate-400 p-5">
      <p>2. This text is from a client component</p>
    </div>
  );
}
```

now we have a server component and in there we have ExampleClientComponent

page.tsx

```tsx
import ExampleClientComponent from "@components/example-client-component";

export default function Home() {
  return (
    <main className="bg-gray-300 p-5">
      <p>1. This text is a server component (page)</p>

      <ExampleClientComponent />
    </main>
  );
}
```

### Server Component in Client Component

We want to have a server component in this client component (ExampleClientComponent)

so now let's create another server component

here we don't have "use client" at the top it's not inherently a client component

```tsx
export default function ExampleServerComponent() {
  return (
    <p className="bg-slate-600 p-5">3. This text is from a server component</p>
  );
}
```

so now you
may think we need to import it here in this ExampleClientComponent, now if we would do this import ExampleServerComponent
if I would import this here it actually becomes a client component. Component becomes a clients component if you add "use client" or if you import it into a component that is a client component.  
It's not really about the rendering tree it's more about these imports. Here we're importing this into a client component so this automatically becomes a client component.
(THAT IS NOT WHAT WE WANT, we want a server component inside a client component)

We do not want this ->
example-client-component.tsx

```tsx
"use client"; //"use client" directive

import ExampleServerComponent from "./example-server-component";

export default function ExampleClientComponent() {
  return (
    <div className="bg-slate-400 p-5">
      <p>2. This text is from a client component</p>

      <ExampleServerComponent />
    </div>
  );
}
```

That's not what we want, we want to keep this a server component so we cannot do it this way,
you cannot just add it like this (if you want a server component inside a client component), you can do it but it will be a client component

We want this to stay a server component so we cannot import it in here

the trick here if we go to the page.tsx here where we have this is server component

page.tsx

```tsx
import ExampleClientComponent from "@components/example-client-component";

export default function Home() {
  return (
    <main className="bg-gray-300 p-5">
      <p>1. This text is a server component (page)</p>

      <ExampleClientComponent />
    </main>
  );
}
```

this is the client component (ExampleClientComponent) instead of using the self closing tag `<ExampleClientComponent />`
we're going to use an opening and closing tag, this will work the same way, whatever we add in between here this will be available to us in the children prop

page.tsx

```tsx
import ExampleClientComponent from "@components/example-client-component";

export default function Home() {
  return (
    <main className="bg-gray-300 p-5">
      <p>1. This text is a server component (page)</p>

      <ExampleClientComponent>Text</ExampleClientComponent>
    </main>
  );
}
```

In this client component now we need to accept that there could be some child's elements in there or some stuff in here essentially that we get as a child, we want to type this, you can type it React.ReactNode and then we can output that below {children}

```tsx
"use client"; //"use client" directive

export default function ExampleClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-400 p-5">
      <p>2. This text is from a client component</p>
      {children}
    </div>
  );
}
```

You can just you can just pass it through and so whatever (e.g. Text) this client component gets in between page.tsx `<ExampleClientComponent>Text</ExampleClientComponent>`

it's going to be assigned to children here and we're just passing that through and we're just rendering it here

```tsx
export default function ExampleClientComponent({
   children,
   ...
   return (
   {children}
   )
```

The trick here is not to use (e.g. Text) here page.tsx `<ExampleClientComponent>Text</ExampleClientComponent>` but to actually use that server component. This is how it's supposed to work, so we can just write server components in here.
We have imported it here, now this is still server component this page component (page.tsx is a server component in this case). We import a server component into a server component. We can just render it in between. We get the result that we're looking for (server component inside a client component)

page.tsx

```tsx
import ExampleClientComponent from "@components/example-client-component";
import ExampleServerComponent from "@components/example-server-component";

export default function Home() {
  return (
    <main className="bg-gray-300 p-5">
      <p>1. This text is a server component (page)</p>

      <ExampleClientComponent>
        <ExampleServerComponent />
      </ExampleClientComponent>
    </main>
  );
}
```

ExampleServerComponent is the children of this client component ExampleClientComponent

```tsx
"use client"; //"use client" directive

export default function ExampleClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-400 p-5">
      <p>2. This text is from a client component</p>
      {children}
    </div>
  );
}
```

If we want to have a server component in a client component you have to use this children pattern

The result is we have a server component (page) and in there we have a client component (ExampleClientComponent) and then in there we have another server component (ExampleServerComponent)

### Context Provider Example

let's make a more realistic example

Typically if you have a context, if you're using the Context API, maybe you're keeping track of the theme so we can have some ThemeProvider component, it could look something like this

ThemeProvider.tsx

```tsx
"use client";

import React, { createContext, useState } from "react";

const ThemeContext = createContext("light");

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
```

We have this ThemeProvider, it's the component, it's keeping track of the state of the theme and we're using useState for that, that's client-side functionality, so we need to make ThemeProvider a client component. We are using createContext and then this ThemeContext.Provider

the important point here is that this is a client component and typically you want to wrap pretty big parts of your app with this ThemeProvider, a lot of components have access to the value that you're passing through by Context Provider

Typically what you would do, is then you would go to your layout.tsx file and here this layout file with the {children} here, this is going to be the pages.tsx here

the important part is typically what you want to do here is you want to have Context Provider e.g.
ThemeProvider which is a client component. You can now wrap basically your entire app with this ThemeProvider

now the idea is some people think that well ThemeProvider is a client component and we're basically putting everything on our entire app in there, so now everything in our app is basically a client component

that's not true, as we saw here in the example (server component has inside a client component which has a server component inside), here we saw server component in a client component, but you have to use this children prop

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex justify-center items-center`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

this ThemeProvider is indeed accepting children here and it's just passing through the children

ThemeProvider.tsx

```tsx
"use client";

import React, { createContext, useState } from "react";

const ThemeContext = createContext("light");

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
```

you can have this ThemeProvider being a client component and then in there you can still have server components `<ThemeProvider>{children}</ThemeProvider>` passed as children

This is a major misconception with these Provider Components that you know you shouldn't use them because then you can gonna make your entire app all client components

and that's not true

all your components can still stay server component as long as you use the children pattern you can easily nest server components in client components

a component only becomes a client's component if you add use client at the top or you import it into a
component that's already a client component

```tsx
"use client"; //"use client" directive

export default function ExampleClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-400 p-5">
      <p>2. This text is from a client component</p>
      {children}
    </div>
  );
}
```

so if I would import some other components here right this example server components now I'm making this ExampleServerComponent a client component as well, the name is still server component but it's going to become a client component because I'm importing it into a component that is a that's
already a client component

example-client-component.tsx

```tsx
"use client"; //"use client" directive

import ExampleServerComponent from "./example-server-component"; // if we import a server component into a client component like this that would implicate that this meant-to-be server component becomes a client component; instead of doing this we need to wrap server component within client component using children pattern within a server component one level up, as we presented

export default function ExampleClientComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-400 p-5">
      <p>2. This text is from a client component</p>
      {children}
    </div>
  );
}
```

a bit tricky perhaps
