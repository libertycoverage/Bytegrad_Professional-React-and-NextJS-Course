## V EXTRA2 Connected to V261 V262 Validate Data With Zod in Server Actions Next.js (Client-Side + Server-Side)

How to do validation
->
Validate Data With Zod in Server Actions Next.js (Client-Side + Server-Side)
https://www.youtube.com/watch?v=tLhcyBfljYo



In this video we're going to see how we can validate data when we work with Server Actions in Next.js.

This example is using a Server Action and if we make a mistake (cause in code) and we fill in the form and click on "Add" button, we're going to have a toast message that will show us a Zod error. 

We're going to use Zod to validate the data. 

Let's see how we can do that. We just have a simple `TodosPage()`, it's fetching the todos from the database. We have an `h1`, we have the `form`, we have the list where we map over all the `todos`. Form is using a Server Action called `addTodo`, defined in `add-todo-action.ts`.

page.tsx
```tsx
import { addTodo } from "@/actions/add-todo-action";
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();
  
  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
      <h1 className="text-2xl font-bold">Todos Page</h1>

      <form action={addTodo} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
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

Now since `TodosPage()` is a server component, we could also define Server Action within `TodosPage()` component, but for organizational purposes `addTodo` Server Action has been put it in its own file with `"use server";` at the top. 

`/actions/add-todo-action.ts`
```ts
"use server";

import { prisma }. from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  //return {
  //  success: true,
  //};
  revalidatePath("/todos");
};
```

`addTodo` function will just take the `content` of what we put in the form, then it will attempt to insert that in a database, and then it will revalidate our path. 

How can we use Zod here to make it all a bit safer?

Let's say we want to validate the data both on the client-side as well on the server-side

`/actions/add-todo-action.ts` is all server-side but on the client (`form`), before we actually send it to the server, before we invoke the Server Action (`addTodo`), we also want to validate the data. 

Right now what we have is only a Server Action (`addTodo`) that will immediately get invoked when we submit the form. 

But now we want some client-side interactivity, we're going to have to refactor this form into a client component, because we cannot have client-side interactivity in a server component. 

In the `/app/components/` folder we are going to create a component called `form.tsx` and we will just put the form in there. 

This is still a server component and now we're going to make this `Form` a client component, use `"use client";` directive at the top. 

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {
  return (
      <form action={addTodo} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


Now `TodosPage()` can use `<Form />` component. 

page.tsx
```tsx
//import { addTodo } from "@/actions/add-todo-action";
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();
  
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


Now we've refactored `Form()` into a client component, we can add client-side interactivity here and the way to do that with Server Actions is to have a Client Action

- We have Server Actions, they will only run on the server,
- We can also have Client Actions, basically just a function that we give to `action` that will run on the client. 

We can actually define Client Action, name it `clientAction` inside the `Form()` client component. `clientAction` is going to be an async function, that will take in `formData`.

Inside the Client Action we can actually invoke the Server Action.

We are going to remove `addTodo` from here `form action={addTodo}`

`addTodo()` is our Server Action, we can just invoke that inside `clientAction`

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {
  const clientAction = async (formData) => {
    // reset form
    // client-side validation
    await addTodo();
    // output error message 
    // also be optimistic with the UI
  };

  return (
      <form action={addTodo} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


Inside a Client Action we can also have client-side interactivity, we can e.g. reset the form, or client-side validation.

What we're going to do here is client-side validation. 

What we're also going to do here, is after we invoke the Server Action depending on the result of that `await addTodo();`, we may want to output an error message to the user. 

We can do other things here as well, like be optimistic with the UI for example. 

It's actually a really cool hook `useOptimistic`. 


### Client-side validation & output error message

These are the two things that we're going to do now here, client-side validation and output error message .
```tsx
export default function Form() {
  const clientAction = async (formData) => {
    // client-side validation
    // output error message 
```

 
We are using TypeScript here, let's type this `formData` as `formData`

`clientAction` is what we can pass to the `action` attribute.

Client Actions and Server Actions: 
- client-side validation, output error message, this code will run on the client
- and then the Server Action (`addTodo()`) when we call that, all of `add-todo-action` code will run on the server

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {
  const clientAction = async (formData: formData) => {
    // reset form
    // client-side validation // <- we are implementing this now
    await addTodo();
    // output error message   // <- we are implementing this now
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


We're going to use Zod to make a client-side validation.

Now before we actually do the client-side validation with Zod, we're just going to construct a `newTodo` object that we can then validate. 

We can say here is `const newTodo` and these todo objects in our example app are objects with a `content` property and we can get that `content` from the `form`, when we submit the form we have `input` and a `button` 

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"),
    }
    // reset form
    // client-side validation // <- we are implementing this now
    await addTodo();
    // output error message   // <- we are implementing this now
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```

The only thing we actually have to pay attention to is `input` here and it has a name of content - `name="content"` - that's basically the text in the input field.

We can just grab that with `formData.get("content")`

If we pass a function here to `action` - `<form action={clientAction}` we automatically get `formData` from Next.js. Then we can use `.get` to get the actual value of that input.

And these objects optionally have an `id`, it's going to be a number. Typically these IDs get created when we add them to the database.

That will only happen here we actually insert it with Prisma, it will actually create an `id`

`/actions/add-todo-action.ts` fragment
```tsx
  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });
```

Here when we just grab the information from the form `const newTodo = { //id: 341, content: formData.get("content"),}` it obviously doesn't have an `id` yet, because it hasn't been inserted in a database yet, so we're going to make that optional. Here we're not going to have an `id` because we don't have that when we first insert it into the database (database itself assign an `id`). 

But later later when we update the `todo`,  we do need an `id`, we're going to make it optional. 


Then we want to validate this with Zod

We are going to install Zod  `$ npm install zod`. We need to import Zod.

With Zod we want to create a schema so we will just define that up here for now.


`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";

const TodoSchema = {
  content: z.string().trim().min(1).max(100),
}

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"),
    }
    // reset form
    // client-side validation // <- we are implementing this now
    await addTodo();
    // output error message   // <- we are implementing this now
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```



Here `content: formData.get("content"),` we were grabbing the actual data from the form, now here `const TodoSchema = {` we are going to describe how the to-do should look like. 

We can say it's an object so we can say `z.object` and in the object we will have a `content` property and optionally that `id` property. 

Let's start with `content` here ,so we can just say this `content` property should be a `string()` so we say `z.string()`, everything else we want to add here, so here we can say it should be trimmed `trim()` - remove the white space; It should be at least one character `min(1)` but at most 100 characters `max(100)`

This is a simple example of how Zod works.
`content: z.string().trim().min(1).max(100),`

What we can then also do, is we can provide custom error messages, 

so if the minimum is is not at least one `min(1)` we can say that "Todo content must not be empty" or "-must be at least 1 character long".

If the person goes over the maximum `max(100)` we may want to output a different message. 

This is our schema now basically the blueprint for to-dos, this is what the to-do should look like.

That's a `content` property. 

We also have an `id` property optionally, we can say `z` that's going to be a `number` and it's going to be `optional` - `id: z.number().optional(),`

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"),
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      // output error message
      return;
    }
	
    await addTodo();
    // output error message   // <- we are implementing this now
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


Now we have our schema `TodoSchema`, now we can use this to validate that `newTodo` 

We can say `TodoSchema.parse(newTodo)`, parse this `newTodo` object. 

Now if we do it like this `TodoSchema.parse(newTodo)` and there is actually a problem here for example maybe we forget to write the content property `content: formData.get("content"),` it will give us an error, it will actually throw an error. 

So we would have to wrap it and `try catch` and there's nothing wrong with that, but in practice people do seem to prefer the other way which is `safeParse()` - `TodoSchema.safeParse(newTodo)` and here what happens is if there is an error, there will not be an error thrown. We just got a result here and in that `result` variable we can check if there actually it was an error. 

If the `success` was not true we can output an error message. Here we can already output an error message on the client.

`/components/form.tsx` fragment
```tsx
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      // output error message
      return;
    }
```

,

Here we're also going to output an error message if something went wrong on the server.

`/components/form.tsx` fragment
```tsx
    await addTodo();
    // output error message   // <- we are implementing this now
```

### Simulating the error

alright so let's actually see what we get if we actually do make this mistake of not adding the `content` to the object (we comment this out)

`/components/form.tsx` fragment causing error
```tsx
    const newTodo = {
      // content: formData.get("content"), // commented out to cause an error
    }
```

We are going to inspect using dev tools in the web browser, we can console log the `result`. Now what we have is a `newTodo` which is actually just an empty object here

`/components/form.tsx` with `//commented out to cause an error<-`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      //content: formData.get("content"), //commented out to cause an error<-
      id: "blabla",       // this is causing an error, id number not string<-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      console.log(result.error.issues);
      // output error message
      return;
    }
	
    // await addTodo(); //not finished, commented out to test an error     <-
    // output error message   // <- we are implementing this now
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


But we have just told Zod that this object should have a `content` property and optionally an `id`.

`id` can be left off without problems, but `content` should be there, we didn't say that this was optional, it has to be there. Now we have this `newTodo` which is empty so we're going to use `TodoSchema.safeParse` on that `newTodo`. This `result` should not be successful, we should be able to see some error `console.log(result);`.

Now we have this `newTodo` with an object that doesn't have the `content` property (simulation of the first error), and let's simulate the second error, let's say it also has an `id` property but it's a string (it should be a number).

Now we value basically have two mistakes, we don't have `content` and this `id` is of the wrong type because `id` should be a number if it is there - `z.number().optional(),`.

We are actually going to comment this out `// await addTodo();` because it gives us a red squiggly line (it is not finished yet), let's deal with that later.


### Errors in `console.log` when we simulate error for Zod

Right so now with Zod, what's going to happen, is we're going to parse that `newTodo`, we're going to get some `result`, the `result` will not be successful now, and here `console.log(result);` we can access the error messages.

How we can access these error messages, so we have `result` of `error` and that's going to give us an `issue` per problem 

Here we have two problems, two errors, it's going to create an issue for each one of them. 



Let's see what happens when we use the form on the site and click "Add" button.



In console log we get an array here and this array has an object for each issue: 

```js
(2) [{...}, {...}]
0: 
  code: "invalid_type"
  expected: "number"
  message: "Expected number, received string"
  path: ['id'] ->
  received: "string"
1:
  code: "invalid_type"
  expected: "string"
  message: "Required"
  path: ['content'] ->
  received: "undefined"
```

The first one `0` is expected `number`, received `string`,  we can see `path` that has to do with the `id` 

and the second issue here is `Required` and it has to do with `content`, it received `undefined`

We can use the `message` in here and the `path` to create one big error message that we can just output as a toast on the page. 

Let's do that.

`/components/form.tsx` with `//commented out to cause an error<-`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      //content: formData.get("content"), //commented out to cause an error<-
      id: "blabla",       // this is causing an error, id number not string<-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      return;
    }
	
    // await addTodo(); //not finished, commented out to test an error     <-

    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


What we can do is we can just create a variable here for the `errorMessage`, it's going to be a `string`, initially empty. 

Then we're going to loop through all those errors, Copilot already helping us out, so we can say `result.error.issues` `forEach` `issue` we want to append that to the `errorMessage`

Copilot suggestions here is not exactly what we want -> 
```tsx
errorMessage += `${issue.message}\n`;
```


What this needs to be is the previous `errorMessage` + the message of that issue `issue.message` + a period and a space at the end `'. '`. 

```tsx
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.message + '. ';  
      });
```

This message `issue.message` will be for example required. 


We also want to know the field to what that message is connected to, and Zod gives us that here in `issue.path[0]` and it's going to be the first element of the array and it's going to be for example `content`. 

Then we can add like colon after that so let's see colon space `+ ': '`  and then the actual message.

 Then it's going to be `content` colon (`:`) `required` and then a period (`.`) and then we have the next error message. 

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      //content: formData.get("content"), //commented out to cause an error<-
      id: "blabla",       // this is causing an error, id number not string<-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      return;
    }
	
    // await addTodo(); //not finished, commented out to test an error     <-

    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


A little bit it's complicated to work with these Zod errors. 

Zod does help us out, so they do have two other methods that we can use, actually called `format` - `result.error.format()` to help us format the errors in an easier way to output something on the client.

This is helpful if we have a complicated form with nested objects. 

If we have a more simple form there's also a `flatten` - `result.error.flatten()` so if we have no nested objects, we can use this.

In our example we have a super simple form and diving into the details of Zod is not as necessary now.

We're just gonna do it like what we've been doing here.

```tsx
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';
      });           
```


### Toast message for Zod errors

This is the `errorMessage` now and we want to use a toast message let's say. 

We are going to use `react-hot-toast` for that.

Let's install that `$ npm install react-hot-toast`.

The first step is to determine where the toast message should be displayed on the page, so basically where should be top right. 

Typically we want to put that in the `layout.tsx` file. 

Let's go to the `layout.tsx`, this is the root component of our app. 

What we can do here is we can add that here in the `body` and and it's the `Toaster` component. Then we can specify the position. Top right is the most common one, most people are used to that. That's just a placeholder.

`layout.tsx`
```tsx
import './global.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
// here we need to imp[ort Toaster component

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}

        <Toaster position="top-right" />
      </body>
    </html>  
  )
}
```


Now we need to actually in invoke a toast message when we want to actually display a message. 

Now have the message constructed, now we actually want to output it.
We can use this `toast` function and we can say `.error` and then the message that we want to have displayed in that toast message `errorMessage`. 

We need to import this `import toast from "react-hot-toast";`

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";
import toast from "react-hot-toast";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      //content: formData.get("content"), //commented out to cause an error<-
      id: "blabla",       // this is causing an error, id number not string<-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      toast.error(errorMessage);
      return;
    }
	
    // await addTodo(); //not finished, commented out to test an error     <-

    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```



Now let's see what we get, now we still have this `newTodo` which has two mistakes:

```tsx
    const newTodo = {
      //content: formData.get("content"), //commented out to cause an error<-
      id: "blabla",       // this is causing an error, id number not string<-
    }
```


it doesn't have the `content` property because it has been commented out and it has an `id` property of the wrong type, it should be a `number` and it's a `string`.

Now it should fail to parse and so we should be able to construct an error message and display that to the user. 

No when we use the form on the page, we get a very nice toast message. 

```js
id: Expected number, received string. 
content: Required.
```

Now it's very clear to us what went wrong. 


### Fix the mistakes, `result.data` received from Zod

Now if we fix these mistakes, we uncomment `content: formData.get("content")` and maybe we don't have an `id` and `id` is optional so we can remove it `id: "blabla", `

Now this should work because now it adheres to this schema from Zod  (`TodoSchema`).

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";
import toast from "react-hot-toast";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"), // this is required
      //id: "blabla",  // error on purpose has been commented out
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      toast.error(errorMessage); 
      return;
    }

    console.log(result.data);
    //await addTodo(result.data); // <- we need to finish that
  
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


Now when we use the form on the page and click "Add" button we can see there is no error message and because here the `safeParse()` will show `result.success` is `true` so we don't go into the F block (function block) here `if (!result.success) { (...)`. 

Now of course we actually want to invoke the Server Action (`addTodo()`) we want to send the newTodo to the server.

So now what do we pass here `await addTodo();`? Do we actually use the variable `newTodo` we have just parsed that `newTodo` so it went successfully?

We could pass that, but Zod actually gives us the actual object in the `result` here as well and it has some benefits of using that ( `result.data`).

We can actually use `result.data` here `await addTodo(result.data);`

Now if we use the form on the page and click "Add" button, we can see we actually get our todo object in the `console.log` in the browser, it's showing us `content` text.

This is the same as just using `newTodo` right (`await addTodo(newTodo);`)? 

That is not entirely true, because if we add something here that's not in the schema `somethingElse: 'blahblah'` (`somethingElse` property that is not defined here), if we would use `newTodo` and send that to the server `await addTodo(newTodo)`, `somethingElse` will be on there. 

But if we use this `result.data` here we can see it console logs out only `content`. It doesn't allow this `somethingElse` else to go through as well. It basically strips that information if we didn't specify that for the schema (here `TodoSchema`). 

`result.data` also has a better TypeScript support so it's better to continue with the `data` that we get from Zod once we parsed it.

So that's what we're going to send to the server here `await addTodo(result.data);`

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";
import toast from "react-hot-toast";

const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"), // this is required
      //id: "blabla",    // error on purpose has been commented out
      somethingElse: 'blahbla'                               //just added <-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      toast.error(errorMessage); 
      return;
    }

    //console.log(result.data);
    await addTodo(result.data); // <- we need to finish that
  
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```


Now we're going to invoke the Server Action (`addTodo`), we're going to pass `result.data` - `await addTodo(result.data);` and now we get red squiggly line on `result.data` 


### Server-side validation

Now we have to go to our Server Action here `add-todo-action.ts`.

`/actions/add-todo-action.ts`
```ts
"use server";

import { prisma }. from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  //return {
  //  success: true,
  //};
  revalidatePath("/todos");
};
```

The Server Action right now is still expecting `formData` because that's how we had it defined before we refactor to a Client's Action. 

So now in the Server Action we're gonna get a `newTodo` on the input, we know what type it's going to be, but this is going to run on the server and typically we really shouldn't trust any information coming from the client. It seems that the best we type this as `unknown`

`/actions/add-todo-action.ts`
```ts
"use server";

import { prisma }. from "@/db/db";
import { revalidatePath } from "next/cache";

//export const addTodo = async (formData: FormData) => {
export const addTodo = async (newTodo: unknown) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  //return {
  //  success: true,
  //};
  revalidatePath("/todos");
};
```

We're going to assume this is `unknown` for now and we need to validate this properly before we can safely assume it is actually of that type todo.

Now we basically want to do server-side validation and it's going to be almost the same as here on the client so we want to have our schema `TodoSchema` be available in this file `add-todo-action.ts` as well.

So we might as well create a `/lib/` folder, library folder where we put our types and schemas. And typically we want to have a file where we centralize the types of the project, we might as well add our Zod schemas as well. 

Here we are going to copy this `TodoSchema`. 

`/lib/types.ts`
```ts
import { z } from "zod";

export const TodoSchema = z.object({
  id: z.number().optional(),
  content: z
    .string()
    .trim()
    .min(1, {
      message: "Todo content must be at least 1 character long.",
    })
    .max(100, {
      message: "Todo content must be at most 100 characters long.",
    }),
});

export type Todo = z.infer<typeof TodoSchema>;
```

Now one other handy thing you we do with Zod is if we want to have a regular TypeScript type from this, we can use `z.infer`, we can use that schema and infer that type.

We're actually not going to use it here, we don't need that here, but typically in a bigger application we do need that. 

Now we're exporting this `TodoSchema` and let's see where we are using this, `form.tsx` ( is our Client Action), we are going to import that `TodoSchema`. 


`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";
import toast from "react-hot-toast";
import { TodoSchema } from "@/lib/types.ts"; // added import

// const TodoSchema = z.object({ // etc. // removed

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"), // this is required
      //id: "blabla",    // error on purpose has been commented out
      somethingElse: 'blahbla'                               //just added <-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      toast.error(errorMessage); 
      return;
    }

    //console.log(result.data);
    await addTodo(result.data); // <- we need to finish that
  
    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```

Now we are invoking the Server Action `await addTodo(result.data);`.

Now we're going to go to our Server Action `addTodo` here `add-todo-action.ts` 

We can remove `const content = formData.get("content");`


`/actions/add-todo-action.ts`
```ts
"use server";

import { prisma }. from "@/db/db";
import { revalidatePath } from "next/cache";

//export const addTodo = async (formData: FormData) => {
export const addTodo = async (newTodo: unknown) => {
  //const content = formData.get("content"); //removed
  
  // here we will try to validate data on the server

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  //return {
  //  success: true,
  //};
  revalidatePath("/todos");
};
```

Before we try to attempt to insert it in a database we want to validate the data that we get here.

That is going to be the same as here on the client.

We might as well just copy this `const result = TodoSchema.safeParse(newTodo);` etc. from `/components/form.tsx`:

`/actions/add-todo-action.ts`
```tsx
"use server";

import { prisma }. from "@/db/db";
import { TodoSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";

//export const addTodo = async (formData: FormData) => {
export const addTodo = async (newTodo: unknown) => {
  //const content = formData.get("content"); //removed
  
  // here we will try to validate data on the server

  // server-side validation 
  const result = TodoSchema.safeParse(newTodo);
  if (!result.success) {
    let errorMessage = "";

    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
    }); 

    // output error message
    //toast.error(errorMessage); 
    //return;
    // here we want to return a plain JS object
    return {
      error: errorMessage,
    };
  }

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });


  revalidatePath("/todos");
};
```


Now it's a server-side validation, now we do need our `TodoSchema`, it's going to be from that file `/lib/types.ts` that we just created. 

Now here `/actions/add-todo-action.ts` we're running on the server, if we parse this `safeParse(newTodo)` and it's not successful, we go here and we want to construct an error message `let errorMessage = "";`

This `result.error.issues.forEach(` etc. will all stay the same.

We don't want (we cannot) to use toast messages, we're on the server. Now what we want to do here is we want to return a message to the client. Here we want to return a plain JavaScript object with just an `error` property and then `errorMessage` message that we construct here. 

Now in our Server Action, if we get something that does not adhere to that `TodoSchema`, we are going to return a message to the client (`{ error: errorMessage, }`), that's going to be an object with an `error` property. 

Now we need to go back to the client -> `/components/form.tsx` .

Because here we invoke our Server Action `await addTodo(result.data);` and now it could be something wrong on the server. Here we want to assign a potential response.
Then we can just check if there is an error on that `response` object.

`if (response.error)` and TypeScript complaints, because response could also be `undefined` (maybe we're not returning anything from the server). We will use optional chaining (? - question mark), to avoid TypeScript complain.

If there is an error, we can just do the same here `toast.error()` and it is going to be `response.error` now.

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";
import toast from "react-hot-toast";
import { TodoSchema } from "@/lib/types.ts"; // added import

// const TodoSchema = z.object({ // etc. // removed

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      content: formData.get("content"), // this is required
      //id: "blabla",    // error on purpose has been commented out
      //somethingElse: 'blahbla'                              //just added <-
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    const result = TodoSchema.safeParse(newTodo);
    if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
      let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
      result.error.issues.forEach((issue) => {
        errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
      }); 

      // output error message // <- we are implementing this now
      toast.error(errorMessage); 
      return;
    }

    //console.log(result.data);
    const response = await addTodo(result.data); 
    if (response?.error) {
      // output error message
      toast.error(response.error);
    }

    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```

Here `/actions/add-todo-action.ts`, we send an object here with a key of error `error: errorMessage,`. In `/components/form.tsx` we say `response.error`, - (`toast.error(response.error);`) the value of that `response.error` will be the message. 

`/actions/add-todo-action.ts`
```tsx
"use server";

import { prisma }. from "@/db/db";
import { TodoSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";

//export const addTodo = async (formData: FormData) => {
export const addTodo = async (newTodo: unknown) => {
  //const content = formData.get("content"); //removed
  
  // here we will try to validate data on the server

  // server-side validation 
  const result = TodoSchema.safeParse(newTodo);
  if (!result.success) {
    let errorMessage = "";

    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
    }); 

    // output error message
    //toast.error(errorMessage); 
    //return;
    // here we want to return a plain JS object
    return {
      error: errorMessage,
    };
  }

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });


  revalidatePath("/todos");
};
```

Now we have client-side validation and server-side validation.

We have a really nice setup with very safe validation both client-side as well as server-side. 

### Usage  of `result.data` directly in Prisma

Now after we parsed it here on the server we can also use that `result` object (`result = TodoSchema.safeParse(newTodo);`) with the actual validated data, just like we used before on the client `data: result.data,` to actually insert it into the database. 

Typically you also want to wrap this `await prisma.todo.create({ (...)` in a `try catch`, but it has been mentioned in a separate video. 

`/actions/add-todo-action.ts`
```tsx
"use server";

import { prisma }. from "@/db/db";
import { TodoSchema } from "@/lib/types";
import { revalidatePath } from "next/cache";

//export const addTodo = async (formData: FormData) => {
export const addTodo = async (newTodo: unknown) => {
  //const content = formData.get("content"); //removed
  
  // here we will try to validate data on the server

  // server-side validation 
  const result = TodoSchema.safeParse(newTodo);
  if (!result.success) {
    let errorMessage = "";

    result.error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
    }); 

    // output error message
    //toast.error(errorMessage); 
    //return;
    // here we want to return a plain JS object
    return {
      error: errorMessage,
    };
  }
                                          // <- commented out in this step <-
  //await prisma.todo.create({
  //  data: {
  //    content: content as string,
  //  },
  // });

  // typically we also want to wrap this below in try catch
  await prisma.todo.create({
    data: result.data,
  });


  revalidatePath("/todos");
};
```


### Testing server-side validation

Let's quickly test this, we are going to disable the client-side validation here `/components/form.tsx` and we're going to pass this `newTodo` directly to the server  `const response = await addTodo(newTodo);` 

and let's say we make some mistake here,
we forget to add `content`  (`content: formData.get("content"),`). 

We add `id`, but that's going to be a `string`, whereas it should be a `number` - 
`id: "blabla",` 

Now we're gonna we're going to have two issues just like before, so we should technically see the same toast message as before.

Because now this `newTodo` has problems, we send it to the Server Action, Server Action going to try to validate that, it's not going to be successful, it's going to create an error message and it returns that as an object `return { error: errorMessage, };` (`/actions/add-todo-action.ts`), then we grab it here and then output it with a toast message `if (response?.error) { toast.error(response.error); }`.

`/components/form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { z } from "zod";
import toast from "react-hot-toast";
import { TodoSchema } from "@/lib/types.ts"; // added import

// const TodoSchema = z.object({ // etc. // removed

export default function Form() {
  const clientAction = async (formData: formData) => {
    // construct new todo object before validation with Zod
    const newTodo = {
      //id: 341, // we do not have an id when we try to add that to the database
      //content: formData.get("content"),           // <- simulation error <-
      id: "blabla",                                 // <- simulation error <-
      //somethingElse: 'blahblah'                             
    }
    // reset form
    
    // client-side validation // <- we are implementing this now
    //TodoSchema.parse(newTodo);
    //const result = TodoSchema.safeParse(newTodo);
    //if (!result.success) {
      //console.log(result);
      //console.log(result.error.issues);      
    //  let errorMessage = "";

      //result.error.format()
      //result.error.flatten()

      // loop through all errors
    //  result.error.issues.forEach((issue) => {
    //    errorMessage = errorMessage + issue.path[0] + ': ' + issue.message + '. ';  
    //  }); 

      // output error message // <- we are implementing this now
    //  toast.error(errorMessage); 
    //  return;
    //}

    //console.log(result.data);
    //const response = await addTodo(result.data);  // <- simulation error <-
    const response = await addTodo(newTodo);        // <- simulation error <-
    if (response?.error) {
      // output error message
      toast.error(response.error);
    }

    // also be optimistic with the UI
  };

  return (
      <form action={clientAction} className="flex flex-col w-[330px] my-16">
        <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
        <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
        </button>
      </form> 
  );    
}
```

Now when we use form again and click "Add" button, indeed we get a very nice toast message with a message from the server.
