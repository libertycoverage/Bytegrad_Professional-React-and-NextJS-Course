## V EXTRA3 Connected to V261 V262 Use type ‘unknown’ instead of type ‘any’ in TypeScript (Try / Catch error handling)
https://www.youtube.com/watch?v=-bmNkTqvYfQ


### data: unknown

You will run into the `unknown` type more and more these days because sometimes in an app we don't really know what the type of data is going to be.

For example here when we are fetching data from some API, we are going to parse that as JSON, and then we get the `data`, but we don't really know what this data is going to be

`page.tsx`
```tsx
export default async function ProductPage() {
  fetch("https://dummyjson.com/products/1")
    .then((res) => res.json())
    .then((data) => console.log(data));

  return <main></main>;
}
```

We could look it up, we could go to this website, we could check it, we could have an expectation of what the data is going to be, but we don't really know for sure.

This website could technically return anything, there could also be a mistake on their part, or it could change over time.

We don't really know for sure what this `data` variable is going to be. 

When you hover over `data`, we can see that by default TypeScript actually types this as `any`, which is not really what we want.

We don't want to have `any`s in our code base because with `any`, anything goes, we can do anything we want and it's not really as precise as we can be. 

A better thing to do here would be to type this as `unknown`.

`page.tsx`
```tsx
export default async function ProductPage() {
  fetch("https://dummyjson.com/products/1")
    .then((res) => res.json())
    .then((data: unknown) => console.log(data));

  return <main></main>;
}
```


Now it's typed as `unknown` and we'll take a look at what that means and how we can work with this.

But this is a better way of typing the data that we get when we fetch data from some API.

This is getting more and more common these days so we have to know how to deal with this `unknown` type. 


### ts-reset

If we don't want to type this manually every time we do a `fetch` or we're afraid that we're going to forget it, there is actually a library called `ts-reset` by Matt Pocock and this library will make it, so that if we have that `.json()` in fetch it will give us an `unknown` type.

https://github.com/total-typescript/ts-reset

It shows us that if we have a fetch here and we have `.then` and then we do `res.json`, we parse it as `json`, the variable that we get here will be typed as a `unknown`.

Typescript by default types it as `any`.

example from author's documentation https://www.totaltypescript.com/ts-reset
```js
// Import in a single file, then across your whole project...
import '@total-typescript/ts-reset'
// .filter just got smarter!
const filteredArray = [1, 2, undefined].filter(Boolean) // number[]
// Get rid of the any's in JSON.parse and fetch
const result = JSON.parse('{}') // unknown
fetch('/')
  .then((res) => res.json())
  .then((json) => {
    console.log(json) // unknown
  })
```


### error: unknown

Another very common source of that `unknown` type is when we deal with errors. 

Not the most exciting topic but as a professional developer you do need to know how to do this try catch statement. 

For example so here we have a simple example.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  await resend.emails.send({ 
    from: "Contact Form <onboarding@resend.dev>",
    to: "bytegrad@gmail.com",
    subject: "Message from contact form",
    html: "<p>Hello</p>",
  });
};
```

We are using the Resend library to send an email. This is just a service that we can use to send an email and that could go wrong.

We want to wrap this in a `try catch` here. 

We are going to attempt to send an email and `try`, but if something goes wrong we want to `catch` the error. 

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    //console.log(error.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```

Here what's going to happen is we are going to invoke this `send` method from Resend, but that `send` method could throw an error, right that's what we're catching here `catch (error) {`

These days (2023/2024) TypeScript types it `error` as `unknown`. 
In the past by default TypeScript typed this as `any`. 

We need to know how to deal with this because this `try catch` is very common and typically what we want to do here is we want to extract some kind of message. 

Let's actually try logging `error.message` and when we do this TypeScript actually starts to complain and it says `error` is of type `unknown`. 

That's because we're trying to access `.message` on `error` here but we don't know if error is actually going to be an object that actually has message, because in JavaScript we can throw anything. 

### throw 5 (example, access something on number 5)

This Resend library technically could throw for example the number five `throw 5;` and if we have a `throw` statement like this in a `try` block, we can throw something and that will be the value that you we here in `catch`.

Now we're now trying to access that `message` on the number `5` right which is not possible. This doesn't exist on the number `5`.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });

    throw 5;
  } catch (5) {
    console.log(5.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```

### example, throw a string

This library could also simply `throw` a `string`.

Now we're trying to do `error.message` on some string. That's also not possible.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });

    throw "some problem";
  } catch (error) {
    console.log(error.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```

### example, throw an object literal

We could also `throw` an object literal.

We have an object literal which means literally creating an object with the curly braces. Maybe they are actually throwing an object with for example the `message` property.
In that case this `console.log(error.message);` will actually work.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });

    throw {
      message: "This is a test error", // this will work with error.message
    }
  } catch (error) {
    console.log(error.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```

They may only have `statusCode` as a property for example or other properties but not `message`.

We can `throw` an object literal like this.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });

    throw { // <- this is object literal
      //message: "This is a test error", // this will work with error.message
      statusCode: "This is a test error",
    } 
  } catch (error) {
    console.log(error.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```


Now typically though, what we see is `new Error()`. 

We can also create an object with this `new` keyword and then some constructor e.g. `Error()`, function or class. 

intellisense on `Error()` in `new Error()`
```js
var Error: ErrorConstructor
new (message?: string | undefined, options?: ErrorOptions | undefined) => Error (+1 overload)
```

What we can pass in here `Error()` is actually a message, here we could say "something went wrong". 

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });

    throw new Error("something went wrong");
  } catch (error) { 
    console.log(error.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```

When we do it like this `new Error("something went wrong")`, what we are going to get with `new Error()` is basically an object with that `message` that we pass. 
`message` property and then the value that we pass in like this `"something went wrong"`.

```tsx
    // this { } below is object literal
    throw { // <- this is what we really get doing the above `new Error()`
      message: "something went wrong", 
    };
```

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });

    //throw new Error("something went wrong");
    throw { // <- this is what we really get doing the above `new Error()`
      message: "something went wrong", 
    }; // <- this is object literal
    
  } catch (error) {
    console.log(error.message); // error.message gives of course red squiggly lines, we try to access smth that does not exist
  }
};
```

That's how errors work in JavaScript.

So in JavaScript we can create an object literal, literally with curly braces.
Or we can create an object with `new` and then some constructor function e.g. `Error()` or class. 
And then we also get an object, 
and specifically we are going to get an object that implements the the blueprint that this class or constructor function has specified. 

Basically we're throwing an object here and this object will actually have a message property. 

This `new Error()` will instantiate a new object with the `message` property having this value e.g. `"something went wrong"`.


We don't know if this Resend library (this is a third-party library), it's going to throw an object like that. 

Technically they could be throwing anything. 


### Handle unknown

So how do we properly deal with these `unknown`s in our code base?

Let's say we want to extract a `message` here.

Let's create a variable here `message`, and then we just need to do some checking here, we can check if this `error` is that actually an `instanceof` that `Error` class or constructor that we just saw. 

If that is the case we can actually just use `error.message`, because this if we instantiate it with `new Error()` like this, we will actually get an object that will have that `message` property. 

Here below we can see that TypeScript doesn't complain anymore because it knows if this condition passes `if (error instanceof Error)`, we can safely access the `message`property here.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    let message;

    if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }
  }
};

{
  message: "some message"
}
```

But remember we could also throw not with `new Error()`, but just an object literal, maybe this has a `message` in there with `"some message"`. 

If it's an object literal, it's not going to be an `instanceof` that `Error` class, so we need to check for that separately. 

So we can check `else if` (`typeof` this error is strictly equal `===` to `object` and it has that message property, we also want to make sure that `'message'` is `in error`.)

We check if object has a `message` property, because it could be in an object without message in there. 

If we do this we actually get TypeScript complaining (red squiggly lines on `error` in here `'message' in error`),  intellisense is saying `error is possibly null`. 

We cannot check if something is in `null`.

JavaScript is a bit strange so a `null` is actually also object. That's why here it could technically still be `null` here `typeof error === 'object' && 'message' in error`, when we try to check if it's in error here, so we also just can simply check does this error even exist `error &&` (in the beginning).

So if error is not null (exists) and the type is object, and in that object we have the message property, then we can still extract `error.message`



All right so now we have the `instanceof Error` and now we have also, if it's just an object literal that they're throwing or some other object that's not an instance of error, but they could also throw a message just as a `string`, they could also just do `typeof error` if it's just a `string` it can be just the actual message itself, then we can just immediately assign the `error`.

They could `throw "some problem"`, just a `string` with the message, so we can just assign that to `message`. 

And then also what we can do here, if all of these checks fail, we just want to assign a default value to `message`. Typically this is called `"Something went wrong"` and we can add something like `"try again"`. 


-----

Because what we are writing is a so-called `Server Action` in Next.js. We are using the latest Next.js features here. 


Basically what's going to happen is this `sendEmail` is going to be a function that runs on the server, from the client we're calling this function `sendEmail` and it's going to attempt to send an email. If that fails somehow ,we want to return a message to the frontend so we can output something to the user, "Something went wrong" or some more specific message that we get from the `Error`. 

We want to return something to the client here, we want to return an object to the client with just let's say a `message` that's going to be this `message`.


`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    let message;

    if (error instanceof Error) {
      message = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      message = error.message;
    } else if (typeof error === 'string') {
      message = error;
    }

    return {
      message: message,
    }
  };
};

```

In JavaScript if we have the same identifier for `key` and `value`, we can just write it like that

```tsx
    // this is the same syntactically

    return {
      message: message,
    }

    return {
      message,
    }
```

Now we have a pretty safe way of extracting the message from the `Error`.



### Utility function


We are doing this in one server action here (`sendEmail`), but typically we're going to have other functions that we want to run on the server, 

it would be nice if we could reuse this `if (error instanceof Error) { (...)`

Let's quickly extract this into its own utility function right.

We could put it in a in a `utilities.ts` file. We will do it in the same file for now.


`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const getErrorMessage = (error: unknown) => {
  let message;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return message;
}

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    }
  };
};

```


Type of the error on the input of that function it's going to be `unknown.`

We want to call that function 

If there is an error we want to return this object `return { message: message, }` to the client with message in there and then we're going to call that function 

We're going to call that function, we're going to pass the error in there `getErrorMessage(error)`. At this point we still don't know what it's going to be, so the `error`'s type is `unknown`, but this function `getErrorMessage` will extract the `message` from there, that will be returned at the end `return message;`.

The `message` will be returned and that's what we're going to set to the client.

`getErrorMessage` is a nice utility function.

Typically we don't type the return type of a function, but here it could be a good idea because here `message: getErrorMessage(error),` we actually want a `string`. 

Here we want to be very specific and explicit, this function should actually return a `string`.

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const getErrorMessage = (error: unknown): string => {
  let message;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return message;
}

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    }
  };
};

```

and when we do `: string` as the output type of the function `getErrorMessage = (error: unknown): string => {`, the TypeScript complains when we hover over `return message;` `"type unknown is not assignable to type string"`

This is not really helpful why does it think that it can still be type `unknown` by the time that we get here.

This is a bit strange, so we don't really know where this problem is coming from.

What can we do is just make it more explicit so here we can write `let message: string`  `message` should also be a string, 

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  return message;
}

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    }
  };
};

```

What can we do is just make it more explicit so here we can write `let message: string`  `message` should also be a string, 
and when we do that, we get another warning here `message = error.message;`, if we hover this we can now see there's something more specific `"Type 'unknown' is not assignable to type 'string'."` Now we can see that that `error.message` is could technically be type `unknown` 

Why is that?

Because here we have an object so 

For example if we have an object here with with the `message` property, it could have other properties of course. We could have `404` and then `message` property. That should work here.

`message` could be string `"Not found"`, it's also possible that `message` it's not a `string`,  it actually could be a number `5`.

This is an object.
if `error`, it exists,  it's not null,
`typeof error` is `object`,
and there is indeed a `message` property in here->  `message: "Not found",`
but here actually the value for that `message` is actually going to be a `number`, not a `string` as it should be.
This is pretty advanced stuff. 
What we want to do, is we want to make sure that we get a `string` here, so we can cast this to a `string`.
We can use String(), we can wrap `error.message` in there, and it will cast whatever this is to a `string`. If it's actually the `number` `5` it will make that a string `"5"` 

`action.ts`
```ts
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

{
  statusCode: 404,
  //message: "Not found",
  message: 5,
}

const getErrorMessage = (error: unknown): string => {
  let message: string;

  if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message); // addedd String()
  } else if (typeof error === 'string') {
    message = error;
  }

  return message;
}

export const sendEmail = async () => {
  try {
    await resend.emails.send({ 
      from: "Contact Form <onboarding@resend.dev>",
      to: "bytegrad@gmail.com",
      subject: "Message from contact form",
      html: "<p>Hello</p>",
    });
  } catch (error) {
    return {
      message: getErrorMessage(error),
    }
  };
};

```

This is already a little bit more advanced but now we're very precise with the types here, and this is going to reduce a lot of potential bugs in code 

Now we have a really nice clean way of extracting this `error` message, we can reuse this, we can put this in a utilities file and then reuse it whenever we have another Server Action.


