## V EXTRA1 Connected to V261 V262 Error Handling in Server Actions Next.js (Incl. Toasts!)

Error Handling in Server Actions Next.js (Incl. Toasts!)
https://www.youtube.com/watch?v=nsMzWA6_3RA

### Server Action example

How to do error handling in Next.js Server Actions? 

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


We have a simple form here, it's using a Server Action. This is the Server action `action={addTodo}`. 

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  revalidatePath("/todos");
}
```



Right now `page.tsx` doesn't contain any mistakes, but what if we made a mistake, or what if something goes wrong in this Server Action? How do we output a message to the client or maybe a toast message? 

To give an example of the final output, what we're going to get here is that if we make a mistake here in the Server Action code, and we try to add something with the form, if we click "Add" button we will get an error message, toast message on the client, because there was a problem on the server.

`add-todo-action.ts` with mistake
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content2 as string, // content2 is a mistake
    },
  });

  revalidatePath("/todos");
}
```


Let's start from a clean slate here.


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


Here we have is an `h1` on the page, a `form` and here we're mapping over all the todos. 

`TodosPage()` is all a server component and in a server component we can fetch data like this `const todos = await prisma.todo.findMany();`. 

The `form` has this `action` attribute with a so-called Server Action 

Server Action we have defined in this file `add-todo-action.ts`,

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  revalidatePath("/todos");
}
```


if we want, we could also put it in `page.tsx` (between  `const todos = await prisma.todo.findMany();` and `return (`) because it's a server component, but for organizational purposes we put it in its own file `add-todo-action.ts`.


In this server component `addTodo` (`add-todo-action.ts`) we're getting data from what we add using the form, and then we try to add it to our database, we using Prisma here and then we are revalidating the path. 


### Try Catch

Typically you do want to wrap this in a `try catch`, because adding something to a database could go wrong. 

`add-todo-action.ts` fragment
```ts
  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });
```


Realistically wrap this like this: 

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content as string,
      },
    });
  } catch (error) {
  
  } 

  revalidatePath("/todos");
}
```


We're going to attempt to create a `todo` in our database, if that goes wrong and Prisma throws an `error`, or some errors thrown in the `try { }` block, 
we want to `catch` it here and then we want to output something on the client.

Remember this is all server code `add-todo-action.ts`, this is only running on the server, 
so now we need to send something back here on `page.tsx` to the client, so we can deal with that.

So here `add-todo-action.ts` we're catching the error. 

Just to get started, let's just try returning a normal JavaScript object here with an error property, that will just say "Something went wrong", let's just try returning this to the client. 

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 to is wrong on purpose
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };  
  } 

  revalidatePath("/todos");
}
```


This is all the server, so now if something goes wrong (e.g. `content2` which does not exist), there's going to be an error thrown. We're going to catch that error and we're going to return this JavaScript object `return { error: "Something went wrong!", };`   to the client. 

### Client Action

Now we come to the client. Here what we need to do, is we just we don't immediately want to invoke the Server Action `<form action={addTodo}`, we may want to have some some client-side interactivity. 
So let's remove this, because we don't immediately want to invoke the Server Action.
We also want to have some client-side code - **Client Action**. 

page.tsx
```tsx
import { addTodo } from "@/actions/add-todo-action";
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  async function clientAction(formData: formData) {
    // reset form
    // client side validation
    await addTodo(formData);
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
      <h1 className="text-2xl font-bold">Todos Page</h1>

      <form action={ } className="flex flex-col w-[330px] my-16">
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

So we have Server Action - only runs on a server, 
but then we can also have a Client Action - function that will run on the client, 

**and we can put Server Action in the Client Action** 

so we can actually just call the `clientAction()` and that will take in that `formData` of type `formData`, and in here we can then invoke this Server Action `addTodo`.
Let's mark that `clientAction()` as `async` and we will say `await` here `await addTodo()`.

Before we invoke the Server Action (here `addTodo()`), we need to pass the `formData` to the Server Action `addTodo(formData)`.

Now before we actually invoke that Server Action we may want to do other things here like reset the form or do some client-side validation. We could do that and.

-----

How to do validation
->
Validate Data With Zod in Server Actions Next.js (Client-Side + Server-Side)
https://www.youtube.com/watch?v=tLhcyBfljYo

-----

Also what we could do here (`page.tsx`) now, is we want to we want to grab the error that we get back from the server (`add-todo-action.ts`), 

What we can say when we invoke the Server Action assign the `result` to this variable (`await addTodo(formData)`).

page.tsx
```tsx
import { addTodo } from "@/actions/add-todo-action";
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  async function clientAction(formData: formData) {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
      <h1 className="text-2xl font-bold">Todos Page</h1>

      <form action={ } className="flex flex-col w-[330px] my-16">
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

If there's an error we're going to return a plain JavaScript object (`return { error: "Something went wrong!",};`), otherwise we actually don't return anything. 

So only if there's an error we will return something here `const result = await addTodo(formData);`. Then we can just check if `result` (and remember sometimes we don't return anything), so we are going to say optional `if (result?.error`.
If there is an `error` (if actually is an error), we want to show the `error`.

This is basically the more realistic logic of dealing with these `actions` here `form action={ }`





### Refactor to client component

Now we can assign this function `clientAction` to the to the `action` attribute here 


page.tsx
```tsx
import { addTodo } from "@/actions/add-todo-action";
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  async function clientAction(formData: formData) {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
    }
  }
  
  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
      <h1 className="text-2xl font-bold">Todos Page</h1>

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

      <ul className="list-disc">
        {todos.map((todo) => (
          <li key={todo.id}>{todo.content}</li>
        ))}
      </ul>
    </main>    
  );
}
```


If we save here, we're going to get an error because now we're trying to add client-side interactivity to something here in a server component `action={clientAction}`. This is all still server component.

```js
Unhandled Runtime Error
Error: Functions cannot be passed directly to Client Components unless you explicitly expose is by marking it with "use server".
  <form action={function} className=... children=...>
```


To make that work we need to refactor this to a client component, that's not a big problem that's just the real world 

page.tsx fragment
```tsx
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
```

So we going to create a new component here `form.tsx` and we're going to put the form in there.

`form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {

  async function clientAction(formData: formData) {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
    }
  }

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
  )    
}
```


Then we want to use that client component `<Form />` here in our server component `TodosPage()`. We also move `clientAction` to the `form.tsx`. We are removing `addTodo` from `page.tsx`.  `page.tsx` is still a server component, we can still fetch data, map over `todos`.

Realistically, once we need to add client-side interactivity, we are going to refactor something to a client component, that's what what we've done. We need to mark `form.tsx` as a client component.  We put the `"use client"` directive at the top of `form.tsx`. 

Now in our Client Action (`ClientAction`), we are invoking this Server Action (`addTodo`). 

`page.tsx`
```tsx
//import { addTodo } from "@/actions/add-todo-action";
import Form from "@/components/form";
import { prisma } from "@/db/db";

export default async function TodosPage() {
  const todos = await prisma.todo.findMany();

  // moved clientAction
  
  return (
    <main className="flex min-h-screen flex-col items-center w-full p-24">
      <h1 className="text-2xl font-bold">Todos Page</h1>

      {/* moved to Form component */} 
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


Now we don't get any errors, everything seems to be working. 



### Show error to user

Now we can do something, we have an error now in our Server Action.

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 to is wrong on purpose
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };  
  } 

  revalidatePath("/todos");
}
```


Now what we're going to get in `form.tsx` is `result` of `error`.

Let's try alerting the `result.error`

`form.tsx`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {

  async function clientAction(formData: formData) {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
      alert(result.error);
    }
  }

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
  )    
}
```


Now when we try to add something using the form on the page, we get a warning an alert "Something went wrong".

We are getting the this message from our Server Action. 


We're sending an object with the error "Something went wrong" and that's what we're now outputting on the client. 


We can combine this `clientAction`, we can just provide a function here essentially `<form action={clientAction}`. 

We could define it in line here `action=` and actually that may even be more common.

We are going to do it just in line here. We can pass a function here, we're going to get the `formData` from Next.js. Inline could be handy. We don't need to add a separate function. We can mark this function as `async`.

`form.tsx` with function in line for `action`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";

export default function Form() {

  return (
    <form action={async (formData: formData) => {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
      alert(result.error);
    }
  }} className="flex flex-col w-[330px] my-16">
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
  )    
}
```



### Toasts (react-hot-toast)


We want to output a toast message. We're going to use react-hot-toast, very popular library.

We are going to install that. 

`$ npm i react-hot-toast`

We have installed it.


First step is to determine where we want to show that toast on the page.

In Next.js we need to go to `/app/layout.tsx`, because typically we do want to put it in the layout file. 

 `/app/layout.tsx`
```tsx
import "./global.css";
import type { Metadata } from "next";
import { Infer } from "next/font/google";
import { Toaster } from "react-hot-toast";

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
      <body className={inter.className}>
        {children}

        <Toaster position="top-right" />
      </body>
    </html>    
  );
}
```


We have put it right here in the `<body>` and you need to use the `<Toaster />` component from `react-hot-toast` and then we can specify where it should be positioned. 

We are doing it in the `top-right`

That's the most common, most people are used to that, sometimes it's also bottom right. We can also do it in the center, but we have said that the toast message should be displayed in the top right. This is just basically the placeholder. 


Now we need to invoke a toast function when we want to actually show that. 

`form.tsx` with function in line for `action`, used toast message
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { toast } from "react-hot-toast"; 

export default function Form() {

  return (
    <form action={async (formData: formData) => {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
      toast.error(result.error);
    }
  }} className="flex flex-col w-[330px] my-16">
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
  )    
}
```

Instead of using `alert`, we can import a `toast` function from `react-hot-toast`. 

Instead of using `alert` we can say `toast.error`. 


(There's still an error in `add-todo-action.ts`, we still have this issue here where we have a typo `content: content2 as string`, we're returning an object here with error). ``

This `toast.error(result.error);` should still error out. 

We are using the form again, click "Add" button and now we get a very cool toast message on the client. 



`form.tsx` with function in line for `action`, used toast message
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { toast } from "react-hot-toast"; 

export default function Form() {

  return (
    <form action={async (formData: formData) => {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
      toast.error(result.error);
    }
  }} className="flex flex-col w-[330px] my-16">
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
  )    
}
```


What we can also do is, if there is no errors, if everything went all right, we can show success `toast.success`. 

`form.tsx` with function in line for `action`, used toast message
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { toast } from "react-hot-toast"; 

export default function Form() {

  return (
    <form action={async (formData: formData) => {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
      toast.error(result.error);
    } else {
      // show success
      toast.success("Todo added");
    }
  }} className="flex flex-col w-[330px] my-16">
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
  )    
}
```


Now if we remove the error from our Server Action `add-todo-action.ts`, `content: content2 as string`. Now we're not really returning an error, so we should go into the `else` block in `form.tsx`.

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content as string, // content2 typo repaired
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };  
  } 

  revalidatePath("/todos");
}
```


Now when we use the form on the page, we press "Add" button, we see a success message "Todo added".

### Errors with useState (it will be used often in form)

Now if we don't want to use toast messages, we can still use a state variable. 

We could have some kind of `error` state, an empty string initially. 
And maybe all the way at the bottom of the form we are going to display an error if it exists.
 
If there is an error we display that as a message. 

Then instead of using the toast function we would set the error `setError(result.error)`.

Instead of using `toast.success`, we would simply make it an empty string again `setError("");` 
 
 `form.tsx` with function in line for `action`, usage of `setError`
```tsx
"use client";

import { addTodo } from "@/actions/add-todo-action";
import { toast } from "react-hot-toast"; 

export default function Form() {
  const [error, setError] = useState("");

  return (
    <form action={async (formData: formData) => {
    // reset form
    // client side validation
    const result = await addTodo(formData);
    if (result?.error) {
      //show error
      //toast.error(result.error);
      setError(result.error)
    } else {
      // show success
      //toast.success("Todo added");
      setError("");
    }
  }} className="flex flex-col w-[330px] my-16">
      <input
        type="text"
        name="content"
        className="px-4 py-2 mb-3"
        placeholder="Write your todo..."
        required
        />
      <button className="bg-blue-500 rounded px-4 py-2 text-white font-semibold">Add
      </button>
      {
        error && (
          <p className="text-red-500">{error}</p>
        )
      }
    </form> 
  )    
}
```
 
 
Now if there's an error (we simulate that using again `content: content2 as string,`) in our Server Action, and we are using form again, we get a message "Something went wrong".


This is a more realistic scenario with the Server Actions because typically we do want to have client-side interactivity functionalities. 

Refactoring is needed, we need to refactor things to a client component `form.tsx` is an example of that. 

### Get error message

Now one las thing, here in `add-todo-action.ts` we're hard coding the error `error: "Something went wrong!"`.

`add-todo-action.ts`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose
      },
    });
  } catch (error) {
    return {
      error: "Something went wrong!",
    };  
  } 

  revalidatePath("/todos");
}
```

Realistically we want to get the message from the actual `error` that was that was thrown here.

Realistically we would do something like `error.message`.

`add-todo-action.ts` with `error: error.message`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose 
      },
    });
  } catch (error) {
    return {
      error: error.message, // red squiggly lines on error.message
    };  
  } 

  revalidatePath("/todos");
}
```

Now if we try doing this above TypeScript will complain and intellisense (hover on red squiggly lines) will say `error is of type unknown`.

Because what we `catch` here, we don't really know what the `error` is going to be. 

In JavaScript we can throw anything, we can throw the number five `throw 5;`, we can throw a string, we can throw an array. 

This `error` could be the number `5`, and we cannot say `5.message`, it doesn't exist, it doesn't work like that. 

`add-todo-action.ts` with `error: error.message`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose 
      },
    });

    // throw 5;
  } catch (5) {
    return {
      error: 5.message, // 5.message does not exist
    };  
  } 

  revalidatePath("/todos");
}
```


So here `error` is actually typed as `unknown` as it's called.

`add-todo-action.ts` with `error: error.message`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose 
      },
    });
  } catch (error: unknown) { // red squiggly lines on error.message
    return {
      error: error.message, 
    };  
  } 

  revalidatePath("/todos");
}
```

-----

There is a separate video on that here
->
Use ‘unknown’ instead of ‘any’ in TypeScript (Try / Catch error handling)
https://www.youtube.com/watch?v=-bmNkTqvYfQ

-----

In the past this was typed as `any` by default.

`any` means anything goes, when we use `any`, the error (red squiggly lines on `unknown`) is disappears.

But this is not really the proper way of doing it in TypeScript. 

`add-todo-action.ts` with `error: error.message`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose 
      },
    });
  } catch (error: any) {
    return {
      error: error.message, // red squiggly lines dissapears on `any`
    };  
  } 

  revalidatePath("/todos");
}
```


We don't know what it's going to be, `unknown` is a more precise type, and since we don't know, we cannot just access that message on here.

`add-todo-action.ts` with `error: error.message`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose 
      },
    });
  } catch (error: unknown) {
    return {
      error: error.message, // red squiggly lines on error.message
    };  
  } 

  revalidatePath("/todos");
}
```


We have a utility function to extract messages from these `errors` in Server Actions. 
(utility function `getErrorMessage` comes from a video titled  "Use ‘unknown’ instead of ‘any’ in TypeScript (Try / Catch error handling)" https://www.youtube.com/watch?v=-bmNkTqvYfQ)


`add-todo-action.ts` with `error: getErrorMessage`
```ts
"use server";

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string"){
    message = error;
  } else {
    message = "Something went wrong";
  }
  
  return message;
}

export const addTodo = async (formData: formData) => {
  const content = formData.get("content");

  try {
    await prisma.todo.create({
      data: {
        content: content2 as string, // content2 typo on purpose 
      },
    });
  } catch (error) { // We do not need to type error: unknown,
    return {
      error: getErrorMessage(error),// instead of error.message -> getErrorMessage
    };  
  } 

  revalidatePath("/todos");
}
```

This utility function is called `getErrorMessage`, we just pass in that error `error: unknown` and it will extract a `message` as a `string` 

We're going to use that utility function `{ return { error: getErrorMessage(error), }; }`. We just call this function, we pass in that `error`. We don't need to type `catch (error: unknown)`, `error` is actually `unknown` by default these days.

We pass the `error` to `getErrorMessage`, this function takes in this `error` which is going to be of type `unknown` and it returns a `string` -> `(error: unknown): string`

We specify the `message` is going to be a `string` ->  `let message: string;`

First, maybe they they actually threw an error that was actually created with that `error class` that we have in JavaScript, maybe an error was actually thrown like this: 
```js
new Error()
```

Then we go in this first if block and we can actually just use `.message`
There's actually a `message` property on that `error` object. No problem, we can use it.

`add-todo-action.ts` fragment with `error: getErrorMessage`
```tsx
  if (error instanceof Error) {
    message = error.message;
  }  
```


Maybe they threw a normal JavaScript object  `(error && typeof error === "object"` and maybe there was also a message in there `"&& message" in error`. 


Maybe they threw, we can throw just an object literal with a message like that, not an instance of the `error class`, but just an object literal: 
```js
throw {
  message: "Something went wrong",
}
```


We go into this `if` block: 

`add-todo-action.ts` fragment with `error: getErrorMessage`
```tsx
 } else if (error && typeof error === "object" && "message" in error) {
   message = String(error.message);
 }
```

The `message` property could technically be a `number`, (the value for that `message` could be a `number`) or something else. We want to cast that to a String. 

Or maybe they actually threw an actual `string`: 

`add-todo-action.ts` fragment with `error: getErrorMessage`
```tsx
 } else if (typeof error === "string"){
   message = error;
 }
```

We can just use that `string` as the `message`.

Otherwise we have default text here `"Something went wrong"`:

`add-todo-action.ts` fragment with `error: getErrorMessage`
```tsx
} else {
  message = "Something went wrong";
}
```

This `getErrorMessage` utility function will always give us some `message`: 
(`return message;`)

and that's what we're going to return to the client here:

```tsx
export const addTodo = async //(...)
//(...)
return {
  error: getErrorMessage(error),
};  
```


Now if we try again with filling the form, press "Add" button , we still have this typo here `content: content2 as string,` (`add-todo-action.ts`)

Now we can see, we get a more specific error message `content2 is not defined`

Complete walkthrough of how to properly extract an error message here with TypeScript 
there is in ->
Use ‘unknown’ instead of ‘any’ in TypeScript (Try / Catch error handling)
https://www.youtube.com/watch?v=-bmNkTqvYfQ

-----

NOTE:

A: React's useFormState hook is kind of a shorthand to do the same thing
B: True, I published this video before that hook came on the scene. Still, that hook has quite some boilerplate / confusing way of working IMHO