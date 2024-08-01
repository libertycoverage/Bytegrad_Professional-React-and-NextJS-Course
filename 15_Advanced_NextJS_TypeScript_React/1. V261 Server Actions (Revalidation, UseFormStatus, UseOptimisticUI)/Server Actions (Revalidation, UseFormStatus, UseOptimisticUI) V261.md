## V261 Server Actions (Revalidation, UseFormStatus, UseOptimisticUI)
Description: Learn how to use Server Actions in Next.js.

also here: 
Next.js Server Actions (revalidatePath, useFormStatus & useOptimistic)
https://www.youtube.com/watch?v=RadgkoJrhu0



### Fetching data in server components

Let's talk about server actions and how they're going to replace API routes

We'll walk through a simple example here so we are on the to-do's page and these days in Next.js we can have this server component and in these server components we can mark them as async and then in there we can use awaits and we can actually fetch data

page.tsx
```tsx
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form className="flex flex-col w-[300px] my-16">
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


We are using Prisma here as ORM for a database, we don't need to know the inner workings of Prisma in this example 

We have 2 to-dos in the database, they have an ID and they also have content 

In this line here in a React component without using useEffect we are just fetching this data

page.tsx fragment
```tsx
  const todos = await prisma.todo.findMany();
```


on the page we have an `h1`, a form

then we want to output it right here, so here we have that list and we are mapping over those `todos`. We are taking each `todo` and we have an `li` we are using the `id` for the `key` and then we are using the `content` for the actual text that we see. 

page.tsx fragment
```tsx
    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
```


### Traditional data mutations

That's what we can do in server components these days right so pretty cool, but there's one thing even cooler, which is that we can also mutate data, meaning we can add a to-do with Server Actions. How would that work?  

In the past if we would type a to-do in the form and we would want to add this to our list,
in the past what we have to do in React, here we have our form, we have that input and then we have this "Add" button. 

In the past we had to do some kind of `onClick` for button or for the form we could have on `onSubmit`, we could just call that `handleSubmit`, then we could deal with that above, then `event.preventDefault();`. Further we would get the value from the from the input. If that's a controlled input we had to use useState and then we would use the state value. We could of course also use `event.target`. We would do some kind of fetch call, we would do something like API todos, `method: "POST"`, `body: JSON.stringify`, `headers`. We would do something like this.

page.tsx
```tsx
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = event.target.content.value;

    fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ content }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form className="flex flex-col w-[300px] my-16"
      onSubmit={handleSubmit} // this also
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


We have some kind of API route, then on the backend we needed to make sure that we actually had that API route, and then we had to hook that up with some controller, some actual function that we want to run. 

Maybe if we were using Next.js, we could do that with the API folder and then we could create some route handler.

Or maybe we were using `axios.post`, same story, we still had that API route that we had to create and wire up with the actual code that we want to run 

page.tsx
```tsx
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const content = event.target.content.value;

    axios.post("/api/todos", { content });
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form className="flex flex-col w-[300px] my-16"
      onSubmit={handleSubmit} // this also
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


Now we're getting an error here by the way because we are trying to add this `handleSubmit` to this `form` here but we're in a server component (Next.js) and it's telling us we cannot add these event handlers because server components are meant to be non-interactive. We would have to convert this to a client component.

We don't need to do all of this, we don't need to convert this to a client component, we don't need to create this whole API route and wire it up with the with the function that we actually want to run, when this form gets submitted. 

We can use Server Actions. 


-----

### Preparation in `next.config.js` to enable Server Actions

We need to mark it in `next.config.js` file we need to opt into Server Actions,
we need to say `experimental: { serverActions: true, }`, as of recording (early summer 2023) this is still necessary.  

It is good to notice that whenever we change`next.config.js` file while dev server is working that will cause development server to crash.

We need to manually restart it `$ npm run dev` 

`next.config.js`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "some1.domain",
      },
      {
        protocol: "https",
        hostname: "some2.domain",
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```


-----

### Server actions for mutations

These days what we can do if we now click "Add" button here and we want to add that to our database, 

what we can do is we can use the `action` attribute 

We are going to hear the word `action` more and more in the world of React and Next.js.

The idea here is that we want to "do something", an `action` is just a function that we want to run. Here we want to add a to do so we could call that `addTodo` and now we can create that function somewhere. Now in a server component we can actually just create it here. Just like that `handleSubmit` function we can also just write that here if we want.

page.tsx
```tsx
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form action={addTodo} //here
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


Github Copilot is suggesting us `const addTodo = async (event) => { }`, so Copilot is not completely up to date, Copilot has been trained on a lot of GitHub data so this is a very typical pattern, but these days we have to correct Copilot, here we're going to get is `formData` -  and using TypeScript it's going to be of type `FormData`

At the top of the function we have to use `"use server"` so this function will only run on the server.

Then if we want to grab the actual input here, we gave it this input a `name="content"`, that's already in the `formData`. We don't have to use `useState` or anything like that, or like `e.target`, we already get the `formData` right here, if we use this `action` attribute like this. 

This is already the Server Action, this function `addTodo` is going to be the Server Action. 

We can grab the input values like this `formData.get("content");`

We have grab the input values, but now typically, further we would send that to some API route 
not anymore 

we don't need to create this whole API route 

we can use this Prisma variable right here `prisma.todo.create`, this is how we can add something with Prisma 

Prisma doesn't really matter, it could be anything, maybe Mongoose for example 

Server Action is just a function that will only run on the server, and also typically will invalidate. 

page.tsx
```tsx
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection coul be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content,
      },
    });

    // here invalidate
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form action={addTodo} //here
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


We are getting a warning from TypeScript (red squiggly lines on Prisma create `content`),
because "Type`FormDataEntry | null` is not assignable to type string, type null is not assignable to type string".  

Basically what we need to do here for Prisma is we need to pass a string here, this `content` needs to be a string. TypeScript is telling us that this could also be `null` 

Here we know it's not going to be null because we put `required`in `input` field. TypeScript doesn't know that, it says it could technically be `null`. 

This `content` here we can write `content: content as string`, we can assert that this will always be a `string` 


page.tsx
```tsx
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection coul be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });

    // here invalidate
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form action={addTodo} //here
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


The form has been has been changed now to run this `addTodo` `action` when the form gets submitted

When we now try to submit something through the form, this action should get invoked, but we don't see anything happening 

### Revalidating data (Invalidation in Server Actions)

We haven't invalidated this as it's called. This action should now have been invoked. 

Code should have been run so we should have created some entry into our database, indeed that it is the case.

The database is correct now but now of course we need to make sure that the UI is also correct.

This UI is still working with these `todos` that were fetched when we first loaded the page, we need to invalidate this, as it's called.

We basically want to tell Next.js "this is invalid now, get the latest data". 

Basically we want to run this line of code again ->
`const todos = await prisma.todo.findMany();`

We can do that we can say revalidate this path `revalidatePath("/todos");`

page.tsx
```tsx
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection coul be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });

    // here invalidate
    revalidatePath("/todos");
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form action={addTodo} //here
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


We need to import that `import { revalidatePath } from "next/cache";`

We can tell Next.js this path that we are on `/todos`, which is where we were fetching (using Prisma), this is now invalid.

Right after we added `primsa.todo.create`, the current data is invalid, so it needs to be revalidated. It needs to be refetched.

Now now after like two seconds or so it also adds entries automatically when we try do to this using the form.

It is going to take 1 or 2 seconds before this `await primsa.todo.create` is finished, we're awaiting that here. It could take one or two seconds and then it gets to this revalidate path line, which will refetch the data here `const todos = await prisma.todo.findMany();`

First it's going to add it to the database, once it's in the database we revalidate the data, meaning it's going to find all of the entries in the database again `findMany()` . And it will it will just map over those `todos` again, over all of them.

If we refresh Prisma Studio or other tool, we will see that the database will be up to date.

Database up to date, UI is up to date and we haven't even created some `/endpoint` API.
How is this possible actually?



### Under the hood


It looks very strange because if someone is used to react, has been working on the frontend. 

Here we're sort of interacting with a database all of a sudden

page.tsx fragment
```tsx
await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });
```


This looks very strange but let's take a look at the dev tools so we can see that there is actually still communication between client and server but it's handled by Next.js. 

We are not manually creating an API route, behind the scenes Next.js sort of is doing that.


In dev tools we can go to go to network tab here we can see all the network requests, 

if we type something in the form and submit with the button, we can see there is a fetch call, there is something going from client to server 


If we look at payload tab for example we can see that there is some Form Data going from client to server. We can see "1_content", basically the name of our input field is `content` and we can see the actual value "test". There is also some "$ACTION ID", this is not done by us this is done by Next.js. 

There is some other stuff here, probably some identifier that Next.js uses under the hood to match up this server function or Server Action with what we're doing in this form.

We don't have to manually create these API routes anymore. Next.js does that for us automatically. 

### 2 Other Benefits

That's one of the benefits, we don't have to create these APIs anymore. 

Another benefit is that this will work even without JavaScript enabled. 

If the user turned off their JavaScript, or the JavaScript hasn't loaded yet or the JavaScript for whatever reason fails to load on the page, this will still work.

It's also called Progressive Enhancement

And it also means that the client-side bundle will be smaller, because you don't need a JavaScript so the JavaScript doesn't need to be included in that client-side bundle. 

Another benefit is here this `addTodo` function runs on the server so we can update our database and then immediately revalidate. 

page.tsx
```tsx
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection could be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });

    // here invalidate
    revalidatePath("/todos");
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form action={addTodo} //here
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


In the past on an API route we would update our database and then go to the client again and then the client had to make another network call to to get the latest data. 

Here (page.tsx) we're doing both of that in one network call. It will go from the client to the server, update the database, and then immediately revalidate the data here.



This is a pretty powerful combination, we can fetch data like this:

page.tsx fragment
```tsx
const todos = await prisma.todo.findMany();
```

and then we can update our data like this:

page.tsx fragment
```tsx
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection could be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });
```

**Server Mutations** as it's called. 

Together, we could even make the argument that this is going to replace a Tanstack React Query or maybe SWR in case you were using that.


### Server Action in client component


In practice what we also want to do is e.g. **reset the form** 

We also want to show like a loading indicator, because now if we click on ADD button in the form, we don't really get feedback that something is being submitted. 

Typically in the real world we do want to have some client-side interactivity in this case. 

We also want to validate the inputs from the user, here on the client for example (and on the server as well but also on the client).


Right so if we look at our components, `TodosPage()` is a server component, this `h1` can stay on the server, but then with the `form`, typically we want to do some validation before we actually invoke the Server Action, we want to maybe also reset the form.

We want to use some client-side interactivity so let's refactor this form into its own component and mark that as a client component. 



page.tsx
```tsx
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection could be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });

    // here invalidate
    revalidatePath("/todos");
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <form action={addTodo} //here
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```

`/components/form.tsx`
```tsx
"use client";

import React from 'react';

export default function Form() {
  return (
    <form action={addTodo} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>
  )

}
```


page.tsx
```tsx
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";
import Form from "@/components/form";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection could be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });

    // here invalidate
    revalidatePath("/todos");
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    <Form />

    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
    </main>
  );
}
```


We want to have some interactivity here on the client, like reset form etc.

We're going to make `Form()` a client component, mark this as `"use client";` 

Now it's interesting, because now of course we need to add this `addTodo` Server Action, but now `Form()` is a client component.

`TodosPage()` is a server component, so in a server component we can have this function `addTodo` right here in the server component. We can mark it as a `"user server";`. 

We cannot do that in a client component. 
If we want to use a Server Action like this in a client component, we need to put it somewhere else and then import it in here (??form.tsx which is a client component??, that utilizes `addTodo` Server Action???)

What we are going to have in a project is we are going to have some `/actions/` folder, here we are going to have some actions and maybe we can even create a file per action. 

For now for simplicity let's just create one file `/actions/actions.ts`
We are going to paste our Server Action. 

`/actions/actions.ts`
```ts
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

const addTodo = async (formData: FormData) => { 
  "use server";

   const content = formData.get("content");
  // api connection could be done here, but does not have to

  await primsa.todo.create({
    data:  {
      content: content as string, // assert
    },
  });

  // here invalidate
  revalidatePath("/todos");
};
```

Here Server Action actually needs access to our Prisma variable, we can just import that, revalidate path as well. 

To recap here our `TodosPage()` is still a server component, it can still fetch data and map over that.

But now we have a `<Form />` component which is a client component.

In this client component (`Form()`) now we can import that Action with a separate file.

`/components/form.tsx`
```tsx
"use client";

import React from 'react';

export default function Form() {
  return (
    <form action={addTodo} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>
  )

}
```

What we can do is instead of having this `"use server";` for every action what we need to do is we need to put `"use server";` at the top of the file 

`/actions/actions.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => { 
  //"use server";

   const content = formData.get("content");
  // api connection could be done here, but does not have to

  await primsa.todo.create({
    data:  {
      content: content as string, // assert
    },
  });

  // here invalidate
  revalidatePath("/todos");
};
```

Every function that we `export` from here will be a Server Action. 

Now if we `export` it like this we have `"use server";`at the top, now we can import `addTodo` like this (in the `Form()`), and `Form()` is a client component. 

So we can invoke a Server Action from a client component. 

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React from 'react';

export default function Form() {
  return (
    <form action={addTodo} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>
  )

}
```


Now if we save, we can see the errors are gone, so this should work again. 

We have successfully refactored this to a client's component this form.


### Reset form

Because what we want to do in the real world is we want to give some feedback while form is being submitted 

We want to reset the form, we maybe want to do some validation here on the client. 

So typically we are not going to invoke our Server Action (here `addTodo`) like this .

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React from 'react';

export default function Form() {
  return (
    <form action={addTodo} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>
  )

}
```


What we are going to do is typically we are going to have a function in here actually (in this place`action={addTodo}`) and we saw that already, we were already depending on that `formData`, we already got that here

`/actions/actions.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => { 
  //"use server";

   const content = formData.get("content");
  // api connection could be done here, but does not have to

  await primsa.todo.create({
    data:  {
      content: content as string, // assert
    },
  });

  // here invalidate
  revalidatePath("/todos");
};
```

So we get formed.

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React from 'react';

export default function Form() {
  return (
    <form action={formData => {
      addTodo(formData);
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>
  )

}
```


When we write a function, we can now in Next.js applications, we can write a function here for the `action` attribute, this doesn't work outside of Next.js.

Here we immediately get form data like this `action={ formData => { } }`

In HTML we pass like a URL to `action` and the browser would submit form data to that URL. 

Next.js and also Remix they're trying to replicate that.

So here what we can pass as a function, we immediately get access to the `formData` and then in here we can still call that Server Action `addTodo`. 

Let's just pass the `formData` to that Server Action, we want to make this an asynchronous function so `async` and then we're going to `await` Server Action 

What we can do is before we invoke the Server Action, we may just want to reset the form 

So to reset the form (it's not a controlled component here), so what we can do instead, is we can use `useRef` so we will quickly create a `ref` for the form, equals `useRef` and this is going to be for TypeScript - this will be a `HTMLFormElement`. We add `ref` to the `form` - `ref={ref}`   

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React , { useRef } from 'react';

export default function Form() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form ref={ref} action={async formData => {
      ref.current?.reset();
      // input validation could be here

      await addTodo(formData);
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
      </button>
    </form>
  )

}
```


Now what we can do is before we invoke the Server Action here on the client (`await addTodo(formData);`) we can say `ref.current.reset();` - reset this input. 

We're going to get a warning from TypeScript (red squiggly lines on `ref.current`), because `ref.current` could be `null`. We actually initialize it as `(null);`, so call reset or `null` - so we want to have a question mark here `ref.current?.reset();`, optional chaining, we get rid of that error here.

After the reset we're going to invoke the Server Action `await addTodo(formData);`

A bit complicated here.
It it's already structured a little bit better. 


All the code here will be on the client here, because we have been using `"use client";` 

So if we add `//input validation` and other things, first run in the browser.

And only when we call this function ` await addTodo(formData);` will this `form` actually get submitted to this function here (`addTodo` in `actions.ts`) and this `addTodo` in `actions.ts` will run on the server. 


We can write test in the form, press "Add" button, immediately form gets clears and after a couple seconds it indeed gets added to list. Everything still works, we now also have some client-side interactivity (`ref.current?.reset();`) or some client-side features so we can make this a little bit more like real world scenario.

We can do other things in here as well. 


### Downside of client components

By the way the downside of using a Server Action in a client component is that we **lose a lot of that Progressive Enhancement**.

That's one of the downsides of using it like this.

In the real world we don't really have a choice, we do need that client-sized validation sometimes, we want to reset things. 

In the vast majority of cases we are going to have that Server Action being invoked in a client component. 


### useFormStatus (pending state)

Now typically we also want to show like a pending state so when while a form is being submitted, it can show something like "adding to-do...". 

We actually have a very cool hook that we also get in conjunction with the concept of Server Actions, it will be useful for this. 

Unfortunately to make that work we do need to make that a client component of the form. 

The form needs to be an ancestor essentially.

What we're going to do is we're going to refactor this `button` into its own component. 

We are quickly going to create a button component.

`/components/button.tsx`
```tsx
import React from "react";

export default function Button() {
  return (
    <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
        Add
    </button>
  )
}
```


`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React , { useRef } from 'react';
import Button from "./button";

export default function Form() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form ref={ref} action={async formData => {
      ref.current?.reset();
      // input validation could be here

      await addTodo(formData);
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <Button />
    </form>
  )

}
```

Now it works the exact same, looks the exact same, but now this `Button` is its own component.

The hook that we can use here, `useFormStatus` and this is still experimental `experimental_useFormStatus()`, here if we import this it's going to be this with this experimental underscore

If we do not want to refer to it like that, we can alias this.

 `/components/button.tsx`
```tsx
import React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function Button() {
  const { pending } = useFormStatus();


  return (
    <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
    {
      pending ? "Adding todo..." : "Add"
    }
        Add
    </button>
  )
}
```
 
 
Let's actually see what we get `const {} = useFormStatus();`, we can destructure these four things: `action, data, method, pending`. 
We can say we want to have `action` - this will actually show us the the function, the actual `action` (Server Action) that's connected to that form,
`data` - the form data,
`method`, 
what we want most time is the `pending` value

When this form is being submitted, it will show us that it's pending and so we can use that variable to display something in case it's pending.

Here we have pending, well if it's pending we want to say `"Adding todo..."`, otherwise it should be `"Add"` 

Now if we try uh add something with the form, we can see the button immediately changes to adding to do. 

There's a bit of a lag there at the end, not sure why that is actually, some of this is still experimental, so it doesn't work perfectly yet but this is what we want essentially. 

This will not work if we do it in `Form()` which is a server component, the form needs to be like an ancestor to the `<Button />` component itself.

This is most of what we want with forms, so we have like a loading state, we have some client-site validation, resetting `ref.current?.reset();` the form.


### Error handling

There's one other thing **in the real world** that we also want which is error handling. 

What if this database call in our Server Action, what if that goes wrong, this is running on the server. How do we make sure that if it goes wrong that we can output some message to the client, to the user? 

`/actions/actions.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => { 
  //"use server";

   const content = formData.get("content");
  // api connection could be done here, but does not have to

  await primsa.todo.create({
    data:  {
      content: content as string, // assert
    },
  });

  // here invalidate
  revalidatePath("/todos");
};
```

This is its own separate topic.

To give us a quick sneak peek we can just wrap this and `try catch`.

`/actions/actions.ts``
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => { 
  //"use server";

   const content = formData.get("content");
  // api connection could be done here, but does not have to

  try {
    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });
  } catch (e) {
    return {
      error: e,
    }
  }
  
  // here invalidate
  revalidatePath("/todos");
};
```

We can try, we can attempt, to update our database. If this doesn't work and some error is thrown, we can catch the error. 

What we can do, we can simply return that to the client, we can just return let's say an object with `error` that's going to be this `e`. 

We can just return something in this function and that's what automatically gets sent back to the client. 

Let's see where we invoke this Server Action in the `Form()`, where we invoke the Server Action `await addTodo(formData);`, now we may get back an object with error. We can immediately destructure that. 

Right here we can just immediately get back an error and if there is an error `if (error) {`, we can just output alerts or maybe a toast message, but here we'll say `error.message`.

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React , { useRef } from 'react';
import Button from "./button";

export default function Form() {
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form ref={ref} action={async formData => {
      ref.current?.reset();
      // input validation could be here

      const { error } = await addTodo(formData); // we destructure an error
      if (error){
       alert(error.message);
      }
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <Button />
    </form>
  )

}
```


We would just catch the error and just return something to the client, just like any other function, destructure it like that, and we can check if there is an error, we can alert or do a toast message.

It's a bigger topic. 

That's just an example of another like real world element that we do need. 

We do need to be able to deal with errors. 


### useOptimistic (optimistic UI)

There's another very cool hook with this and this will also be the future of of UI, so we need to know how it works and it's called useOptimistic.

These todos right now they are always fetched, these todos are always coming from the database, adding a todo most of the time this will be successful. 

We might as well just immediately add this using form to the UI, we don't want to wait those two or three seconds, while has been added to the database and then it has been fetche again. 

Ideally we can just immediately add this in the UI and if for whatever reason something went wrong we just referred, we remove it again, but most of the time it's going to work. 

This is called **optimistic UI** 

To make that work we're going to add this list 

page.tsx fragment
```tsx
    <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
```

also here to that to the form, those need to be in the same component, let's just add that there.

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React from 'react';
import Button from "./button";

export default function Form() {
  const ref = useRef<HTMLFormElement>(null);

  return (
  <>
    <form ref={ref} action={async formData => {
      ref.current?.reset();
      // input validation could be here

      const { error } = await addTodo(formData); // we destructure an error
      if (error){
       alert(error.message);
      }
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <Button />
    </form>
        <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
  </ >  
  );

}
```

To return one thing, we need to wrap this in a React fragment, we don't use `div`, no reason
to pollute the HTML for no good reason.

There is an error thrown by development server, it says `todos` is not defined, so here to this `form.tsx`, 

Now the form name is not really a good name for this `Form()` component anymore, we can rename this to `todos-component.tsx`

`todos-component` import this properly in `page.tsx`

page.tsx
```tsx
import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";
// import Form from "@/components/form";
import TodosComponent from "@/components/todos-component";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // const addTodo = async (event) => { } // Copilot suggestion wrong /old
  const addTodo = async (formData: FormData) => { 
    "use server";

    const content = formData.get("content");
    // api connection could be done here, but does not have to

    await primsa.todo.create({
      data:  {
        content: content as string, // assert
      },
    });

    // here invalidate
    revalidatePath("/todos");
  }
  };

  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
    <h1 className="text-2xl font-bold">Todos Page</h1>

    
    {/* <Form /> */}
    <TodosComponent todos={todos}/>
    
    </main>
  );
}
```


`/components/todos-component.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React , { useRef } from 'react';
import Button from "./button";

type Todo = {
  id: number;
  content: string;
}

type TodosComponentProps = {
  todos: Todo[];
}

export default function TodosComponent({ todos }: TodosComponentProps) {
  const ref = useRef<HTMLFormElement>(null);

  return (
  <>
    <form ref={ref} action={async formData => {
      ref.current?.reset();
      // input validation could be here

      const { error } = await addTodo(formData); // we destructure an error
      if (error){
       alert(error.message);
      }
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <Button />
    </form>
        <ul className="list-disc">
      {todos.map((todo) => (
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
  </>  
  );

}
```

A bit of refactoring, that's the real world.

TodosComponent is a client component. Now here we also have this list where we're mapping over all the `todos`, we need to pass `todos` from the server to the client, we can just do that with `props`.

Now this TodosComponent will take in (accept) `todos`, we are using TypeScript, so let's type this `TodosComponentProps`, we are using `type`, we should not use `interface` just use `type` , `TodosComponentProps` that's actually going to be an array of `Todo` type

Props themselves there are objects.

What we have now is we can we get these `todos` now so we can map over them, they're fetched on the page, we're mapping over that in `todos-component.tsx` now.

#### Optimistic UI

While we test the form now, we we can observe that it takes some time before it's actually displayed in the UI, and in the real world, a really nice UI pattern is when we are optimistic so we immediately want to show this, we immediately want to add that thing from the `form` to the list.

We can do that with another really cool hook that will also work really nice with in conjunction with these Server Actions 

This is all connected to Server Actions.


The hook is `useOptimistic`, this is also experimental at the time of recording (07.2023), it's going to have this ugly name  `experimental_useOptimistic`, so alias this, as then we can just use it like that  `useOptimistic();`

Okay we need to pass two things in here, 
- so the initial `todos`, 
- the second it's going to be a function*, it's gonna look a little bit complicated.

#### Reducer Pattern

This function* will give us the the `state`- the current state, and then also the `newTodo` that we will pass. 

This function is called the **reducer pattern**, maybe you've seen this before, it is in Redux for example as well.

What we simply want to do is we take the `state`, we just spread it in a new array , and then we just want to add the `newTodo` in that array as well. `newTodo` is of type `Todo` 

`/components/todos-component.tsx``
```tsx
"use client";

import { addTodo } from "@/actions/actions"; 
import React, { experimental_useOptimistic, useRef } from 'react';
import Button from "./button";

type Todo = {
  id: number;
  content: string;
}

type TodosComponentProps = {
  todos: Todo[];
}

export default function TodosComponent({ todos }: TodosComponentProps) {
  const ref = useRef<HTMLFormElement>(null);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(todos, (state, newTodo: Todo) => {
    return [...state, newTodo];
  });

  return (
  <>
    <form ref={ref} action={async formData => {
      ref.current?.reset();
      // input validation could be here

      addOptimisticTodo({
        id: Math.random(),
        content: formData.get("content") as string,
      })

      const { error } = await addTodo(formData); // we destructure an error
      if (error){
       alert(error.message);
      }
    }} 
    className="flex flex-col w-[300px] my-16"
       
    >
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
      />
      <Button />
    </form>
        <ul className="list-disc">
        {/* {todos.map((todo) => ( */}  
        {optimisticTodos.map((todo) => ( // added
        <li key={todo.id}>{todo.content}</li>
      ))}
    </ul>
  </>  
  );

}
```


What we get here is two things, we get the optimistic version of other todos `optimisticTodos` and then also add optimistic todo `addOptimisticTodo`. 

Okay syntax here is a bit ugly.

So now this is a bunch of code but basically what we get with this `useOptimistic` is now instead of using the `todos`, we want to have a more optimistic version of that. 

That's what we get here with optimistic todo.

Now we don't want to map over the traditional `todos`, we want to map over the `optimisticTodos`. 

Now if we we look at the page, we can see nothing has changed, but now what we want to do is before we actually add it to our database, and before we have to wait those 2-3 seconds we can already optimistically add it to the list here, and that's what we can do with `addOptimisticTodo`;

If we call `addOptimisticTodo` on todo as an object, and has an `id` and we'll just use a `Math.random` id here, and then the content is going to be the same as before (from the input), and then we will assert that it's going to be a string. 

Now before we we make that round trip to the server, we're already going to assume that it's going to be successful, so it will be added here. At least that's the idea here.

Now if we try adding new entry with the form, we will write "test" in the form and now we are going to click button "Add" here, we can see it immediately gets added in todo list 

If we check the database it should still be added there as well, the database it has also been correct.

Now we don't want to have that button anymore showing "the pending state" like that.

Get some kind of loading state when it already has done an update to UI using optimistic UI.

In this case we can just comment this out.

One reason to use pending here as well is to disable this button totally so so here we want to disable the button when it's pending state.

We don't want to have this pending state like that anymore `{ pending ? "Adding todo..." : "Add" }`. We do still want to use `pending` for `disabled` here.

 `/components/button.tsx`
```tsx
import React from "react";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function Button() {
  const { pending } = useFormStatus();


  return (
    <button disabled={pending} className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">
    {/* {
      pending ? "Adding todo..." : "Add"
    }*/}
        Add
    </button>
  )
}
```


This is really nice UI pattern, it feels very snappy to the user if we have this in our apps. 

#### Revert changes on optimistic UI

Now what happens, because it is very optimistic, now but what happens if if something goes wrong on the server and we don't actually save it to the server, then it should be removed again, it should be reverted.

One of the benefits of using it in conjunction with Server Actions, because if we go to our Server Action now it's in this `actions.ts` file.

`/actions/actions.ts``
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => { 
  //"use server";

   const content = formData.get("content");
  // api connection could be done here, but does not have to

  try {
    await primsa.todo.create({
      data:  {
        //content: content as string, // assert // this is proper code
        content: content2 as string, // simulation if something goes wrong
      },
    });
  } catch (e) {
    return {
      error: e,
    }
  }
  
  // here invalidate
  revalidatePath("/todos");
};
```


Here if something goes wrong here if, we just wrap this and try catch. 

But let's say something goes wrong here, we are using `formData` `content`, but let's we are just making a typo (typing error), we get an issue with TypeScript, we are just going to ignore that, just an example of something going wrong in this `addTodo` Server Action. 

Now we are optimistic and we think it's going to work alright, but now in the Action it's going to be wrong, it's not going to be properly added to the database - `content2` does not exist so it will not work, but on the UI it's still going to be shown. 

We need to make sure that when it fails that it's actually removed again from the UI.

Let's try that again, we fill out the the form, we are going to click "Add" button here.

Initially it's added now we can see and we can see it automatically is removed from the UI 


**We can see now this is super powerful with these Server Actions, not only we do not have to create these API routes but we also get these hooks, these `addOptimistic` hook, `useFormStatus` for the pending state.** 

### formAction

We can use these Server Actions with this `action` attribute on the form, that's what we've done, but we could also do this with some other element in the form.

old, non-working:
https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#action

here it is, last version with this exact URL ->
https://web.archive.org/web/20230814235733/https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

form.js example
```js
export default function Form() {
  async function handleSubmit() {
    'use server'
    // ...
  }
 
  async function submitImage() {
    'use server'
    // ...
  }
 
  return (
    <form action={handleSubmit}>
      <input type="text" name="name" />
      <input type="image" formAction={submitImage} />
      <button type="submit">Submit</button>
    </form>
  )
}
```


new, working documentation:
https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations

We can also use `formAction`, not `action` but `formAction` on the button for example or even an `input`.

Here they show an example, we could have an image upload, we can have a Server Action that will run when that occurs. 

We don't need to create a whole API route (`/api/uploadimage?` API).  

Next.js will handle that for us under the hood.

We can use this specific Server Action (e.g. `submitImage`) only to this input, 
so this is mostly useful if we want to have different Server Actions for different inputs, 
or we have two buttons, one server action for one button and then another one for the other button.

### Server Actions outside form

Now we can actually also invoke Server Actions outside forms and they recommend to use this `useTransition` hook but we don't seem to need this, so we can even call this without the `useTransition` Hook from React.

`app/components/example-client-component.js`
```js
'use client'
 
import { useTransition } from 'react'
import { addItem } from '../actions'
 
function ExampleClientComponent({ id }) {
  let [isPending, startTransition] = useTransition()
 
  return (
    <button onClick={() => startTransition(() => addItem(id))}>
      Add To Cart
    </button>
  )
}
```

This looks very complicated, we have this `startTransition`.  This `useTransition` Hook from React is actually used to deprioritize State updates, so it's a bit confusing that now it's being used in conjunction with these Server Actions.

But from from looking around, we don't need to use this hook, there's a benefit probably that comes with this hook.

But this will completely disable the out of the box Progressive Enhancement, but then we can use it outside forms.


Here they also mention custom invocation without that `startTransition`, so without the use of the `useTransition` hook it's also still possible.

If we are really interested in that it's already pretty advanced, so then it is recommended to go through the docs. 

#### [Custom invocation without `startTransition`](https://web.archive.org/web/20230718042637/https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#custom-invocation-without-starttransition)

If you aren't doing [Server Mutations](https://web.archive.org/web/20230718042637/https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions#server-mutations), you can directly pass the function as a prop like any other function.
