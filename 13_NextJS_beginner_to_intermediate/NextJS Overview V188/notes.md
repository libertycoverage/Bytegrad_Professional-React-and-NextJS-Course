Main concepts in Next.js (App Router):

1. Routing and navigation `<Link />`
2. Metadata
3. Styling (Tailwind CSS)
4. `<Image />`
5. Client vs Server components - Data fetching (GET-requests)
6. Server actions (POST/PUT/DELETE)
7. Suspense and streaming
8. Caching
9. Static & dynamic rendering
10. Middleware
11. Folder structure
12. Production build and deploying

---

The latest App Router is a game changer for web development. You can now build full stack application in just React, you do not need separate backend anymore.
Author of a course identified 12 most important concepts that are needed to know.

$ sudo su
sh-3.2 $ exit
/example-project $ npx create-next-app@ latest .

we want to put files in example folder, so we want to use dot . at the end, otherwise it would create a folder for a project

Typescript - Yes
ESLint - Yes
Tailwind CSS - Yes
src/ directory - Yes
App Router - Yes
Would you like to customize the default import alias - No

We do not wanna customize default import this is what you have with ../../ with those import file paths

$ npm run dev

first you want to remove boilerplate from page.tsx

layout.tsx is the root component, all of the pages are going to be {children} here, and they are gonna be wrapped body tag

then you want to clean up global.css leaving just:
@tailwind base;
@tailwind components;
@tailwind utilities;

1. Routing and navigation `<Link />`

we have a src directory, in there we will have app directory, in here you determine all of the routes of the application,
so in the root you will have page.tsx file that is gonna be for the home page

we want to have localhost:8080/posts route
to have go to app directory and ion there create a folder called posts, and in there have another page.tsx file,
that is the page fot the /posts route

What about the individual posts (you can have thousands of them)?

What we want to have is localhost:8080/posts/8456 , we want to have the id of the post in the route
In posts folder you create folder with a name id in the square brackets, this is a dynamic route as it is called,
you write that in square brackets, and in there (in id with square barackets - named folder) you will have another page.tsx file

every linked post with it's own id in the URL will use the same page.tsx file the the dynamic route (folder named with square brackets)

layout.tsx is a root of application
in the example footer and header stay the same, this is described in layout.tsx

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
}: Readonly<{ children: React.ReactNode }>) {
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

Every page will be sandwiched between Header and Footer, it also has Container to restrict the width on every page

site-nav.tsx

```tsx
import { usePathname } from "next/navigation";
export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex gap-x-5 text-[14px]">
        {siteRoutes.map((siteRoute) => (
          <li key={siteRoute.href}>
            <Link
              href={siteRoute.href}
              className={`text-zinc-400
transition ${pathname === siteRoute.href ? "text-zinc-900" : ""}`}
            >
              {siteRoute.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

using built-in Link component, this will essentially render anchor tag (a, without href)
Traditionally with anchor tag you would get a whole new page,
however with NextJS Link component you would not send a new request to the server,
NextJS will manage all of the routing here client-side.
In production this Link component will also prefetch the page, when it is in view.

---

2. Metadata

NextJS also makes it really easy to work with metadata in the project

by default in the layout.tsx you can configure metadata, title is what you see in a tab,
also this is what you see in Google search ranking.
If you only have this one in your layout.tsx file this will be global for the entire app.
If you wanna override it on some page, you can export the same variable, also export const metadata,
then just set a title specific for the page

---

3. Styling (Tailwind CSS)

page.tsx

```tsx
export default function Home() {
  return (
    <main className="text-center pt-32 px-5">
      <h1 className="text-4xl md:text-5xl font-bold mb-5">
        Welcome to my blog
      </h1>
      {/* these classNames below come from Tailwind CSS, it is default in NextJS when you create the application */}
      <p className="max-w-[750px] mx-auto leading-8"> Lorem, ipsum</p>
    </main>
  );
}
```

these classNames come from Tailwind CSS, it is default in NextJS when you create the application

NextJS gives that global.css file; main benefit of Tailwind CSS is that you do not have to come up
with a separate classNames putting them to global.css just like in a normal React app.

---

4. `<Image />`

NextJS offers out of the box Image component

Header.tsx

```tsx
import Image from "next/image";
import Link from "next/link";
import SiteNav from "./site-nav";

export default function Header() {
  return (
    <header className="flex justify-between items-center py-4 px-7 border-b">
      <Link href="/">
        <Image
          src="https://placehold.jp/000000/ffffff/150x150.png?text=B&css=%7B%22border-radius%22%3A%2215px%22%7D"
          alt="logo"
          className="h-[35px] w-[35px]"
          width="50"
          height="50"
        />
      </Link>
    </header>
  );
}
```

Header used for the logo
Image component wrapped in a Link component, when you click the image, you go to the homepage

Image component will render img tag in HTML,
iI you have a png image for example that is a heavy image, because it is not compressed,
however with Next.js you can serve webp version of that.

This Image component will also help you make image responsive, because it will set the src, and some other attributes as well.
Sometimes with images, especially if it is a big one it may shift content around,
e.g. if the image is big it will shift the text down.

It is called "content layout shift" or CLS, it is one of the matrix that Google looks at when ranking your website.
This Image component also helps you out with that, it can do it automatically,
if yuo have image in your file system (tree of files of an app), it will set the width and height of image,
or if it is external image src="URL" (domain name different from own website,
Next.js will not automatically allow you to do this), you have to set width and height by yourself to prevent the layout shift.

src="URL" (domain name different from own website, Next.js will not automatically allow you to do this), you have to go to next.config.js (or next.config.mjs)

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
    ],
  },
};

//module.exports = nextConfig;
export default nextConfig;
```

here you need to specify for images that you explicitly want to allow from this hostname (here hostname: "placehold.jp",)

this is for security reasons

---

5. Client vs Server components - Data fetching (GET-requests)

This is major innovation

Previously in VIte app everything is a client component, all the code, all the component is shipped to the client and those components will run there in the browser.

These days we also have server components, these components only run on the server, this has certain benefits,
Next.js team recommends now, when you make a GET request to fetch data, you do that in the server component

Here on
/posts/page.tsx

```tsx
import PostsList from "@/components/posts-list";

export default async function PostsPage() {
  const response = await fetch(`https://dummyjson.com/posts?limit=3`);
  const data = await response.json();

  return (
    <main className="text-center pt-16 px-5">
      <h1 className="text-5xl font-semibold mb-7">All posts</h1>
      <PostsList posts={data.posts} />
    </main>
  );
}
```

Here we are in the server component,

because everything by default it the /app directory is a server component

also all of the pages in /app tree are server components

In server component you can do the fetch call, and pass that to another component, that can be client component,
Next.js behind the scenes will make sure const data goes from the server to the client

Benefit of fetching on the server is that it can be closer the the actual data source, for example if you have a database somewhere in the world,
we can make it so fetch will happen close to the data.

Another benefit of server component is that we can keep large dependencies on the server only,
if you use third party that is pretty heavy

e.g. import SyntaxHighliter from "react-syntax-hightligther"; (904.1k) this is a big 3rd party dependency,

this will only stay on the server, and the result of this render output will be sent to the client, not all of the dependencies here

on the client this component won't need to render, it can already render on the server with the syntax highlighting, and the result of that will be given to the client

you may have some code block you wanna style

page.tsx

```tsx
// "use client";
import SyntaxHighlighter from "react-syntax-hightligther";

type PostPageProps = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const response = await fetch(`https://dummyjson.com/posts/${params.id}`);
  const data = await response.json();

  return (
    <main className="px-7 pt-24 text-center">
      <h1 className="text-5xl font-semibold mb-7">{data.title}</h1>
      <p className="max-w-[700px] mx-auto">{data.body}</p>

      <SyntaxHighlighter className="text-left">
        {`function() { return "Hello world!"; }`}
      </SyntaxHighlighter>
    </main>
  );
}
```

by using "use client"; we can add or remove resources that will be sent to the client

---

6. Server actions (POST/PUT/DELETE requests)

Maybe the biggest innovation in Next.js

For these requests POST/PUT/DELETE we can use server actions

with server actions we can replace POST/PUT/DELETE requests

form on the localhost:8080/posts route, we can submit a new post here, we are getting posts from the database and they are passed into {posts}

in a server component you can interact with a database, prisma as ORM

there is a component AddPostForm to add a new post

page server actions.tsx

```tsx
import AddPostForm from "@/components/add-post-form";
import PostsList from "@/components/posts-list";
import prisma from "@/lib/db";

export default async function PostsPage() {
  const posts = await prisma.post.findMany();

  return (
    <main className="text-center pt-16 px-5">
      <AddPostForm />
      <h1 className="text-5xl font-semibold mb-7">All posts</h1>
      <PostsList posts={posts} />
    </main>
  );
}
```

when we go to add-post-form.tsx

```tsx
import SubmitBtn from "./submit-btn";
import prisma from "@/lib/db";

export default function AddPostForm() {
  const addPost = async (formData: FormData) => {
    "use server";

    //to slow down the server manually to see the change of a color of a button setting to grey while is is disabled
    await new Promise((resolve) => setTimeout(resolve, 2000));

    await prisma.post.create({
      data: {
        title: formData.get("title") as string,
        body: formData.get("body") as string,
      },
    });
  };

  //const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // e.preventDefault();

  // const formData = new FormData(e.currentTarget);
  // fetch("/api/posts", {
  //  method: "POST",
  //  body: formData,
  // });
  //}

  return (
    <form
      //before you had to make /api route with like
      // onSubmit={handleSubmite}
      action={addPost}
      className="flex flex-col rounded max-w-[500px] mb-10 mx-auto space-y-2"
    >
      <input
        type="text"
        name="title"
        placeholder="Title"
        className="border rounded h-10 px-3"
        required
      />

      <textarea
        name="body"
        placeholder="Body"
        className="border rounded p-3"
        rows={5}
        required
      />

      <SubmitBtn />
    </form>
  );
}
```

there is one special thing here that is for action attribute here have passed the addPost function, that is so called server action

you can define that in the component body as above, or you can put it in separate file
this is a normal function except you add "use server" at the top
This function will only run on the server

What you also get here is the formData, if you pass the function here
-> action={addPost} Next.js will automatically give the formData to that function,
so you do not have to collect the information yourself anymore

before you had to make /api route with like form tag onSubmit={handleSubmite}
then you would have to do:

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  fetch("/api/posts", {
    method: "POST",
    body: formData,
  });
};
```

and in there e.preventDefault(); to prevent that weird submission (reload of the page) the browser does when you submit the form

you will need the formData, or maybe you have to formData in state
you have to create a whole separate /api/posts to just send data to route
maybe you have to create actual route handler
and then in there you can add to the database

This way client and server do very separate things, and you have to do work to cross that boundary going from client to server,

now that boundary has been abstracted away with Next.js Server Actions
now you create normal javascript function, marked with "use server", it will only run on the server,
and Next.js will make sure that data from this form on the client will be sent to the server and specifically
to the async formData function, which then add to the database

There are other benefits of this e.g.

We had to refresh to see the new post, what you can also do is to use revalidatePath("posts");
this is optional to not to refresh after adding a new post

after update to the database it will re-render this route

PostsPage() component will be re-, and it will get new posts from the database
result is streamed in to the application

if we want to add loading indicator it is very easy

we have submit-btn.tsx

```tsx
"use client";
import { useFormStatus } from "react-dom";

export default function SubmitBtn() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-zinc-900 disabled:border-b-zinc-500 transition text-white rounded py-2 px-3"
    >
      Submit new post
    </button>
  );
}
```

We get a hook useFormStatus(); from React, here we can see if it is pending or not, basically is there server action running here,

this needs to be a client component

we can disable the button when it is pending when it is submitting, because we do not want it to submit twice,

with Tailwind it is easy, we can select element in the disabled state, when it is disabled give it the lighter background color

We are creating a new post in the database from that formData

We add to add-post-form.tsx
to slow down the server manually to see the change of a color of a button setting to grey while is is disabled

await new Promise((resolve) => setTimeout(resolve,2000));

Server Actions including the hooks such as useFormStatus that work with them are the biggest innovation in Next.js

---

7. Suspense and streaming

this is has to do with loading

is takes a little bit to fetch all of the posts, we are awaiting till it fetch all of the posts from the database

the same is when clicking on the individual blog post, we have to wait a little bit when it is fetched from the database

loading.tsx this is also a special file, just like page.tsx
because what you are telling Next.js i this is what you wanna have as a fall back while something is loading,
this appears as a loading text while waiting

```tsx
export default function Loading() {
  return <div className="text-center mt-14">Loading...</div>;
}
```

this is what you want to use most of the time when you have some kind of async await,
you await some asynchronous action, usually that means data fetching

What does it have to do with Suspense and streaming?

we added loading.tsx on the same level as page.tsx for /posts/ catalog
What Next.js will do behind the scenes it will take that posts <Page /> and will wrap up with that <Suspense > </Suspense> component,
and the fallback will be the actual loading file

component hierarchy

```tsx
<Layout>
  <Header />
  <SideNav />
  <Suspense fallback={<Loading />}>
    <Page />
  </Suspense>
</Layout>
```

this is essentially a React feature, Next.js abstracts this away from you with that loading.tsx file,

one downside of this, (you go to the All posts site), the whole page will now be blocked

if we look here

```tsx
export default async function PostsPage() {
const posts = await prisma.post.findMany();
```

we are fetching posts only fot this <PostsList posts={posts} /> component here, we are awaiting that,
while this is going on we see that loading indicator,
this also means we do not see "All posts" <h1 className="text-5xl font-semibold mb-7">All posts</h1>

when you go to that route we do not immediately see "All posts"

it will be more visible when we add a delay of 1s to the "page server actions.tsx"

``tsx
...
export default async function PostsPage() {

await new Promise((resolve) => setTimeout(resolve, 1000));

const posts = await prisma.post.findMany();
...

````

we can see Loading is blocking everything, we only need a data for this <PostsList posts={posts} /> component,
everything else will also be invisible until that is complete, when we actually get the data, even we do not need data for h1 HTML tag

This is not a good user experience, when you go to the page you want to immediately show "All posts" header,
so they know they are on the right page, but now we do not gonna see h1 because of getting all of the data from the database is blocking everything on the page

what we can do is to move this

```tsx
await new Promise((resolve) => setTimeout(resolve, 1000));

const posts = await prisma.post.findMany();
````

out of this PostsPage() component, we can also move that down to that "post-list.tsx" itself

```tsx
import Link from "next/link";

//type PostsListProps = {
//  posts: Post[];
//};

// export default function PostsList({ posts }: PostsListProps) {
export default async function PostsList() {
  // we can remove the props because it won't receive props anymore

  // MOVED HERE
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  //const posts = await prisma.post.findMany();
  // MOVED HERE

  return (
    <>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="max-w-[400px] mb-3 mx-auto]">
            <Link href={`/posts/${post.id}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </>
  );
}
```

PostsList is also a server component

we can remove the props because it won't receive props anymore

Now we can remove Loading.tsx file from /a///post/loading.tsx

we do not want the loading indicator for the whole page only for the <PostsList /> component,
you can also manually wrap that in the Suspense

page server actions.tsx

```tsx
<Suspense fallback="Loading...">
  {" "}
  <PostsList />{" "}
</Suspense>
```

you can actually put <PostsList /> component in there because it is asynchronous component and it will be suspended until it is resolved

post-list.tsx

```tsx
export default async function PostsList() {
```

Until is has been resolved, until the data fetching has been completed we can show fallback

Now Loading is not blocking the entire page, it is only minimal version of loading indicator when posts are fetched

when this is complete, this has been resolved

post-list.tsx

```tsx
const posts = await prisma.post.findMany();
```

the result of this will be streamed in, you do not have to do refresh or anything,
Next.js will make sure that when this render if finally finished it will be streamed in

post-list.tsx

```tsx
return (
  <>
    <ul>
      {posts.map((post) => (
        <li key={post.id} className="max-w-[400px] mb-3 mx-auto]">
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  </>
);
```

That is basically Next.js suspense and streaming

---

8. Caching
9. Static & dynamic rendering

10. Caching is closely related to 9) Static & dynamic rendering

By default Next.js is aggressively caching the application
It is probably the most complex topic in Next.js

Router Cache make sure you have an instant reload of he page with back and forth button in the browser

by default it will only be cached for 5 minutes,

that client-side cache also will be gone when you use refresh button

This is all client-side.

Next.js also manages two caches on the server

to show this, we will make a random amount of blog posts, it is always going to be at least one:

page.tsx
``tsx
import PostsList from "@/components/posts-list";

export default async function PostsPage() {
const randomNumber = Math.floor(Math.random() \* 10) + 1; // to explain server caches in Next.js

// const response = await fetch(`https://dummyjson.com/posts?limit=3`);
const response = await fetch(
`https://dummyjson.com/posts?limit=${randomNumber}`
); // to explain server caches in Next.js
const data = await response.json();

return (

<main className="text-center pt-16 px-5">
<h1 className="text-5xl font-semibold mb-7">All posts</h1>
<PostsList posts={data.posts} />
</main>
);
}
```

this is called dynamic rendering
there is no caching, it is changing every time we make a request

this is only during development
development is when we use $ npm run dev

when we make a clean Next.js install we have couple of scripts in package.json

```json
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "next lint"
```

eventually you want to run build to optimize everything, minify project, make as small as possible, as performant as possible,
result of that build is what you will use in production

if you quickly wanna run that build just in browser you can use $ npm run start

this is relevant, when we go to the PostsPage this is dynamically rendered with development tools,
but when you go to production, Next.js will make this random generation of number a static, it basically will be cached

when we make $ npm run build
at the bottom it says static - prerendered as static content

we have a description of routes as an output of a build

.next folder will have the result of that build

$ npm run start
we run the build of an app

every time we refresh the page that is using Math.random() the served page is static and the amount of posts is not dynamic

to force that to be dynamic we have to use

```tsx
export const dynamic = "force-dynamic";
```

here

page.tsx

```tsx
import PostsList from "@/components/posts-list";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const randomNumber = Math.floor(Math.random() * 10) + 1; // to explain server caches in Next.js

  // const response = await fetch(`https://dummyjson.com/posts?limit=3`);
  const response = await fetch(
    `https://dummyjson.com/posts?limit=${randomNumber}`
  ); // to explain server caches in Next.js
  const data = await response.json();

  return (
    <main className="text-center pt-16 px-5">
      <h1 className="text-5xl font-semibold mb-7">All posts</h1>
      <PostsList posts={data.posts} />
    </main>
  );
}
```

now we rebuilt it again
$ npm run build

now after rebuild we have a description of lambda sign in terminal for /posts route

$ npm run start

Now every time we refresh the page we get a dynamic random number of posts on the page,
every time we make a request it is going to render that component,
it is going to be true for everything in this route now,
so with this setting we are setting it for the entire route, also the child components,
they also will be dynamically rendered every time we make a request

```tsx
export const dynamic = "force-dynamic";
```

if you want to be more granular, you can say for this fetch call only, only this one should be dynamic

we can specify something for the fetch call, this is Next.js only specific implementation,
you cannot do that outside Next.js

```tsx
 {
      cache: "no-cache",
    }
```

this is how you can opt-out from that aggressive caching Next.js does

```tsx
import PostsList from "@/components/posts-list";

//export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const randomNumber = Math.floor(Math.random() * 10) + 1; // to explain server caches in Next.js

  // const response = await fetch(`https://dummyjson.com/posts?limit=3`);
  const response = await fetch(
    `https://dummyjson.com/posts?limit=${randomNumber}`,
    {
      cache: "no-cache",
    }
  ); // to explain server caches in Next.js we added randomNumber
  const data = await response.json();

  return (
    <main className="text-center pt-16 px-5">
      <h1 className="text-5xl font-semibold mb-7">All posts</h1>
      <PostsList posts={data.posts} />
    </main>
  );
}
```

for the post specific use case with the blog we should use cache, posts on the blog won't change very often

What about when we do have a new post?

We can specify something else, next, revalidate

```tsx
import PostsList from "@/components/posts-list";

//export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const randomNumber = Math.floor(Math.random() * 10) + 1; // to explain server caches in Next.js

  // const response = await fetch(`https://dummyjson.com/posts?limit=3`);
  const response = await fetch(
    `https://dummyjson.com/posts?limit=${randomNumber}`,
    // {
    //   cache: "no-cache",
    // }
    {
      next: {
        revalidate: 3600,
      },
    }
  ); // to explain server caches in Next.js we added randomNumber
  const data = await response.json();

  return (
    <main className="text-center pt-16 px-5">
      <h1 className="text-5xl font-semibold mb-7">All posts</h1>
      <PostsList posts={data.posts} />
    </main>
  );
}
```

with this option (next, revalidate) it means it should be cached, but after an houre (3600s) it actually should fetch new data again

After 1 h when we do make a request it will re-render, it will actually make new fetch call

On the server there are 2 caches:

1. we make a fetch call and the result of that will be stored in so called data cache,

2. and there is also a full route cache

full route cache - basically all the component of the route will be rendered, adn the result of that will be cached on the server as well

Cache and Static & dynamic rendering are the most complex topics in Next.js

---

10. Middleware

Middleware is something that you can run before the request hits the server,
e.g. when you click the refresh button there will be request tot the server, and right before the request hits the server, we can already run some code, maybe check if the user is logged in,

so you can create middleware.ts file and that needs to be directly in the root of the app directory

example:

middleware.ts

```tsx
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return NextResponse.redirect("/login");
  }

  // if the user is not authenticated you redirect them to the login page,
  // otherwise you can let the request continue

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/account"],
};
```

function, we can name it middleware it will get that request,

middleware allows you to hook into that incoming request before it touches anything else on the server,
you can quickly run some code

here you get the request, we can type this as NextRequest,

the most common use case for middleware is authentication

In real world you may use NextAuth or 3rd party for authentication - something like Kinde to deal with authentication

here in the example if the user is not authenticated you redirect them to the login page,
otherwise you can let the request continue

You can also match for which routes it needs to run this, maybe not all routes, maybe only /dashboard and the /accounts should be protected

---

11. Folder structure

/public/ - used for images, static files you can reference in the code, but not a favicon

(for a favicon /src/app/favicon.ico) this is one of the special files

other special files are e.g. robots.txt (you can add robots.txt to /src/app directory and Next.js will pick that up )

other special files are e.g. error.tsx, loading.tsx

there is also a special not-found.tsx file in Next.js

```tsx
export default function NotFound() {
  return <div>That post was not found...</div>;
}
```

this can be useful in the [id] page (in the id dynamic route folder (with square brackets))

page.tsx

```tsx
// "use client";

import SyntaxHighlighter from "react-syntax-hightligther";

type PostPageProps = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const response = await fetch(`https://dummyjson.com/posts/${params.id}`);
  const data = await response.json();

  return (
    <main className="px-7 pt-24 text-center">
      <h1 className="text-5xl font-semibold mb-7">{data.title}</h1>
      <p className="max-w-[700px] mx-auto">{data.body}</p>

      <SyntaxHighlighter className="text-left">
        {`function() { return "Hello world!"; }`}
      </SyntaxHighlighter>
    </main>
  );
}
```

here on the individual PostPage, we are trying to get the id from the URL
localhost:8000/posts/1
and Next.js will give us that in params
in PostPage components we get params, because we have id in square brackets,
then in there you get the id

```tsx
fetch(`https://dummyjson.com/posts/${params.id}`);
```

it is id because we called that id in the name of the folder

normally people can put some jibberish here
localhost:8000/posts/jibberish-089191
to access post that may not exist

if that does not exist this api still will return object, but it won't have a title, won't have id

here we can just check if post does not have a title, we know there is no related post,
you can call notFound() function from Next.js that will automatically show not-found.tsx component

[id] page.tsx

```tsx
// "use client";

import { notFound } from "next/navigation";
import SyntaxHighlighter from "react-syntax-hightligther";

type PostPageProps = {
  params: {
    id: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const response = await fetch(`https://dummyjson.com/posts/${params.id}`);
  const data = await response.json();

  if (!postMessage.title) {
    return notFound();
  }

  return (
    <main className="px-7 pt-24 text-center">
      <h1 className="text-5xl font-semibold mb-7">{data.title}</h1>
      <p className="max-w-[700px] mx-auto">{data.body}</p>

      <SyntaxHighlighter className="text-left">
        {`function() { return "Hello world!"; }`}
      </SyntaxHighlighter>
    </main>
  );
}
```

---

12. Production build and deploying

First of all what you could do, is you could take the entire app and create a bunch of HTML, CSS, Javascript files from that

This is called static export

you can do that by going to Next configuration file next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["62.72.26.118", "localhost:3000"],
      allowedForwardedHosts: ["62.72.26.118", "localhost:3000"],
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
    ],
  },
};

//module.exports = nextConfig;
export default nextConfig;
```

when you do output: "export" you gonna lose some server-side features, one of them is actually image optimization,
when you use output: "export" , there will be an error because we used Image component in the project

you just have to be explicit that you use unoptimized: true

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //  serverActions: {
  //    allowedOrigins: ["62.72.26.118", "localhost:3000"],
  //    allowedForwardedHosts: ["62.72.26.118", "localhost:3000"],
  //  },
  // },

  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
    ],
    unoptimized: true,
  },
};

//module.exports = nextConfig;
export default nextConfig;
```

and now when you run $ npm run build, you will get new .next folder, which will have HTML file for each route,
and you will have JS and CSS files, just static asset, you can host anywhere you want,
there will be no some server in the background, servicing requests

this is something you could do, but you lose benefits you get of Next.js, things like server components, server actions will not work the same

instead we want to have server running in the background, a Node.js server

typically you do not wanna do this -> output: "export", and we want optimized images

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.jp",
      },
    ],
  },
};

//module.exports = nextConfig;
export default nextConfig;
```

For hosting it is good to know Next.js application is actually a Node.js app, anywhere you run Node you could be able to run Next.js application

if you are a beginner you may wanna use some managed platforms like Vercel

Whatever the option you pick for deploying, you fist wanna push it to GitHub fist

this project was pushed by the author to
<https://github.com/ByteGrad/cool-app>

if we look at .env

```
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="file:./dev.db"
```

this is what you will need using something like prisma (necessary for things like prisma to work)

this is not a secret "file:./dev.db" it will not be a problem is someone sees this, we still have that as an environment variable,
and we also need this in production, this needs to be included in repository

if you have some information that actually should be a secret

Next.js recommends that you create .env.local file
this is where you would actually put secrets

.env.local file is greyed out because be default in .gitignore .env.local is already included there

for .env.local and .env
(This file should be named .env.local not \_env_local
\_env_local is used purely that it won't be affected by .gitignore file)

When you create a new Next.js app with create-next-app it will already initialize git repository, you do not have to run git init
