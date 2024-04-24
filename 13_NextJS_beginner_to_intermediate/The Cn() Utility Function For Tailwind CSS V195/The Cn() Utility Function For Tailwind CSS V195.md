## V195 The Cn() Utility Function For Tailwind CSS

Description:

Also here:
"cn() - Every Tailwind Coder Needs It (clsx + twMerge)" https://www.youtube.com/watch?v=re2JFITR7TI

A lot of people are using this cn() utility function when you work with Tailwind CSS

Why do we need anything else ( cn() )?

### Problem 1

Next.js

button.tsx

```tsx
"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  return (
    <button className="bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
  );
}
```

page.tsx

```tsx
import Button from "@/components/button";

export default function Home() {
  return (
    <main className="flex justify-center p-24">
      <Button className="bg-green-500" />
    </main>
  );
}
```

In the real world when you're going to use Button component for example here on a page.tsx you also want to have the ability to pass className prop to the component just like using className (styling it) on a native element `<button className="">`we want to be able to style it on our own custom React component

We want to override the default background color "bg-blue-500" on `<button>` passing a prop "bg-green-500" to the Button component.

We type prop as `React.ButtonHTMLAttributes<HTMLButtonElement>;` ButtonHTMLAttributes from React, we pass in HTMLButtonElement

It will allow us to pass any props here that will be accepted by the native HTML button element, className is one of them.

How do we add "bg-green-500" to `bg-blue-500 text-white py-2 px-4 rounded`?

Typically you would try something like this and change this to a template literal and try adding the className

button.tsx

```tsx
"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  return (
    <button className={`${className} bg-blue-500 text-white py-2 px-4 rounded`}>
      Submit
    </button>
  );
}
```

Now there is a conflict between `${className} bg-blue-500` where className is "bg-green-500"

The problem with Tailwind CSS is these conflicts are not predictable, we don't know the outcome.
It doesn't matter if you put this `${className}` at the front of the class list or at the end, in both cases when we have a conflict, we don't get the result that we expect (override).

In general people expect that if we put `${className}` at the end of the class list, this one wins if there is a conflict.

That's not the case by default, by default here we don't really know what's going to happen.

### twMerge

The solution for this is tailwind-merge
https://www.npmjs.com/package/tailwind-merge

It also solves some other problems

There is a complete separate video on this "Tailwind-Merge Solves 3 Big Problems & Mistakes in Tailwind CSS" https://www.youtube.com/watch?v=yeFkc7Wu1nU

We are gonna install
$ npm i tailwind-merge

We get from this package a function called twMerge

We're going to wrap this entire string in this function. We're calling function twMerge and passing base classes as the first argument, the second argument can be the className.

The benefit of doing this is now when there is a clash (we have a clash "bg-blue-500 "bg-green-500"), we can now be assured that "bg-green-500" will win which is what we want. We expect to override the base classes when we put in a className like this as a prop. When it comes later it will actually win.

button.tsx

```tsx
"use client";

import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  return (
    <button
      className={twMerge("bg-blue-500 text-white py-2 px-4 rounded", className)}
    >
      Submit
    </button>
  );
}
```

page.tsx

```tsx
import Button from "@/components/button";

export default function Home() {
  return (
    <main className="flex justify-center p-24">
      <Button className="bg-green-500" />
    </main>
  );
}
```

There can be other conflicts as well, e.g. we have padding py-2 and padding px-4. What will happen if we pass in p-5 as className prop (`<Button className="p-5"`)? (btw. "p-5" means that on all sides the padding should be 5). We have some other classes "py-2 px-4", they conflict in a way with "p-5", the class names are slightly different, tailwind-merge will make sure that that conflict is also resolved intelligently.

### Problem 2

The second problem we are going to run into in the real world is when we have conditional classes, we may have some kind of pending state, depending on the pending state we may want to change the background color, we can do that with tailwind-merge.

We have our base classes in this first string as the first argument, we got the className as a prop as the second argument, now we can have another argument, conditional class, if pending is true it should become "bg-gray500". Depending on whether pending is true or false, this "bg-gray500" will be applied or not.

button.tsx

```tsx
"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      className={twMerge(
        "bg-blue-500 text-white py-2 px-4 rounded",
        className,
        pending && "bg-gray500"
      )}
    >
      Submit
    </button>
  );
}
```

### Object syntax

tailwind-merge is a really handy library

There's one downside, or at least some people think it's a downside, which is that you cannot use an object for these conditional classes as with e.g. `pending && "bg-gray500"`

What some people want to do, is instead of passing this `pending &&`, **some people want to do an object here**, basically as a key the string that we want to apply with the Tailwind classes depending on the value of some variable,

**this is not possible here with tailwind-merge**

```tsx
{
  "bg-gray-500": pending,
}
```

button.tsx

```tsx
"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      className={twMerge(
        "bg-blue-500 text-white py-2 px-4 rounded",
        className,
        //pending && "bg-gray500" )}>
        {
          "bg-gray-500": pending, // red underline, making an object, that is not possible with tailwind-merge
        }
      )}
    >
      Submit
    </button>
  );
}
```

**However it is possible with a library clsx** https://www.npmjs.com/package/clsx

clsx solves that problem of conditional classes, we can actually pass this with objects, we can run it like that

```tsx
{
  "bg-gray-500": pending,
}
```

clsx does not solve the other problems, when you have conflicting styles (override CSS classes) clsx doesn't help with that

what the author of tailwind-merge has suggested, is that if you really want to use that object style,
you can use clsx and tailwind-merge together, you can first pass everything to clsx and then the result of that you pass to twMerge,

[dcastil](https://github.com/dcastil)[on Aug 26, 2022](https://github.com/dcastil/tailwind-merge/discussions/137#discussioncomment-3482513)
Thanks for your point of view on this! I'll think about this. 🤔
You can also make twMerge accept objects by wrapping it with your own function for the time being.

```js
import { twMerge as twMergeOriginal } from "tailwind-merge";
import clsx from "clsx";

export function twMerge(...args) {
  return twMergeOriginal(clsx(args));
}
```

this is basically the cn() utility function...

### cn() utility function

...this is basically the cn() utility function, it has been popularized recently by shadcn/ui library

how to implement that?

Now we're going to combine clsx and tailwind-merge so we also get that object's possibility

We are going to install clsx

$ npm install clsx

Now instead of using `pending &&`(some people don't like this syntax, some people really want to use this object syntax, which is not possible in tailwind-merge alone), we're going to replace this with the cn() utility function which we're going to create now

button.tsx

```tsx
"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      className={cn(
        "bg-blue-500 text-white py-2 px-4 rounded",
        className,
        //pending && "bg-gray500" )}>
        {
          "bg-gray-500": pending, // making an object, that is not possible with tailwind-merge alone, that is why we are using cn() function, now that works
        }
      )}
    >
      Submit
    </button>
  );
}
```

let's put that cn() function in a utilities file

cn() needs to use that twMerge function, but before we do that, we want to pass everything to clsx, so we can use that object syntax, and then the result of that will be the argument for twMerge

utils.tsx

```tsx
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

The input of this function here when we call this cn() ->

- first it's a string, e.g. `"bg-blue-500 text-white py-2 px-4 rounded"`
- then `className`, which could be a string, but now we also have an object, so we also should be able to pass an object here in className prop
- then of course we have the object here `{"bg-gray-500" : pending,}` for a conditional class, or multiple conditional classes

we have these inputs in cn(inputs) but we're using TypeScript, we need type (because we have different types here)

clsx actually also gives us the type that we can use here and these are all ClassValue

all these `inputs`, we're going to wrap them up in an array, so we can use this rest parameter syntax (triple dots, spread operator) here, which will put everything in an array, then we can say the inputs here is basically an array of `classValue[]`, then we pass the inputs to `clsx` function

1. the inputs will go through clsx, which makes the object syntax possible
2. then the result of that will be passed to twMerge, which will merge conflicting classes intelligently
3. return keywords, make sure you return whatever the result is

Now we can import cn() wherever we are using it `import { cn } from "@/lib/utils";`

The final formats of this function and also an example of how you would use that in this syntax:

button.tsx

```tsx
"use client";

import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className }: ButtonProps) {
  const [pending, setPending] = useState(false);

  return (
    <button
      className={cn(
        "bg-blue-500 text-white py-2 px-4 rounded",
        className,
        //pending && "bg-gray500" )}>
        {
          "bg-gray-500": pending, // making an object, that is not possible with tailwind-merge alone, that is why we are using cn() function, now that works
        }
      )}
    >
      Submit
    </button>
  );
}
```

Typically what you also want to do, is to get other props, a Button component may also want to have for example `type="submit"`, other attributes that you would typically have on the button element, we also want to pass that through here as well `...props`.

```tsx
export default function Button({
 className, ...props  } : ButtonProps) {// <- we want other ...props here
```

We typically also want to put everything here `...props` maybe, we can call it props, and then we can just spread that here as well

```tsx
      )}
      {..props}
    >
      Submit
```

button.tsx

```tsx

"use client";

import { useState } from "react";
import { twMerge } from 'tailwind-merge';
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
 className, ...props  } : ButtonProps) {// <- we want other ...props here
 const [pending, setPending] = useState(false);

  return (
    <button className={cn(
      "bg-blue-500 text-white py-2 px-4 rounded",
      className,
      //pending && "bg-gray500" )}>
      {
        "bg-gray-500": pending, // making an object, that is not possible with tailwind-merge alone, that is why we are using cn() function, now that works
      }
      )}
      {..props}
    >
      Submit
    </button>
  );
}
```

page.tsx

```tsx
import Button from "@/components/button";

export default function Home() {
  return (
    <main className="flex justify-center p-24">
      <Button className="bg-green-500" type="submit" />
    </main>
  );
}
```

To really make this Button reusable we also want to pass the ref for example, so we want to be able to pass a `ref`, and also children for example

page.tsx

```tsx
import Button from "@/components/button";

export default function Home() {
  return (
    <main className="flex justify-center p-24">
      <Button ref className="bg-green-500" type="submit" />{" "}
      {/* <- pass a ref */}
    </main>
  );
}
```

There is a separate video, (https://www.youtube.com/@ByteGrad/) on how to build a complete reusable Button component.
