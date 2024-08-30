## V264 Professional Forms With React-Hook-Form And Zod
Description: Learn how to use React Hook Form with Zod. 

also here: 
React Hook Form (+ Zod) - Complete Tutorial
https://www.youtube.com/watch?v=u6PQ5xZAv7Q


### Intro

If we are creating a website or web application sooner or later you're gonna need some input from the user and we use forms for that. 
Imagine a government, healthcare, insurance, booking a plane ticket type of web apps, they may have dozens or even hundreds of inputs. In these cases we deal with big complicated forms and we need a robust solution for that. 

One of those robust solutions is called React Hook Form. 

We're going to look at how that works including with Zod for validation and including server side validation. 

### Traditional form

But before we do that, let's just start looking at a normal form without any additional stuff so without React Hook Form.

We have a simple form here, it has an `input` for the email, it has an `input` for the password and then also an `input` for confirming the password and then a submit `button`. 

Right now these inputs are so called uncontrolled inputs meaning if we type in the input fields on the website, it will work, we can actually see text but this is not coming from React State. These inputs just have their own internal state in the browser, we are not controlling it. Therefore we call it uncontrolled.

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  return (
    <form className="flex flex-col gap-y-2">
      <input type="email" placeholder="Email" className="px-4 py-2 rounded" />
      <input 
        type="password"
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        type="password"
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Typically in real world people do often make these controlled inputs. 

Here we would create a state variable for example for email, two more for passwords and set password and confirm password. 

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="flex flex-col gap-y-2">
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email" 
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

But when you use these React hooks (`useState`) that's only possible in client components, so we are going to convert this into a client component. 

Then we want to make sure that this `email` value is actually coming from the `useState` here, so not its internal state. Now we actually want to make sure it comes from this state here (`useState`). 
We're going to say `value` is `email`, same for the `password`, `confirmPassword`. 

What we need to do is whenever we type here in the input field, we do need to update the state. That means we're going to add an `onChange` listener, put in `(e) => setEmail(e.target.value)`, same for `password` and same for `confirmPassword`.

Now these inputs are so called controlled inputs, because we are keeping track, we are controlling the input values ourselves.

The main benefit of doing this, is that we have one source of truth, we always know where the values of the inputs are now coming from. 


When we put in some gibberish right in the input fields, and we try to submit the form, we actually already get a warning message here `"Please include an '@' in the email address. 'gibberish' is missing an '@'."`

We're telling the browser this input field needs to be an email so the browser already offers actually pretty sophisticated client-side form validation. 

Let's actually use that. We are using `type` as `email` and `type` as password here, but there are other things as well for example we can specify that `required` should be `true` - so we cannot leave the input field in the form empty. 

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="flex flex-col gap-y-2">
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required={true} // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

And actually in jsx if you have a `boolean` like this `required={true}` you don't need to write is `true`. Just specifying it like `   required    `, will automatically make it through, we actually also get a warning. 

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form className="flex flex-col gap-y-2">
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

Let's add `required` to the other fields. 

There are other ones as well for example maybe the password needs to be at least 10 characters long `minLength={10}`. 
We can also specify a maximum length, let's say the email can be at most 50 characters long `maxLength={50}`. 

We get warning from the browser if the specified requirements with length are not satisfied while submitting the form. We have basic validation.

If we try to submit (using the "Submit button"), we can see it tries to submit the form and by default it actually tries to submit it to some URL that we specify in the `action` attribute.

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form action="" className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

Now typically we want to submit it with our own JavaScript, so we would do something like `onSubmit` and then maybe a function called `handleSubmit`.

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

and then we can do it inline here `onSubmit={e => { }}` 
or extract it into a separate function usually called `handleSubmit` 

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

and then in `handleSubmit` we get access to the event object and here we will send the data to our server. 

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
  
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

#### `onSubmit={e => { }}` TypeScript infers the type of 'e' VS extracting `= (e) => {` into a separate function, that is a problem for TypeScript

We get a warning from TypeScript here `(e)` because it doesn't know what type this is. 
That's the downside of extracting `(e) => {` into a separate function. If we would just do it in line like this `onSubmit={e => { }}` typescript can already infer what this event object is going to be, because it has the context there `form onSubmit={e => { }}`.

Here we are defining a separate function `const handleSubmit = (e) => {` we could be using that anywhere. Here we need to specify the type

TypeScript doesn't know that this is connected to this `onSubmit`, so it doesn't know what this type is going to be. 
But here `onSubmit={e => { }}` TypeScript knows the type. 


Now here `const handleSubmit = (e) => {` we don't know what the type is going to be, so what we can do here is we can just hover this `e` in `onSubmit={e => { }}` and Intellisense tells us it's going to be: 
`"(parameter) e: React.FormEvent<HTMLFormElement>"`

We can just copy this and type this like that:
`const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {`


`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO: submit to server
    // (...)
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

Typically we are going to see `e.preventDefault();`
Now if we type out the form with some gibberish but still conforming to the validation, we can see when we submit with the button, now it doesn't do anything, it does refresh, basically nothing is happening now. The form also doesn't get reset (reset is flushing out, cleaning the form inputs after we submit the form). 
Now we have prevented the default behavior essentially when the form is submitted.

Now we can do it ourselves, so here's where we would send it to the server, then we would have our code for doing that. `// TODO: submit to server`

We'll look at how to do this later.

Let's continue with doing some other typical things here.

#### Submitting state

Typically we also want to keep track of the submitting state, so while it's being submitted, while we're sending it to the server, it should be disabled. 
Now typically we would create a whole separate `useState` variable for this. 

We could do something like `isSubmitting`, initially it's `false`, but once we have clicked "Submit" `button` we want to set it to `true`, and then after we submitted it to the server  we can set it to false again.

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: submit to server
    // (...)

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Then we can use `isSubmitting` to show like a loading spinner, and so just some loading indicator essentially. 

For now we will just use it to disable the `button`, so the user cannot accidentally submit it twice. We can say `disabled` should be `true` if is `submitting` is `true` - `disabled={isSubmitting}`

And then we can use Tailwind CSS here, we can target the `disabled` state to make it a gray color `disabled:bg-gray-500`

Now what's going to happen is this `e.preventDefault(); setIsSubmitting(true); setIsSubmitting(false);` in `handleSubmit` is going to run very fast, because we're not actually submitting it to a server `// TODO: submit to server`. 

Let's just mock a server call, we can use `async await` here and we will just quickly create basically like a sleeper expression here. It will just sleep for one second and then it will continue here


`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: submit to server
    // (...)

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

Now if we try to submit the form, we can see the button becomes gray for one second, because the submitting is `true`, it makes it disabled (`false`) and with Tailwind CSS we can easily style that and then after one second we set it to `false` again - `setIsSubmitting(false);`

#### Error state

Besides the submitting state we usually have an error state. There could be errors.
We could have `errors` `setErrors`. 
Typically this is going to be an array. 

There could be multiple errors, maybe there's something wrong with both the email field as well as the password field. 

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: submit to server
    // (...)

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

When we use a primitive value e.g. array `[]`, for the initial value for the `useState` calls, TypeScript will properly infer the type. 

Because we have an empty string here `("")` TypeScript will properly infer this variable e.g. `password` as a `string` e.g. `const [password, setPassword] = useState("");`, 

however when we are using an array or object for the initial value for the `useState` calls, TypeScript will not infer the type for the variable, that's not the case.

Using Intellisense we can see that TypeScript infers `errors` - (`const [errors, setErrors] = useState([]);`) to be some array with `never[]`.

intellisense
```js
const errors: never[]
```

That's not true an `error` is going to be a `string`, and we have an array of strings, so we need to to properly type this ourselves. 

We're going to type this as a array of strings we can do it like that.
`const [errors, setErrors] = useState<string[]>([]);`

We could also do this manually here but it's not necessary e.g.: 
`const [isSubmitting, setIsSubmitting] = useState<boolean>(false);`
It is not necessary, TypeScript can properly infer that `useState(false)`, but not with arrays and objects.

-----

#### `password` equal to `confirmPassword` 

When do we have an `error` in our case? For example when the passwords are not equal (`password, confirmPassword`). 

So before we actually submit it to the server `handleSubmit (...) // TODO: submit to server` we want to have some more validation here and specifically we want to make sure that the `password` is equal to the `confirmPassword` 

It's not really easy to do that here with the native HTML validation, so we have to run our own JavaScript here

here we get some suggestions from Copilot which we will accept, and we actually also want to return out of the function here `return;`. If there's an error we don't want to continue and submit it to the server, we want to `return;` here.  User needs to manually fix matching passwords first before we actually submit it to the server. We also want to set `isSubmitting` to `false` again.

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // some validation here, we want to make sure that the `password` is equal to the `confirmPassword` 
    if (password !== confirmPassword) {
      setErrors(["Password and confirm password must match"]);
      setIsSubmitting(false);
      return;
    }

    // TODO: submit to server
    // (...)

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2"> 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

It's starting to get a little bit more complicated now, because we can easily forget this  `setIsSubmitting(false);` inside this `if (password !== confirmPassword) { }` for example. 

Then we have the `errors` but then of course we also want to display them to the user that's another issue. How can we easily do that? 
That's not really a problem now because ideally if there is a password issue we can display it right below the password field. But we just have an array of strings so this would already require quite a bit of programming to get a nice structure here, so we can properly match it with the appropriate input. 

We're not going to do that here because this is just a bit too much work.
React Hook Form will make that much easier for us.

Let's continue here
so let's say we do have some errors, we'll just have one place where we're just going to output all of them.

If that array of `errors` is actually not empty, we do want to display some error on the page.


`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // some validation here, we want to make sure that the `password` is equal to the `confirmPassword` 
    if (password !== confirmPassword) {
      setErrors(["Password and confirm password must match"]);
      setIsSubmitting(false);
      return;
    }

    // TODO: submit to server
    // (...)

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2">
    {/* here we render errors on the page */}
      {
        errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li
                key={error}
                className="bg-red-100 text-red-500 px-5 py-2 rounded"
              >
                {error}
              </li>  
            ))}
          </ul>
        )
      } 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Here what we can do, is we can have a list of those `errors`, for each `error` we're going to have an `<li>` 

Now if we try to submit something, and we make a mistake that passwords are not equal, now we get this error message on the page `Password and confirm password must match`, because here it's setting the errors `setErrors(["Password and confirm password must match"]);`, so the state changes and then we render errors on the page. 


#### Reset the form

One last thing we want to do here is very typically is also a reset the form. 

After we submitted it to the server, we want to make sure that the form (form inputs) is empty again. 

It's a bit annoying to do that now because we have three states here, so we would have to do `setEmail` it's going to be an empty string `setEmail("");`, `setPasswords` empty string `setPassword("");`, `setConfirmPassword` empty string `setConfirmPassword("");`, (we could have many more inputs, they're going to be set to empty strings).

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // some validation here, we want to make sure that the `password` is equal to the `confirmPassword` 
    if (password !== confirmPassword) {
      setErrors(["Password and confirm password must match"]);
      setIsSubmitting(false);
      return;
    }

    // TODO: submit to server
    // (...)

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2">
    {/* here we render errors on the page */}
      {
        errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li
                key={error}
                className="bg-red-100 text-red-500 px-5 py-2 rounded"
              >
                {error}
              </li>  
            ))}
          </ul>
        )
      } 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

Now if we don't make a mistake and everything is actually correct, now if we try to submit, we can see after one second actually everything gets reset in the form. 

This is an example of a very typical form and we can see how much boilerplate we have to write. We have all these `useState`s here, we have this whole `handleSubmit` with `e.preventDefault()`, loading state, error state, and already starts to get a bit tricky as soon as we need to do something that's outside the normal HTML validation, such as making sure that one field is equal to another field e.g. passwords. 

Very easy to make mistakes for example we can easily forget to use set `setIsSubmitting` to `false` here inside `if (password !== confirmPassword) {`. 
It's annoying to deal with errors, it doesn't have the right structure, so it's difficult for us to match the errors now to the actual fields that were errored. 
This right now is not a robust solution especially if we're working with large complex forms with dozens of inputs with various strict requirements for safety and accessibility.



### Adding React Hook Form

#### Overview of React Hook Form

The most popular solution for this right now is React Hook Form. 

We can see it's been growing pretty substantially and it solves a lot of those problems
https://www.npmjs.com/package/react-hook-form

https://react-hook-form.com


(There are other libraries as well like for example `formik` (https://www.npmjs.com/package/formik, https://formik.org/docs/overview), but it has hasn't been growing as fast, Some people claim it's not being maintained properly. )


React Hook Form seems to be the the go-to solution these days.

Let's take a look at how we can implement this with and without Zod. 

First we'll look at without Zod and then we'll talk about why we even need Zod. 


Let's take a look at an example they show here https://www.npmjs.com/package/react-hook-form. 

The main hook that we can import is `useForm`, we can invoke it and what we get is `register`, `handleSubmit` and then also `formState` from which we can get the `errors`.
We have to `register` each `input`, apply validation `{ required: true }`. 
It's using the HTML validation, it tries to mimic the HTML standards for form validation https://react-hook-form.com/get-started#Applyvalidation. It also has `required, min, max minLength, maxLength, pattern, validate`.
https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation

Quickstart example
```tsx
import { useForm } from 'react-hook-form';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('firstName')} />
      <input {...register('lastName', { required: true })} />
      {errors.lastName && <p>Last name is required.</p>}
      <input {...register('age', { pattern: /\d+/ })} />
      {errors.age && <p>Please enter number for age.</p>}
      <input type="submit" />
    </form>
  );
}
```


Now we're going to do validation through React Hook Form. 
The other benefits of react hook form is that it's very low in size because it doesn't use any dependencies and it's also very performant, which is really important if we have a large form. 
And the reason it is so performant compared to what we were doing right now (here in `form-without-react-hook-form.tsx`) is because it doesn't re-render every time we type (Isolate Re-renders). 

We had a controlled form, all our inputs were controlled, that means if we type something we can see it's already renders on every keystroke, because on every keystroke we have that `onChange` updating the state. The state changes on every keystroke, which will re-render the whole component including its child components. 

However with React Hook Form if we are typing an input, we can see the child components here do not re-render every time, it minimizes the amount of re-renders. 
This is actually really important if we have a large complicated form. 

It's also really fast at first mounting the form in the first place (described in section "Faster Mounting" on the webpage of the project, mounting took 1800ms) and has other optimizations as well . 



Let's try achieving the same but now with React Hook Form. 

React Hook Form will make a massive difference and it will be shown a before and after once we have implemented it. 

Let's install it first:
`react-hook-form-zod$ npm i react-hook-form`

Let's begin with the duplicated file.

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  return (
    <form   className="flex flex-col gap-y-2">
    
      <input 
      
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded"
      />
      <input 
        
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


#### What we get from `useForm` hook

Now we need to import the `useForm` hook which is the main hook that we want to use, and then we can remove all of these `useState`s we had before, and replace it with a `useForm` hook. 

What we get from `useForm` hook is the following, we can this destructure that, we got a bunch of things here: 
- we can `register` every input,
- we can handle the submit `handleSubmit`
- from `formState` we need `error` state and loading state, we also want `isSubmitting`, we can destructure that. In JavaScript we are destructuring `formState` here, but it itself is also an object, so we can destructure `errors` and `isSubmitting` from there. 
- we actually get a `reset` function as well
- we also want to check if the `password` is equal to `confirmPassword`,  so we will use `getValues` for that 


#### What we remove

We remove old `handleSubmit` function.

We are going to remove this errors stuff where we were rendering errors on the page,
because we now have a much better solution for that. 
Now we also don't want to have the `value` in `input` fields anymore. We don't have to keep track of this ourselves. 
`onChange` also is not needed (`onChange={(e) => setPassword(e.target.value)}`) 
We don't have controlled inputs anymore, we don't have to set this state ourselves with `onChange`
We still have `disabled` on the `button` here.


#### Actual implementation

Let's try implementing the same with what we get from React Hook Form. 

First we want to register every `input`, so  React Hook Form can keep track of it. 
What we can do here is, we can call the `register()` function that we get here, and we can give it a name, so this is going to be for email `register('email')`

Now when we call this function `register('email')` it will actually return props. 
We want to spread the props on this `input`, we can use the spread operator `...`
Whatever is returned from here we immediately spread that on this `input`. 
Let's also register the other inputs

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  return (
    <form   className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

Then we also want to do validation here in this `register` function call. 
We can say it should be `required` for example and actually we still had `required` from the Native HTML validation. Let's just remove that and do everything through React Hook Form. 

We can say `required:` and then with a custom error message, so we will just say `"Email is required"` . 
It's the same as with the HTML validation. 
We also have `minLength` and then we can say the value minimum 5 `minLength: { value: 5, }` 
and then a custom error message `message: "Email must be at least 5 characters"`. It's nice that we can immediately also give a custom error message.

We have `maxLength`, all of that works the same as with HTML validation.

For email we can just make it `required` and nothing else.


For the `password` here let's make it also `required` but also let's give it a minimum value, some `minLength` of let's say 10, and with a message `"Password must be at least 10 characters"` and here we will just make this required. 
Now we have validation actually in place.

##### onSubmit

Let's see what happens if we just fill the form with some gibberish and submit it with the button. We can see we actually get the same behavior as initially, the browser tries to submit it and resets the form, refreshes the page. 
Let's properly take care of this submitting, here we don't want to have a refresh or anything like that. 

On this `onSubmit` event, this time we're actually going to use the `handleSubmit` function from React Hook Form. We want to call that function `form onSubmit={handleSubmit90}` This function will immediately prevent that default `e.preventDefault()`(what we were doing here before in previous "classic" implementation). React Hook Form already does that for us.

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  return (
    <form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


And then React Hook Form it gives us the `data` here: `form onSubmit={handleSubmit(data =>)}` but only if the `data` validated. It will do `preventDefault`, but also immediately download the data according to what we put in here `{ required: "Email is required", (...) etc. } `. 
If `data` is not validated it will not give us the value here in `data`, once we do get the value here in `data`, we can be assured the data has been validated properly. 

We can run it in line like here `form onSubmit={handleSubmit(data =>)}`,
but typically people do also extract this into a separate function and the typical name for that is just `onSubmit`. 
We define `onSubmit` up here, we get `data` so here, we want to send it to the server. We can just mock it for now with just a one second waiting here.  Let's make function async. 

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


We get a TypeScript issue for `data` as input in this function: "Parameter `data` implicitly as na any type". Typically we don't want to use `any` types in our code. How do we know what type should be? 

Well remember because we have extracted this into a separate function TypeScript does not know the type, it does not see the context of using that. 
But if we do it in line like here, `form onSubmit={handleSubmit(data =>)}`, TypeScript can can know better. With Intellisense we can see `(parameter) data: FieldValues`, type of `data` is `FieldValues`.

Let's type this as `fieldValues`. This is a type that we get from React Hook Form as well so we will just import that as well `import type { FieldValues } from "react-hook-form";`, or just just like this: 
`import { useForm, type { FieldValues } } from "react-hook-form";`

Intellisense on `FieldValues` is just telling us,
```tsx
(alias) type FieldValues = {
  [x: string]: any;
}
import FieldValues
```

it's going to be an object with pretty much `any string` and `any` value for that. 
This is basically the same as `any` or very similar to `any`. 

To really properly type this we will use Zod. 

Now we have to accept that `data` isn't going to be typed very nicely. 

#### isSubmitting in React Hook Form

While it's submitting (`onSubmit`), we want to give feedback to the user and we don't have to create state. We already get `isSubmitting` from `useForm` (`"react-hook-form"`) so we can just use `isSubmitting` on the `button` to disable that `<button disabled={isSubmitting}`. Now when we submit the form using a button, the button is disabled for a while right after the submission.

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

#### Reseting the form in React Hook Form

What about resetting the form after submitting, we also got `reset` from React Hook Form. We don't have to do that ourselves, we just call `reset();` (within `onSubmit`). 

Now if we try to submit the filled out form using the button, we can see it's submitting and then after that immediately resets the form, flushing, cleaning the form. 

#### Errors in React Hook Form, displaying errors under each input of the form

What about errors? What if we have that error where we don't have enough characters (in the password), how do we deal with that? 

React Hook Form actually gives us the `errors` variable and the structure is really nice, because for every field it will just have a key in that object.

Below each input, very granularly, we can output a very specific error message e.g.:

```tsx
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
```

Below the email input for example we can just check if that `errors` object has an `email` property in there, and if that's `true` we can just output an error message - just a paragraph and make it red text. We can use the `message` property in there. `errors.email.message`

We can do the same for the other inputs so here for `password` for example, if there is an error, we can use `errors.password.message`. 

Let's also do the last one here `errors.confirmPassword.message`. 

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Now let's try submitting the form with just some dummy data, now we have like seven characters that's not enough. Now if we try to submit this, we can see we get a very nice red text error message displayed on the page e.g. "Password must be at least 10 characters".

Dealing with errors is much easier now.

After quick fix in the form's text inputs we can see we don't get an error and form properly `reset`s. 

Now we have pretty much everything we want. 


#### matching length of a `password` and `confirmPassword` in React Hook Form

We haven't yet implemented the matching length of a `password` and `confirmPassword`.
We'll fix that in a second. 

Now we actually also want to make sure that the `password` is the same as `confirmPassword` and we know not have to write any additional logic in `onSubmit` function, we can write it immediately near the `input` fields with the other validation.

What we can also do if we have more complicated validation, we have the `validate` option here where we get the actual value from that `input` and here we can say this value is strictly equal `===` to the `"password"` `value`. 
If that's true `value === getValues("password")` we won't see anything, but if that's false it will immediately return `"Passwords must match"`.  This will just create another error.
This is connected to this `errors.confirmPassword`. Now if we do some test in the form, mismatching the length and characters of the password and confirmPassword (they are not the same), if we submit the form, we can see we see an error message `"Passwords must match"`. 

`form-with-react-hook-form.tsx` fragment
```tsx
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
          validate: (value) =>
            value === getValues("password") || "Passwords must match",
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
```

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
          validate: (value) =>
            value === getValues("password") || "Passwords must match",
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

It's really nice because here if we validate it `validate: (value) => (...) etc.` and there is actually a problem here, it's immediately connected to `errors.confirmPassword`.
So the structure of the errors is just much better. 


### Before & After

If we compare this with the previous version, so here we don't even need to use `useState` anymore, we can just remove the import of `useState`. 

If we now compare this with what we had before, we can see before we had basically like a Frankenstein of `useState`s, `e.preventDefault`, setter calls e.g. `setEmail` etc., some more additional logic for validation randomly in our `handleSubmit`. 
But now we can see we don't even have one `useState` ourselves, we get everything here from `useForm` (main hook from React Hook Form). Our `onSubmit` logic is now much leaner (smaller) and the additional validation is properly connected now with the rest of the validation (`required:`, `validate:` are close to each other).

The errors are much better structured: 
```tsx
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
```

We get the loading state very easily `isSubmitting`, we can easily `reset`, we can easily `getValues`. 
And in here we get `data` - (`const onSubmit = async (data: FieldValues) => {`) only if it's properly validated. If it's not properly validated, we don't get the `data` here `async (data: FieldValues)`. 

Once we get the `data` here `async (data: FieldValues)`, we can safely submit it to the server, and if it doesn't properly validate it will just give us errors, which we can then properly deal with like what we've done here. 


Right so before and after we can see we had this ugly errors stuff here:

`form-without-react-hook-form.tsx` fragment
```tsx
      {
        errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li
                key={error}
                className="bg-red-100 text-red-500 px-5 py-2 rounded"
              >
                {error}
              </li>  
            ))}
          </ul>
        )
      } 
```

`form-without-react-hook-form.tsx`
```tsx
"use client";

import React from "react";

export default function FormWithoutReactHookForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // some validation here, we want to make sure that the `password` is equal to the `confirmPassword` 
    if (password !== confirmPassword) {
      setErrors(["Password and confirm password must match"]);
      setIsSubmitting(false);
      return;
    }

    // TODO: submit to server
    // (...)

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={e => { }} className="flex flex-col gap-y-2">
    {/* here we render errors on the page */}
      {
        errors.length > 0 && (
          <ul>
            {errors.map((error) => (
              <li
                key={error}
                className="bg-red-100 text-red-500 px-5 py-2 rounded"
              >
                {error}
              </li>  
            ))}
          </ul>
        )
      } 
      <input 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        required       // <- this is the same as just writing required alone
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      <input 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      <input
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        type="password"
        required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

This `form-with-react-hook-form.tsx` is just much cleaner, much better, a much more robust solution. 

`form-with-react-hook-form.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
          validate: (value) =>
            value === getValues("password") || "Passwords must match",
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


### Adding Zod

Now what's wrong with this, why do we need even more stuff? 
Why do we need Zod? And there are other as well like `yup` package. 

https://www.npmjs.com/package/zod

These are all tools to help us build a schema and validate that schema.


Zod seems to be the most popular one right now so that's what we're going to use, but they all work very similarly. 

Why do we want to use that?

The most important reason actually to use something like Zod is because we don't only want to have validation on the client-side, we may also want to have validation on the server-side. 

We are validating this form here on the client, but then when we get the data on the server, we want to do it again, because we cannot really trust anything coming from the client on the server. 

But the validation is going to stay the same, we can create one schema with Zod and use it on both the client as well on the server. 

If we use React Hook Form alone, that's just a form on the client. All the validation that we're doing with `required:` and `minLength:` this is all just within this form on the client which utilizes React Hook Form.

But we want to do the same validation also on the server and maybe other places. 

Maybe we want to put this in local storage, and then when a user comes back again, we want to pull it out of local storage again. When we pull something out of local storage it's also a good idea to validate that what we get out of local storage is actually the correct shape. 

Basically whenever we have a boundary, like an a like a network boundary between clients and server, or local storage where we can put something in local storage, or out of local storage, in a file system. Whenever we have a boundary like that, and we're getting data in our app we want to have validation. 

With React Hook Form we only have client-side validation here with the form. 
With Zod we can create one schema and use it everywhere, so we'll have one source of truth for how our data is supposed to be, and then we can connect that Zod schema to React Hook Form. 

We're not going to use this (built-in) React Hook Form validation, we're going to use Zod validation, but we can still connect it to React Hook Form, so all of this will still work: 

`form-with-react-hook-form.tsx` fragment
```tsx
export default function FormWithReactHookForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();
```

If there is an error with validation it will just work with `errors`. 



#### One central place for all the validation using Zod (instead of React-Hook-Form's validation)

Now we have duplicated our file once again and now we're going to add Zod to the mix. 

`form-with-react-hook-form-and-zod.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
          validate: (value) =>
            value === getValues("password") || "Passwords must match",
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```




Let's install Zod: 

`$ npm install zod`
`$ npm i zod`

Zod is its own separate thing, but we want to connect it to React Hook Form here, because we still want to use all of these features from React Hook Form. 

To do that we need a so-called resolver. 

React Hook Form also offer resolvers for Yup package and these other schema validators. That's from (at) `@hookform/resolvers`. We install `@hookform/resolvers`. 

`$ npm i zod @hookform/resolvers`

We install both of them. 


Let's actually import that, we only need `import { z } from "zod";`
Then we can create a schema. Basically the the shape of the form here and we want to use it not only here on the client side also in other places potentially.

Let's say we're going to have a `signUpSchema` and we can say it's going to be an object, `z.object`. What properties will it have?
It is going to have an `email` and that should be a `string` and specifically an `email`. 
It should also have a `password`, it's also going to be a `string`, then we can say it should have at least 10 characters `min(10)`.

`form-with-react-hook-form-and-zod.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10),
})

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email', {
          required: "Email is required",
          minLength: {
            value: 5, 
            message: "Email must be at least 5 characters",
          }
        })}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        })}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
          validate: (value) =>
            value === getValues("password") || "Passwords must match",
        })}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```



Now if we look here, we are now doing that with React Hook Form:

```tsx
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
```

 react hook form is using `minLength`, `value: 10` and then we can also pass a custom error `message`. 
 
 We can do the same with Zod. 
 Here we can say the minimum should be 10 `min(10)`, and then we can pass a second argument, where we can pass the custom message e.g. `"Password must be at least 10 characters"`. 
We're basically going to do all of that validation now not with React Hook Form, but with Zod.
We should also have a `confirmedPassword`. 
Now we have the validation centralized in one place.

Not only on the client do we want to make sure that the `email` is required, also in the server. Just the fact that we added `email` here `signUpSchema` will already make it required.

Now we can remove it from React Hook Form -> `required: "Email is required",` and other validation.

and the only thing we need to do with React Hook Form now is just `register` these inputs 

we remove these: 

removed `'password'` validation in  `form-with-react-hook-form-and-zod.tsx` fragment
```tsx
                     ', {
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Password must be at least 10 characters",
          },
        }
```

We don't want to do that with React Hook Form, we want to put that in our Zod schema (her this `signUpSchema`), because we want to do the same validation in other places as well, not just here in the form on the client.

`form-with-react-hook-form-and-zod.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```
 

Here we were also checking if `confirmPassword` is the same value as the `password`. 
We can do the same with Zod.

We can also remove this:

removed `'confirmPassword'` validation in  `form-with-react-hook-form-and-zod.tsx` fragment
```tsx
                          , { 
          required: "Password is required",
          minLength: {
            value: 10,
            message: "Confirm password must be at least 10 characters",
          },
          validate: (value) =>
            value === getValues("password") || "Passwords must match",
        }
```

Now we're only using React Hook Form here for registering (`register`), not for validation. 
Everything else stays the same, `isSubmitting`, `errors`, `handleSubmit`, `onSubmit`, all of this stays the same. 

Now we have our schema (our validation) centralized in one place, one source of truth that we can then use in other places as well. 

How do we do that with confirming that this password is the same as this one in Zod? 

In Zod we get a `refine` method (`.refine()`). 

After `object` here, we get all the `data` of the form here, and we can just check if `data.password` is going to be the same as `data.confirmPassword`. 

`form-with-react-hook-form-and-zod.tsx` fragment
```tsx
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, "Password must be at least 10 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, )
```

Now when that's not the case, we do want to show an error. 
We need to connect that to some field in `input`s. 

In `input` we were using the `confirmPassword`, so here to connect that with Zod, we do need a second option here, and that's going to be a message `"Passwords must must match"`, but then we also want to connect it to some field, in Zod we use `path` for that,  and then it's actually an array `path: ["confirmPassword"]`, because it could be connected to multiple inputs. 
But here we only want it for `confirmPassword`.

`form-with-react-hook-form-and-zod.tsx` fragment
```tsx
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, "Password must be at least 10 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
})
```


This is Zod,  this is not connected to React Hook Form yet. Now how do we connect this with all the validation now to this form? 

When we invoke this `useForm()` hook, we can specify some options here `useForm({ })`and we can have a `resolver:` and specifically it's going to be the `zodResolver`.
We can import that `zodResolver` so from that `"@hookform/resolvers/zod"`. 

Then we can have multiple schemas e.g. `resolver: zodResolver(signUpSchema)`.
We can also have `signInSchema`.
In a real app we will actually have quite a few schemas, so we need to specify which schema should be used for this form.

We can by the way also remove `getValues` which we were destructuring from `useForm()`, we were using that for making sure that the passwords match. 
Instead we are doing that now in Zod. 

Now we have connected Zod to our form using resolver.

`form-with-react-hook-form-and-zod.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Now let's see if it still works the way we want it to work. We submit the filled out form now, let's say password is not at least 10 characters, let's also make sure `password` and `confirmPassword` does not match. 
Now if we submit here we can see we actually get two errors `"Password must be at least 10 characters"` and `"Passwords must match"`. The errors are correct. We get the errors the way that's supposed to work.

If we submit the correct data (matching passwords, at least 10 characters), we do not see any errors, that is correct. Everything works, the form is resetting (cleaning after the from is submitted). Everything still works the way it's supposed to work. 

Now we have one central place for all the validation here with Zod. 


#### TypeScript type out of signUpSchema (Zod), `TSignUpSchema` 

One more thing we want to do here is we actually can create a TypeScript type out of this and this `signUpSchema` is just a JavaScript runtime variable as it called, but we can also create a type out of this.

We can say something like `type SignUpSchema`, and we can use `z.infer`, 
`type SignUpSchema = z.infer<typeof signUpSchema>;`
it will take this `signUpSchema` and create a TypeScript type out of that .

Why do we want that type?

Now we can also specify what the type of the form will be.
We can use that, we can specify that here with angled brackets, we can tell TypeScript this form is going to be of type `SignUpSchema`:
```tsx
  } = useForm<TSignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });
```

Why is this beneficial, why do we need this?

Now for example if we try to register something here with the wrong name: 
`<input {...register('email742')}`
 TypeScript will tell us this is not correct, because according to the schema we only have `email`, `password` and `confirmPassword`, not `email742`. 
 if we remove usage of this type `useForm<TSignUpSchema>` we don't get a warning in place where we try to use `email742` -> `<input {...register('email742')}`. We add some more type safety this way. 

Now when the data is properly validated, TypeScript will also know that that `data` is going to be of that particular sign-up schema type `TSignUpSchema`, not `FieldValues`
`const onSubmit = async (data: FieldValues)`, this `FieldValues` is very general, almost like `any` type.

`form-with-react-hook-form-and-zod.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


const onSubmit = async (data: FieldValues) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Now we can be more specific, now here if we do it in line:
instead of `<form onSubmit={handleSubmit(onSubmit)}`
we do `<form onSubmit={handleSubmit(e => )}`, now if we hover on `e`, we can see in Intellisense dialog that TypeScript knows now it's going to be object with `email`, `password`, `confirmPassword`.
```js
(parameter) e: {
  email: string;
  password: string;
  confirmPassword: string;
}
```


Right now, instead typing `data: FieldValues`, we can type this now as `data: TSignUpSchema`

It is not a good practice to name the type describing a schema `SignUpSchema` almost the same as schema itself `signUpSchema`, this is almost the same. It is good to add `T` in front of a type variable name to indicate that this is a type -> `TSignUpSchema`.
When we have a close name it is a good practice to add that `T` in front of the type name.

In case of an` interface`, we could be adding `I` in front of a name of interface.

`form-with-react-hook-form-and-zod.tsx`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

type TSignUpSchema = z.infer<typeof signUpSchema>;

export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


//const onSubmit = async (data: FieldValues) => { // <- instead of
const onSubmit = async (data: TSignUpSchema) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


Now we have a pretty sophisticated setup here, and we are properly validating here with types on the client-side.


#### Refactoring, moving schema to `types.ts`

Now we may want to use the exact same setup for validation also on the server or somewhere else.

```tsx
const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

type TSignUpSchema = z.infer<typeof signUpSchema>;
```


We don't necessarily want to define all of this `signUpSchema` here in the form (as here e.g. in `form-with-react-hook-form-and-zod.tsx`). 

Now let's refactor a little bit. It makes sense to put this in its own file.

Typically in our app we do want to have some kind of `/library/` folder with utilities and one of the things we also want to have there is a file for the types `types.ts`.

It makes sense that we also put the schema of Zod in there.
Let's just copy this, remove it from this `form-with-react-hook-form-and-zod.tsx` file   and put that in `types.ts`. We need to import Zod in `types.ts`, as well as

We need to `export` this` const signUpSchema` so we can use it in other files. 

Now it should work. We should not get any errors in these. Everything is working again. 

`types.ts`
```ts
import { z } from "zod";

export const signUpSchema = z // <- needed to add export to use in other files
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

export type TSignUpSchema = z.infer<typeof signUpSchema>; // <- needed to add export to use in other files
```


`form-with-react-hook-form-and-zod.tsx` with schema moved to `types.ts`
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
//import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types"; // <- import added from types.ts



// signUpSchema and TSignUpSchema moved to types.ts



export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


//const onSubmit = async (data: FieldValues) => { // <- instead of
const onSubmit = async (data: TSignUpSchema) => {
  // send (submit) to server
  await new Promise((resolve) => setTimeout(resolve, 1000));

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```



### Adding server errors (validation using Zod on the server)

There's one more thing we have to do here, which is actually submit it to the server and then if the server returns errors, we also want to output that on the page. 

We sort of need to integrate React Hook Form here with any server errors. 

And we can use our Zod schema on the server as well. 

Let's quickly Implement some server-side functionality as well. 

We are using the new Next.js App Router here and in there we can just create an `/api/` folder and in there will be let's say the `/signup/` route (folder). Inside the `/signup/`folder we create `route.ts` file.

Here in `route.ts` since it will be a post request (because we're signing up somebody so it's going to be a post request), we want to add something to the user resource in a database. 

Here we got `request` of type `Request`.
We want to be able to submit the data to this route
and then we can extract the data here the `body`, we can say `await request.json();`.
Then we're going to validate that,

`route.ts`
```ts
import { NextResponse } from "next/server";

export asyync function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({});
}
```


This is where we're going to send the data to so let's actually try doing that.
Now we can actually send that it's not just mocking it (with `setTimeout`). 

We can use `fetch()` and we want to `await` that, route is going to be `'/api/signup'`.
We need to define `method`, `body` and `headers` when we are using Fetch API.

```tsx
  await fetch('/api/signup', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-Type": "application/json",
    },
  });
```

This will send the data to this route here. 

`form-with-react-hook-form-and-zod-and-server.tsx` with schema moved to `types.ts`, now we are using Fetch API to POST the data to the server on some defined route.
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
//import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types"; // <- import added from types.ts



// signUpSchema and TSignUpSchema moved to types.ts



export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


//const onSubmit = async (data: FieldValues) => { // <- instead of
const onSubmit = async (data: TSignUpSchema) => {
  // send (submit) to server
  //await new Promise((resolve) => setTimeout(resolve, 1000)); //<- removed mocking
  await fetch('/api/signup', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-Type": "application/json",
    },
  });

  reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```

`types.ts` (no changes)
```ts
import { z } from "zod";

export const signUpSchema = z // <- needed to add export to use in other files
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, { 
    message: "Passwords must match",
    path: ["confirmPassword"],
})

export type TSignUpSchema = z.infer<typeof signUpSchema>; // <- needed to add export to use in other files
```


#### Validation using Zod on the server

This will send the data to this route here. 

`route.ts`
```ts
import { NextResponse } from "next/server";

export asyync function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json({});
}
```

Then we can grab the data from `body` here and now we want to validate this again on the server, because we cannot really trust anything coming from the client. 

By default TypeScript actually types `body` as `any`. 
We actually want to type this as `unknown` because we don't know what it's going to be, or at least we have to assume we don't know what it's going to be. 


Now we can use our Zod schema that we already created, we can reuse it now. 
This is our source of truth. 
We can just use that `signUpSchema`. We can import that. 

We can do two things: 
- we can do `.parse(body);
- the alternative is use `safeParse`, which doesn't throw an error if there is something wrong ->

->  In that case we can just use `result`, we can check if the result is successful or not. If it's not successful, we can grab some errors result 

`route.ts`
```ts
import { signUpSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export asyync function POST(request: Request) {
  const body = await request.json();

  const result = signUpSchema.safeParse(body);
  if (!result.success) {
  
  }
  
  return NextResponse.json({});
}
```


Now let's actually think about what we want to do here. 

Here (inside `onSubmit` in `form-with-react-hook-form-and-zod.tsx` file), here on the client when we fetch we get a `response`.

Here we also need to await the `response` which we then convert to json,
`const responseData = await response.json();`

Below, typically we want to check for the `ok` property, response status is not in a 200 range, so it could be `404` here that will cause that alert below. 


Now how about we actually get errors that have to do with validation? 

We can just check if it has errors `if (responseData.errors) {`, we can then use React Hook Form here to output these errors. 
What we want to be able to do is something like this, so we can just grab the errors `const errors = resonseData.errors;`.
There is an email property in that errors object `if (errors.email) {`
inside this clause we can set the error in React Hook Form.
React Hook Form also gives us this function `setError()`, we haven't used yet, so let's actually import this (destructure that) from the `useForm` hook (`// <- (sic) setError destructured from useForm, React Hook Form`).
Here in `setError("")` we can specify for which fields there is an error. 
Let's say here there's an email problem (`setError("email", {`). 
We need to specify the type of error, here server (`type: "server",)`
Then we just want to grab the message (`message: errors.email,`). 

`form-with-react-hook-form-and-zod-and-server.tsx` with schema moved to `types.ts`, now we are using Fetch API to POST the data to the server on some defined route.
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
//import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types"; // <- import added from types.ts



// signUpSchema and TSignUpSchema moved to types.ts



export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
    setError, // <- (sic) setError destructured from useForm, React Hook Form
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


//const onSubmit = async (data: FieldValues) => { // <- instead of
const onSubmit = async (data: TSignUpSchema) => {
  // send (submit) to server
  //await new Promise((resolve) => setTimeout(resolve, 1000)); //<- removed mocking
  const response = await fetch('/api/signup', {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  if (!resonse.ok) {
    // response status is not 2xx (in 2xx range, so it could be 404 here that will cause that alert below)
    alert("Submitting form failed!");
    return;
  }

  if (responseData.errors) {
    const errors = resonseData.errors;
    if (errors.email) {
      setError("email", {
        type: "server",
        message: errors.email,
      }); // <- setError destructured from useForm, React Hook Form
    }
  }
  // reset below has been temporarly commented out only in this step
  //reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


This is basically what we want to be able to do here on the client. 

We are going to comment out the `reset();` here, because this reset will immediately remove the `errors` as well -> (`// reset below has been temporarly commented out only in this step`). 


Now we can go to our route (in `route.ts`). 
If we parse this according to our schema and there are there are errors, what we can do here, we go over each issue that was found during parsing.

We actually get a good suggestion here from Github Copilot (`zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };`). 

`route.ts`
```ts
import { signUpSchema } from "@/lib/types";
import { NextResponse } from "next/server";

export asyync function POST(request: Request) {
  const body = await request.json();

  const result = signUpSchema.safeParse(body);
  let zodErrors = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
    });
  }
  
  return NextResponse.json(
    Object.keys(zodErrors).length > 0
      ? { errors: zodErrors }
      : { success: true }
  );
}
```


Now for each issue we're creating these objects `let zodErrors = {};` and then we can send that to the client `return NextResponse.json({});`. 

We can check if this object is empty or not. We can do that with `Object.keys(zodErrors).length > 0`
Basically it creates an array of every key, if the length of that is more than zero, it means there was an error. 
If that `Object.keys(zodErrors).length > 0` is true, we will send an object with errors being the `zodErrors` - (`? { errors: zodErrors }`), 
and otherwise (there was no problem), we will send an object with success as true (`: { success: true }`). 


Now let's also modify the body:
`form-with-react-hook-form-and-zod-and-server.tsx` fragment
```tsx
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    })
```


`form-with-react-hook-form-and-zod-and-server.tsx` with schema moved to `types.ts`, now we are using Fetch API to POST the data to the server on some defined route.
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
//import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types"; // <- import added from types.ts



// signUpSchema and TSignUpSchema moved to types.ts



export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
    setError, // <- (sic) setError destructured from useForm, React Hook Form
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


//const onSubmit = async (data: FieldValues) => { // <- instead of
const onSubmit = async (data: TSignUpSchema) => {
  // send (submit) to server
  //await new Promise((resolve) => setTimeout(resolve, 1000)); //<- removed mocking
  const response = await fetch('/api/signup', {
    method: "POST",
    //body: JSON.stringify(data),
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    }),
    headers: {
      "content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  if (!resonse.ok) {
    // response status is not 2xx (in 2xx range, so it could be 404 here that will cause that alert below)
    alert("Submitting form failed!");
    return;
  }

  if (responseData.errors) {
    const errors = resonseData.errors;
    if (errors.email) {
      setError("email", {
        type: "server",
        message: errors.email,
      }); // <- setError destructured from useForm, React Hook Form
    }
  }
  // reset below has been temporarly commented out only in this step
  //reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```




#### simulating an error, injecting a `number` into POST submitting to the server, instead of a `string`

Okay, now how do we test this?

Let's simulate the error given by the communication issue.
In this scenario client-side validation is satisfied, but there will be an error occurring in between client-side validation (validated without problems) and before server-side validation. Server should return the error with it's validation mechanism.

In place of  `confirmPassword: data.confirmPassword`, we make a mistake, some random number here `confirmPassword: 82634691901`

Now if we fill out and submit the form according to the validation rules (same `password` and `confirmPassword`, length at least 10 characters), so it will pass the client-side validation.

It passes client-side validation, so we get the `data: TSignUpSchema` here for `onSubmit`.  

Now if we submit, it's going to take a second, and we actually see an error message in UI, now coming from the server and saying something like `"Expected string, received a number"`, that's because here of course we are passing a `number` here `confirmPassword: 82634691901`, and it should be a `string`.


SIMULATING ERROR, `form-with-react-hook-form-and-zod-and-server.tsx` with schema moved to `types.ts`, now we are using Fetch API to POST the data to the server on some defined route.
```tsx
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
//import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types"; // <- import added from types.ts



// signUpSchema and TSignUpSchema moved to types.ts



export default function FormWithReactHookFormAndZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    //getValues, // <- removed
    setError, // <- (sic) setError destructured from useForm, React Hook Form
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });


//const onSubmit = async (data: FieldValues) => { // <- instead of
const onSubmit = async (data: TSignUpSchema) => {
  // send (submit) to server
  //await new Promise((resolve) => setTimeout(resolve, 1000)); //<- removed mocking
  const response = await fetch('/api/signup', {
    method: "POST",
    //body: JSON.stringify(data),
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      //confirmPassword: data.confirmPassword,
      confirmPassword: 82634691901, // <- simulating error server-side
    }),
    headers: {
      "content-Type": "application/json",
    },
  });
  const responseData = await response.json();
  if (!resonse.ok) {
    // response status is not 2xx (in 2xx range, so it could be 404 here that will cause that alert below)
    alert("Submitting form failed!");
    return;
  }

  if (responseData.errors) {
    const errors = resonseData.errors;
    if (errors.email) {
      setError("email", {
        type: "server",
        message: errors.email,
      }); // <- setError destructured from useForm, React Hook Form
    }
  }
  // reset below has been temporarly commented out only in this step
  //reset(); // to reset the form we call reset(); from React Hook Form
}

  return (
    {/*<form onSubmit={handleSubmit(data =>)} className="flex flex-col gap-y-2"> */}
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
    
      <input 
        {...register('email')}
        type="email"
        //required    
        placeholder="Email" 
        className="px-4 py-2 rounded" 
      />
      {/* here we render errors on the page */}
      {errors.email && (
        <p className="text-red-500">{`${errors.email.message}`}</p>
      )}
      <input 
        {...register('password')}
        type="password"
        //required
        placeholder="Password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.password && (
        <p className="text-red-500">{`${errors.password.message}`}</p>
      )}
      <input
        {...register('confirmPassword')}    
        type="password"
        //required
        placeholder="Confirm password"
        className="px-4 py-2 rounded"
      />
      {/* here we render errors on the page */}
      {errors.confirmPassword && (
        <p className="text-red-500">{`${errors.confirmPassword.message}`}</p>
      )}
      <button
        disabled={isSubmitting}
        type="submit"
        className="bg-blue-500 disabled:bg-gray-500 py-2 rounded"
      >
        Submit
      </button>
    </form>   
  ); 
}
```


