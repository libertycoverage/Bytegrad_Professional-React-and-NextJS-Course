## V262 Top 3 Reasons For Using Server Actions
Description: Learn about the top 3 reasons for using Server Actions.

also here: 
The 3 REAL benefits of Next.js Server Actions
https://www.youtube.com/watch?v=Qo_lxOI9GZU



### Old way (front-end)

Let's talk a little bit more about the Server Actions and Next.js as there are basically 3 real advantages of these Server Actions 

In a previous video we looked at a to-do's application and we completely walked through from A to Z and how to set up these Server Actions including the `useFormStatus` and the `useOptimistic` hooks. We really get a cutting edge UI that way.


Let's quickly talk about what are the real benefits, let's compare the old way of doing it with the new way.

Imagine we have just a simple to-dos page again we have just a list here and we can add something using the form.

Now if we click on "Add" button it's going to add this to the database and eventually it also puts in the UI of the list.

How would we do this with the old way?

Let's take a look at the actual code.

`form-old.tsx`
```tsx
"use client";

import { useState } from "react";

export default function FormOld() {
  const [inputText, setInputText] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ content: inputText }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="content"
        placeholder="Write your todo..."
        required
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button>Add</button>
    </form>  
  );
}
```


We have a `form` and in the `form` we have that `input` and then a simple `button`.

Styling has been removed here just to keep it basic.

We would have a `form` and then we would listen for the `onSubmit` or maybe `onClick` on the button. 

When the form gets submitted, we will have some event handler, let's say `handleSubmit` and we could define that up here. 


In `handleSubmit` we would basically make a fetch call to one of the API endpoints, here we would make `fetch` or maybe using `axios`, the same story `axios.post` 

We had to create this API endpoint on the server (backend), 
and then we would have to do all this stuff, `method: "POST",` because we want to add something to this resource, so it's going to be POST request, 
we have a body with `JSON.stringify()`, we have to make sure that this objects that we're sending `{ content: inputText }` is in JSON format and then the actual `content` property it's going to be the `inputText`.

If it's a control component we would have `useState` here, we need to use `useState` and then we use that as the `inputs`'s `value`, and then when it gets changed we would use the `onChange` event handler to update that `value`- controlled component.

If it's not controlled we would use `useRef`, and we will also have headers here, that is necessary for POST request as well.

This has how we would do it traditionally.


### New way (front-end)

How does the new way look like?

`form-new.tsx`
```tsx
import { addTodo } from "@/actions/add-todo-action";

export default function FormNew() {
  return (
    <form action={addTodo}>
      <input
        type="text"
        name="content"
        placeholder="Write your todo..."
        required
      />
      <button>Add</button>
    </form>  
  );
}
```

The new way, we don't even have to scroll, it's all in view here.

It's still a `form` and we still have an `input` and we still have a `button`, but now we have this `action` attribute, this is something that we may have seen in plain HTML before we could use like an URL and then the browser would submit the `form data` to the URL, but in Next.js these days, we don't really pass URL, we pass just a plain JavaScript function and that's that's the actual Server Action. 

We are importing `addTodo`, we'll take a look at that in a second.

This is all the frontend, as we can see it's much cleaner, and we don't have to have some ugly `fetch` call, or `axios`, we don't have to keep track of state using `useState`, or `useRef`, we don't have to use these hooks.

We can see, we have basically removed this entire `handleSubmit`, we don't need that anymore, we only need to pass a Server Action function to this `action` attribute. 

This is how the frontend looks like.


### API route

Let's take a look at the backend.

Traditionally we would have to submit this to the API endpoint, so we would have to create an API endpoint.

In Node.js we would use something like Express.js to deal with that.

Maybe, when already using Next.js, then we could have like an API route, in file tree of a project `app/api/todos/route.ts`

We can still do this by the way, there are some exceptions.

`app/api/todos/route.ts`
```ts
import { prisma } from "@/db/db";
import { NextRequest,NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { content } = await request.json();

  await prisma.todo.create({
    data: {
      content: content as atring,
    },
  });

  return NextResponse.json({ success: true });
}
```


We would have our route `app/api/todos/route.ts`, and here in Next.js we would have to do it like this `export async function POST(request: NextRequest) {`, we're exporting a POST function here and we can grab the `request: NextRequest`, we would grab the `content` from there `await request.`, we have to parse `request` as JSON.

Then we are using Prisma here to create that actual `todo` item in our database, and then we can return some `NextResponse` to the client again. 

And to make sure that we are actually sending it to the correct URL, we have to be careful with the structure here of our folders and files e.g. `app/api/todos/route.ts`

It's all about the structure of folders and files, here it's the `todos` directory in the `api` directory, so we get `/api/todos`. That's where we would need to export our route here.

This is all basically the traditional way, without Server Actions.



### First benefit: Server Action


Now with server actions, now we have this `addTodo` function and let's take a look at that function.

`form-new.tsx`
```tsx
import { addTodo } from "@/actions/add-todo-action";

export default function FormNew() {
  return (
    <form action={addTodo}>
      <input
        type="text"
        name="content"
        placeholder="Write your todo..."
        required
      />
      <button>Add</button>
    </form>  
  );
}
```


Usually we are going to have an `/actions` directory (catalog, folder) in the project. Note that `/actions` catalog can be outside `/app/` catalog, on the same level (sic).

`/actions/add-todo-action.ts`
```ts
"use server";

import { prisma }. from "@/db/db";

export const addTodo = async (formData: FormData) => {
  const content = formData.get("content");

  await prisma.todo.create({
    data: {
      content: content as string,
    },
  });

  return {
    success: true,
  };
};
```


Here we have our function `addTodo` 

At the top we have `"use server"`, this function will only run on the server, it's a market as a Server Action. 

As we can see `addTodo` is just a JavaScript function, it's asynchronous it takes in `formData`. Here in `form-new.tsx` if we pass the function for the action attribute `<form action={addTodo}>`, Next.js will make sure that we get access to that `formData` automatically. 


Doing it "Old way", we had to use `useState` - `const [inputText, setIputText] = useStata("");` and then we can can keep track of the actual text, the `inputText`, we have to pass it manually like this. Then you can get access to it on the server `const { content } = await request.json();` (`app/api/todos/route.ts`). 

Now (`/actions/add-todo-action.ts`) we don't need to do that, we automatically get access to that here in formData. 
That's a `formData.get` to get the actual content, then we can add it to a database `await prisma.todo.create({})`, and then we can just return a normal JavaScript object `return { success: true, };`, 

so not with this strange `return NextResponse.json({ success: true });` (`app/api/todos/route.ts`), 

we can just return a normal JavaScript object, and we can do something with that on the client if we want.

It's automatically `stringified` to JSON, all of that is handled for us under the hood by Next.js. 

Now we also don't need to pay attention to the structure of our folders in the project, (looking at `app/api/todos/route.ts`), 

it's just a normal JavaScript function, that we just have to put `"use server";` at the top and export that function and then just import it like any other utility function or perhaps other function that we would use like that. 

This whole fetching stuff has all been abstracted away from us `const handleSubmit = async () => { await fetch("/api/todos", {` etc.

Now our API route has basically just become a normal JavaScript function, business logic in the function e.g. `await prisma.todo.create({ data: { content: content as atring, }, });` 

and just invoke that function e.g. `addTodo`, by adding it to the `action` attribute.



### Under the hood

That's the first major advantage, we don't have to create these API routes and actually submit something manually like this `handleSubmit`. It is all handles for us behind the scenes.

To prove that we can inspect using network tab in dev tools in the browser.

We can show that there is actually still a fetch request.
In our example we add new text to the todo application, when we click the "Add" button, we can see there is actually a fetch request 

If we click on this fetch request we can see there is actually a fetch request being made, but this is using Server Actions, we are not using `fetch` or `axios`. 

But we still have a fetch request and we can see the payload of that fetch request is indeed text "test" as part of that data. There's also some action identifier, some other identifier, this is just Next.js making that fetch call for us behind the scenes.

It still exists but we don't have to deal with `fetch` or `axios` ourselves.

We can focus now more on the actual business logic instead of wiring up our API route with some fetch call.



### Second benefit: useFormStatus & useOptimistic

A second big benefit that we get from Server Actions is that it will make loading state for example very easy. 

Traditionally if we want to show like a loading state, typically we would create like another state variable. 

Something like isSubmitting `const [isSubmitting, setIsSubmitting] = useState(false);` and then before we make the actual fetch call we set it to true `setIsSubmitting(true);`,  and then after, we can set it to false again `setIsSubmitting(false);`. Lots of boilerplate to keep writing this pattern. 


`form-old.tsx`
```tsx
"use client";

import { useState } from "react";

export default function FormOld() {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); //here

  const handleSubmit = async () => {
  setIsSubmitting(true); // here
    await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ content: inputText }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsSubmitting(false); // here
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="content"
        placeholder="Write your todo..."
        required
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button>
      {
        isSubmitting
          ? "Adding..."
          : "Add"
      }
      </button>
    </form>  
  );
}
```


Then here when it's submitting, we can add some logic here to the button, if it's submitting we could say something like "Adding..." and otherwise it will just be "Add", to give the user some feedback that there's actually something happening. 


So how would we do that with the new Server Actions? 

`form-new.tsx`
```tsx
import { addTodo } from "@/actions/add-todo-action";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function FormNew() {
  const { pending } = useFormStatus(); // for the usage of `pending` on the button we need to move this line to the Button componenet
  return (
    <form action={addTodo}>
      <input
        type="text"
        name="content"
        placeholder="Write your todo..."
        required
      />
      <button>{pending ? "Adding..." : "Add"}</button> {/* caveat, this won't work, we need to make a button a child component of this component */}
    </form>  
  );
}
```

We actually get a hook here it's called `useFormStatus` and it's currently still experimental, and we can alias this,  `import { experimental_useFormStatus as useFormStatus} from "react-dom";`

We can use this hook and it will give us a `pending` value, then in the button we can use that.

Now we get the the same results without having to create the the state variable and doing this `true` and then `false` on the state.

This is much cleaner now. 

#### Caveat

One caveat (disclaimer) to this though is right now this won't work because we do need to make the button a child component of this component (`Button` component), and then we have to use this `const { pending } = useFormStatus();` in that `Button` component.
(for the usage of `pending` on the button we need to move this line `const { pending } = useFormStatus();` to the Button component)

We would have to refactor this `<button>{pending ? "Adding..." : "Add"}</button>` into its own `Button` component, and use `useFormStatus()` hook in there.

The form with the Server Action `<form action={addTodo}>` needs to be an ancestor of where you're using this `useFormStatus()` hook. 

We need to make this its own components. We have implemented this in the V261.


#### useOptimistic

Another really cool hook that we get is the useOptimistic hook. 
It's also experimental, but this also works nicely with Server Actions. 

This means, when we add something to the page, it's going to take some time before it arrives in the UI. We are waiting like 2s. 

We know it's going to succeed most of the time, so we might as well just immediately show it on the page (UI). We don't even need a loading indicator if we do that. We do not need to wait till it will be fetched from the database. 

We can be optimistic about the result and just immediately put it in the UI, then if the mutation on the server occurs, here's something going wrong on the server and it wasn't able to add it to the database, then we want to refer to that.

`useOptimistic` hook makes it very easy to immediately update the UI. 

The complete walkthrough how to use `useOptimistic` is in V261.

That's going to be the future of UI, it's going to be very snappy.

This works in conjunction with Server Actions. 

Doing that traditionally, that would be a lot of code.

This is the second major benefit.

We get these very useful hooks out of the box that replace a lot of boilerplate code.


### Third benefit: Progressive enhancement

We will see people mention some other benefits as well like Progressive Enhancement, 

that means that this will work even if there's no JavaScript on the client, so if the JavaScript fails to load, or the user turned off JavaScript, this will still work.

Basically there doesn't need to be any additional JavaScript shipped to the client, so the client-side JavaScript bundle can be smaller. 

There is a complete Progressive Enhancement if we do it like this. 

In the real world, we do want to have some client-side logic here, we do need to ship some additional JavaScript and we will lose some of that Progressive Enhancement.

`form-new.tsx`
```tsx
import { addTodo } from "@/actions/add-todo-action";
import { experimental_useFormStatus as useFormStatus } from "react-dom";

export default function FormNew() {
  const { pending } = useFormStatus(); // for the usage of `pending` on the button we need to move this line to the Button componenet
  return (
    <form action={async FormData => { //this
      // validate input data client-side
      // reset form
      // await addTodo(); //this
      const { error } = await addTodo();

      if (error) {
        // toast message or smth
        console.error(error);
        return;
      }
    }}>
      <input
        type="text"
        name="content"
        placeholder="Write your todo..."
        required
      />
      <button>{pending ? "Adding..." : "Add"}</button> {/* caveat, this won't work, we need to make a button a child component of this component */}
    </form>  
  );
}
```

Because typically in the real world we do want to do some client-side things here.

Here this `action` instead of immediately invoking the Server Action e.g. `addTodo`, more realistically we're going to get the `formData` like this `<form action={FormData => {`,
we can just pass a function here, before we invoke that Server Action. 

We can call it like this `await addTodo();` and this is going to be `async`, `async FormData => ` 

Before we actually call the Server Action like this `await addTodo();`, typically we do want to have e.g. validation of an input data, client-side. (And then also the server-side of course) 

but also client-side, maybe we also want to reset the form, 

and then if this `await addTodo();` produces an error we do want to be able to grab that error from what we get back `const { error } = await addTodo();`, and then if there is an error we want to have like a toast message, saying that something went wrong. 

We have additional logic around this `action={}` here so typically we don't just want to invoke the `addTodo` - `action={addTodo}` like what we had before. 

There's going to be surrounding client-side logic in the real world. 

Also that optimistic UI hook `useOptimistic`, also we need to invoke that before we call the actual Server Action for example. 

Practically speaking we will need some client-side JavaScript and we will lose some of that Progressive Enhancement. 

But you do have some Progressive Enhancements, so that's the third benefit.  

#### Progressive Enhancements, hydration priority

We still get some Progressive Enhancements, so this form will be prioritized with hydration for example and it will be interactive before other elements on the page.

About this error by the way there is a separate video on that. 

-> 
Error Handling in Server Actions Next.js (Incl. Toasts!)
https://www.youtube.com/watch?v=nsMzWA6_3RA

