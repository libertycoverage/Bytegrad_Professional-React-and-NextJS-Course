## V265 Complete Zod Tutorial (12 places for Zod in React / Next.js app, Frontend, Backend validation)
Description: Learn how to use Zod in full-stack Next.js apps.

also here: 
Zod Tutorial - All 10 places for Zod in your React / Next.js app
https://www.youtube.com/watch?v=AeQ3f4zmSMs


### Intro

When we are creating an application. we are going to have some instances, where we are going to get external data into our app, for example we may be fetching some data from a different server and the data that we get back may not be of the shape that we expect it to be. 
That can cause bugs in our app and fetching data is just one example, but **there are about 10 instances** where we want to be extra vigilant when it comes to getting external data into our app because the data that we get may not be of the shape that we expect it to be. 

We'll talk about what those 10 places are and it will be shown why TypeScript alone isn't enough and we probably want to use a schema validator like Zod. 


### Full-Stack Overview

Let's think about what we're doing when we're creating a full stack application. 

Let's think about validating external sources of data.

Now we are going to focus on React and Next.js but it will work the same in other technologies as well. Let's say we're creating a full stack Next.js application. 



### Front end: number 1 - 5 (These are the 5 major sources of external data that frontend is going to receive. )

#### API requests

We're going to have a frontend and we're also going to have a backend. 

Let's start with the frontend here. 
Where does a front end typically get external data from?

Very typically the frontend may fetch some data from the backend. 
The backend may send some data to our frontend, so from the perspective of the frontend there's external data coming into the app. 

The frontend will make an API request to get data from the backend. 

From the perspective of the frontend we're going to receive some external data from making API requests to our backend.


#### Third-party API

If we're creating an e-commerce website or application we may want to fetch product data from our own backend for example, but we can also get data from third-party APIs. 
Maybe we want to customize the website based on the user's location and maybe we use a third party API for that. 

We could also receive external data from third party APIs, and the data that we're going to get from a third party API may not be of the shape that we expect it to be and TypeScript alone will not protect us against that. 

We may want to use something like Zod to validate that the data that we get back from these API requests is actually of the shape that we expect it to be. 


#### Form data

Where else is our frontend going to get external data from?

Probably also from the user itself. The user can fill out a form. 
That's another source of external data 


#### localStorage, sessionStorage and other storage

Let's see where else on the frontend are we going to get external data from. 
We could also have localStorage. 

We do not manage localStorage ourselves, the browser manages that. 
There's also sessionStorage and other storage, but for simplicity here we'll just focus on localStorage. 
We may store something in localStorage and then later we want to grab it out of localStorage again, but we don't know for sure what we're getting back from that localStorage.
It's an external source of data, and before we deal with whatever we get back from localStorage, we may want to validate, that it actually has the shape of the data that we expected to have. 


#### URL

There's one more that's also a major source of external data and that's actually the URL. We can store data in the URL for example search parameters, 
`domain.com?id=5&color=blue` and we may store some data, maybe an `id` maybe a `color` parameter, and later we may read this data back into our application.

The URL is also an external source. 
We do not manage the URL ourselves, the browser does that.
The user could be changing things in the URL, so when we read data from the URL, we may want to validate that what we get in our application is actually the shape that we expect it to be, because if it's a different shape it may cause issues. 

It's not only search parameters, could also be path parameters. 




These are the five major sources of external data that frontend is going to receive and because they are external sources, there is less certainty that the data that we get from those sources is of the shape that we expect it to be.

TypeScript alone does not help us out against that. 

There will be an example of why TypeScript alone is not enough. 

We want to validate that what we get back from these sources is actually the shape, we expect it to be, so that's why people use schema validators. 


We'll use Zod, but there is also Yup, and they all have the same purpose, validating that the data is actually the shape that we expect it or want it to be.




Before we continue with the backend, let's actually take a look and see how this would work on the frontend.

Let's go over each one here and see why typescript alone is not enough and why we need a schema validator like Zod to validate the incoming data.


### Frontend: Example 1 - 2: API requests (validating with Zod)

Let's start here with the most common ones that's it's actually going to be API requests. 

We are going to make API requests to our own backend and this will be very similar as with third party APIs. 

We have a simple product component and this will fetch some data from our own backend.

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";

export default function Product() {
  useEffect(() => {
    fetch("/api/product");
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

We make an API request now, 

We are using Next.js here, these days we have client and server components, 

Previously we have learned that we can fetch data in server components and that's totally true, but there are still cases where we want to fetch data using the client. 

Just as a simple example, we could do that with `useEffect` right.

With `useEffect` we can fetch data, we can is Fetch API. 
Let's say we make an API request to our own backend to this route `"/api/products"`.


In Next.js it's very easy to quickly spin up our own backend route. 

Here we just created an API folder `src/app/api/product/` and then we can create a `route.ts` file. 

What this function `export async function GET(request: Request) {` will do is just return a product to our frontend.

Here we have a product object, it has a `name`, that's a `string` and a `price`  that's a `number`. That's what we're going to send back. 

`route.ts`
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    name: "Cool jeans",
    price: 100,
  };

  return NextResponse.json(product);
}
```

The backend here in this example, we'll send data to our frontend. 
That's what we're going to receive here on the frontend, at least that's what we would expect: 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then(product => {
        console.log(product.name.toUpperCase());
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

Here when we fetch `then`, we will eventually get a response `res`, the response will be in json format so we're going to **convert it from `json` format to a normal JavaScript format**
(data in `res` already comes as json format, then we convert it using `json()` function).

Then here we get the actual `data` we can call that `data` or `product `and then here we can do something with that `product` for example we may want to log the `name` of the `product` so we could say `product.name`. 
Maybe we want to uppercase the product name so on a string we can call `toUpperCase()`. This is a method that's only available on a `string`. 

Now when we do this we don't get any warning from TypeScript because, by default TypeScript types this return value from apis (here `product`) as `any`,
`any` means anything goes, basically no type safety. 

Why is that a problem? 
Because we know it's going to be a `name` as a `string` and since we know it's going to be a string we should be able to call `toUpperCase()`.

Now if we go to web browser's devtools, open up the console, if we reload the page we see in `console.log` `"COOL JEANS"`. There is no issue here, this is all working perfectly fine now. 

In the real world we may have different frontend and backend teams or you yourself may be changing things on the backend. The point is, on the back end we could be changing the shape of the data, or maybe somebody else that's also working on this project may change the shape of this product data. 

Instead of of having a `name` maybe this gets changed to having an `id` let's say:

`route.ts`
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    id: "1",
    price 100,
  };

  return NextResponse.json(product);
}
```

Now we have no `name` in the `product`. 

If we save here now and when we try fetching this data (in this case by refreshing the page in the browser) and accessing `toUpperCase()` in console log, we will run into major issues. 
Our application is crashing now, because we are trying to access` toUpperCase()` on `name` but `name` does not exist in our product object.

It existed before, but for whatever reason, and this happen sometimes in the real world, the shape of the data was changed and now we have an `id`, and not a `name`. 
TypeScript here did not warn us about this. 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then(product => {
        console.log(product.name.toUpperCase());
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


### False hypothesis
We could say that's because this is an `any` type, maybe we should type this as a `Product`, maybe we've learned don't have `any`s in our code base, we should actually type this as something else. 

Maybe we want to type this as a `Product` but this doesn't solve the issue, because if we have type `Product` here, we could say well this is going to be an object with a `name` and a `price` that's going to be a `number`. Before we had a name, that's a `string` right and a `price` that's a `number` - `name: "Cool jeans", price: 100,` 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";

type Product = {
  name: string;
  price: number;
}

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        console.log(product.name.toUpperCase());
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


So we could say well okay so this `product` here, that we're going to get back from the backend that's going to be of this shape (shape of `Product`). 

if we indeed return an object like that `const product ={ name: "Cool jeans", price: 100, };`, when we reload page, in console log in devtools, we don't get any errors, we still log it to the console. 

But again in the real world the backend may get changed over time, so instead of sending back a `name`, we may be sending back an `id` and actually an `id` is probably going to be a `number`. Maybe we are removing this `name` property and instead we're going to be returning an `id`.

`route.ts`
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    // name: "Cool jeans",
    id: "1",
    price 100,
  };

  return NextResponse.json(product);
}
```


Now even though here on the front end we have type this as `Product`, if we now refresh the `Product()` page, we can see we get an error. Our application will crash in practice, even though we have typed this with TypeScript 

TypeScript alone does not help us out here. 
Because TypeScript doesn't exist during runtime (sic!). 

it doesn't actually check what's going to be in this variable `product` here, because this all gets compiled (transpiled) into normal JavaScript. 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";

type Product = {
  name: string;
  price: number;
}

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        console.log(product.name.toUpperCase());
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


Here we are working in a `.tsx` file, this is TypeScript, it will be compiled, and it's continuously being compiled to normal JavaScript and then the application gets run. 
Right after compilation TypeScript oes not exist anymore, it doesn't actually look into the variable to see what's there during run time. 

TypeScript is helpful more for when we are actively developing here, where it's doing some static checks, but it doesn't help us out during runtime when when the actual data is being received from the backend. 

We are fetching data from our backend, but it works the exact same when we are fetching data from a third-party API. 

We can type this with TypeScript all we want, but during runtime in reality you don't know exactly what the shape of this data is going to be, and because of that we may accidentally crash our application, and that can be very damaging in practice. 

That's not what we want to do, we want to build robust web apps, that don't crash when they're getting some external data.


Now we could say we can solve this very easily with optional chaining `?`, 
If we do this, reload the page, we do not see any error.

`products.tsx`, optional chaining on `name`
```tsx
"use client";

import { useEffect } from "react";

type Product = {
  name: string;
  price: number;
}

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        console.log(product.name?.toUpperCase());
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


Optional chaining here will indeed stop our application from crashing, in case the name property isn't here. 
But what if the entire product isn't there? 
What if we actually don't return anything (in `route.ts`), and then we try to access `.name` on `product` the product (`product.name`) is empty let's say? 
Then also here we need to not forget to also have optional chaining here on the `product?` - `console.log(product?.name?.toUpperCase());`

This will only prevent our application from crashing, but what if we want to output a nice error message to the user? This does not help us with that and it's also just messy code. 

`products.tsx`, optional chaining on `name`, optional chaining on `product`
```tsx
"use client";

import { useEffect } from "react";

type Product = {
  name: string;
  price: number;
}

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        console.log(product?.name?.toUpperCase());
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


Another problem with optional chaining is, it doesn't really protect us from when the value actually does exist, but it's of a different shape. 

Here we may want to log the price let's say, but we only want to see the last two decimals.
If there are more decimals we just want to cut it off at the second one. This `toFixed()` is a method that we can use on `number` types not on other types. 

`products.tsx`, optional chaining on `name`, optional chaining on `product`
```tsx
"use client";

import { useEffect } from "react";

type Product = {
  name: string;
  price: number;
}

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        console.log(product?.name?.toUpperCase());

        console.log(product?.price?.toFixed(2));
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

So when we return this `price` and it's a `number`, if we now refresh the page, reloading the console log in browser's devtools, we will see we don't get any errors, this will work and we get `undefined`, because we're not returning a `name` (commented out). But we don't get any crashes, that's better.

`console.log()` output
```
undefined 
---
100.00
```

`route.ts`
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    // name: "Cool jeans",
    id: "1",
    price 100,
  };

  return NextResponse.json(product);
}
```


But what if this is actually a different type, so it actually exists (the price exists) but it's using a method `toFixed(2)` that does not exist on a `string` (`toFixed(2)` is a method we can use on a `number` type).

`route.ts`
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    // name: "Cool jeans",
    id: "1",
    price "$100", // this is now string
  };

  return NextResponse.json(product);
}
```

`toFixed(2)` is a method that we can use on the `number` type, even though we have used optional chaining here we now have crashed our application once more. 
To fix this we could go down the road of checking that the type of the `product` `price` is a `number` type of product, `price` is `number,` and then we can try to use this.

`products.tsx`, optional chaining on `name`, optional chaining on `product`
```tsx
"use client";

import { useEffect } from "react";

type Product = {
  name: string;
  price: number;
}

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        console.log(product?.name?.toUpperCase());

        if (typeof product.price === "number") {
          console.log(product?.price?.toFixed(2));
        }
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

So we could go down this route but we can already sense that this is very messy code, There's no logic or system in it and therefore this is not a robust solution for double-checking that the data that we get here is actually of the shape that we expect it to be. 


#### Solution to this messy code is a schema validator, idealistic example 

This is where a schema validator comes into place. 

A popular one now is called Zod, but there are other ones as well like Yup and they all have a similar function which is to simply validate the data. 

Whenever we have an external source of data, whether it's from the backend or a third-party API we may want to use Zod. 

Let's take a look at how we can Implement Zod here to verify that the `product` that we get here is actually of the shape that we expect it to be. 

We are going to install Zod here, 
`$ npm install zod`

and this is a runtime dependency, this is not a depth dependency, we will actually use this during runtime. 

Then here we can use Zod to validate the `product`. 
The way Zod works is we specify a so-called schema which is basically our expectation or how we want the data to be. 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";

type Product = {
  name: string;
  price: number;
}

const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
})

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        // use Zod to validate the product
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


Let's say we expect this data to be an object, so we say `z.object` and in that object `{}` we expect there to be a `name` and also a `price`. The `name` needs to be a `string()` and the `price` needs to be a `number()` and we can be more specific than that with Zod, we can say it should be `negative()`, `positive()` number.

Let's keep it a little bit simple here for no w, it should just be a number `price: z.number(),`

`import { z } from "zod";` 

Now we can run whatever we get back here `.then((product:` through that schema (`productSchema`) essentially. Zod will tell us if it's the correct shape or not. We can say `productSchema.parse(product)` - then we pass in that product. 
We use this variable, the schema `productSchema`, that we just created, the expectation of what we expect the shape to be. We can call `.parse` on that, and pass in whatever we want to check according to that schema.

Now if this whatever we pass in here `.parse(product)` does not adhere to that schema, so it turns out to be not the shape that we expect it to be, with the parse method it will throw an error. 
We can wrap that in a `try catch` and we can `catch` the error that way, or what people seem to prefer, is to use the other method here which is called `saveParse()`.
Here if this whatever we pass in does not adhere to that schema it will not throw an error it will just return a result here (here `validateProduct`) and that result will have a `success` property, so we can check the `success` property.  
If there is no success (`if (!validatedProduct.success) {`) we just want to log the `error`, because Zod will also give us nice error messages, and then we probably want to `return;` here to return out of this function. And otherwise there was a success, so it is actually the shape that we expected to be, and therefore we can now safely continue with this variable (`validatedProduct`).

After this check of success it's important that we continue with the variable that was actually checked by Zod

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";

type Product = {
  name: string;
  price: number;
}

const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
})

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      .then((product: Product) => {
        // use Zod to validate the product
        //const validateProduct = productSchema.parse(product);
        const validateProduct = productSchema.safeParse(product);

        if (!validatedProduct.success) {
          console.error(validatedProduct.error);
          return;
        }

        // use the validatedProduct
        console.log(validatedProduct.data.name);
        console.log(validatedProduct.data.price);
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

This `product` variable is unsafe. This  `product`  has not been checked yet, but this `validatedProduct` variable has been checked. 
So here we can safely use it to for example access the name (`console.log(validatedProduct.data);`). When we parse it with Zod, it will actually put it on a `data` property. Here if we want to access `name` it's `.data.name`. 
Or price `console.log(validatedProduct.data.price);`.
We actually get some nice auto complete here e.g. `.price` (Intellisense) with Zod as well so we see that we can access `name` and `price`.

These properties `.data.name` are typed properly e.g. `name` is typed as `string`, so if we try to do `toFixed(2)`, which is something we can do only on `number`s, we get a warning here (`console.log(validatedProduct.data.price.toFixed(2));`).
This is now properly typed as well. 

Here if we try to access `name` and we don't send `name` from the backend (backend is sending back an `id` and `price` - `name` is not on here), previously we were crashing our application, but now if we refresh `Product()` page, we can see our application doesn't crash and we should get an error from Zod.

`route.ts` - backend, returned data is of the wrong shape
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    // name: "Cool jeans",
    id: 1,
    price "$100",
  };

  return NextResponse.json(product);
}
```

Zod will check if `name` is actually in there, so if we open up our console in browser's devtools, we can indeed see that Zod is warning us (`ZodError: [ ]`) . We get a nice error message here from Zod.

In the console we can see that Zod will let us know which key there was a problem with, so here that's with `path`. Here the `path` is going to be the `key` of this object ( `key` is e.g. `name:` in `name: z.string(),`). Here for `name` there was a problem, it expected a` string` and what we got back is `undefined`, because we're not returning name here (`route.ts` - backend)

`products.tsx` fragment
```tsx
const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
})
```

`console.log` - `ZodError` in this case
```js
ZodError: [
{
  "code": "invalid_type",
  "expected": "string",
  "received": "undefined",
  "path": [
    "name"
  ],
  "message": "Required"
},
{
  "code": "invalid_type",
  "expected": "number",
  "received": "string",
  "path": [
    "price"
  ],
  "message": "Expected number, received string"
}
]
```


Now let's try to return with backend a`product` object of the correct shape see if Zod will parse this properly. 

`route.ts` - backend, returned data is of the proper shape
```tsx
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    name: "Cool jeans",
    //id: "1",
    //price "$100",
    price 100,
  };

  return NextResponse.json(product);
}
```

Now it's the correct shape. 
Right so now we do have a `string` for `name` and a `number` for `price` which is also what we codified in this `productSchema` in `products.tsx`. 
Now we should be able to access this `validatedProduct.data.name` without any errors. 

Let's try to refresh the `Product()` page and now if we open up the console we don't see any errors and in the console we indeed see our `name` "Cool jeans".

Now this is how we can validate incoming data from our own backend, but also from third-party APIs.

If we make a fetch request to a third-party API it's even less secure, because we don't know what the third-party API is going to send back.

At least with our own backend we still have control over this.


#### Realistic scenario with Zod

This was a little bit of a contrived example just to show how everything works here and the logic behind it. 
In practice if we get external data, with TypeScript, we don't just want to type it and assume that it's going to be that shape. 
Here the better type would actually be `unknown`.
Then TypeScript will warn us if we try to access something without properly validating it first and Zod just makes it very easy to validate. 
We wouldn't even type this in TypeScript ourselves (like `type Product` here).
This `type Product`, we wouldn't even have this, so this would be a more realistic example. 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";

//type Product = {
//  name: string;
//  price: number;
//}

const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
})

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      //.then((product: Product) => {
      .then((product: unknown) => { //             <- better type unknown <- 
        // use Zod to validate the product
        //const validateProduct = productSchema.parse(product);
        const validateProduct = productSchema.safeParse(product);

        if (!validatedProduct.success) {
          console.error(validatedProduct.error);
          return;
        }

        // use the validatedProduct
        console.log(validatedProduct.data.name);
        console.log(validatedProduct.data.price);
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

So now we don't have that product type in TypeScript anymore, but what if we do need that `Product` `type`, because it's likely that we're going to work with this product in others instances as well and we may need that `Product type`. 

For example we may have a helper function `getPriceFromProduct`, which takes in a parameter `product` of type `Product` and then we just want to return the `product.price`. Here we want to type we want to type the parameter as a `Product` so we can only pass in a product.   
Now should we create a separate TypeScript type? `type` `Product`, this is basically just what we did before and now we are basically duplicating ourselves, because now here in `type Product` we are essentially specifying the same as in Zod's `productSchema`.
By adding Zod here it now looks like we're going to have a bunch of duplications, 
basically every time we have our own TypeScript `type` we're also going to have a Zod schema, which basically describes the same.

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";

type Product = {         // <- we are duplication ourselves with type and Zod
  name: string;
  price: number;
}

const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
})

const getPriceFromProduct = (product: Product) => {
  return product.price;
};

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      //.then((product: Product) => {
      .then((product: unknown) => { //             <- better type unknown <- 
        // use Zod to validate the product
        //const validateProduct = productSchema.parse(product);
        const validateProduct = productSchema.safeParse(product);

        if (!validatedProduct.success) {
          console.error(validatedProduct.error);
          return;
        }

        // use the validatedProduct
        console.log(validatedProduct.data.name);
        console.log(validatedProduct.data.price);
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

The good news is we don't have to do that. We only have to specify it once here with Zod, make Zod the one source of truth and then if we do need a TypeScript type for example for a helper function, or somewhere else, we can easily infer the type from that Zod schema.
`type Product = z.infer<typeof productSchema>`

Now here we have we've already defined this here with `productSchema` schema, then we can take `typeof productSchema`, pass that to `z.infer` and that will give us the TypeScript `type`. 
If we hover this `type Product`, we can see this is the same shape as what we had before, defining it ourselves.
Then we can use that type in other places as well and just make sure that our one source of truth Zod accurately describes the data.

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";

//type Product = {       // <- we are duplication ourselves with type and Zod
//  name: string;
//  price: number;
//}

const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
})

type Product = z.infer<typeof productSchema>         // <- we infer the type 

const getPriceFromProduct = (product: Product) => {
  return product.price;
};

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      //.then((product: Product) => {
      .then((product: unknown) => { //             <- better type unknown <- 
        // use Zod to validate the product
        //const validateProduct = productSchema.parse(product);
        const validateProduct = productSchema.safeParse(product);

        if (!validatedProduct.success) {
          console.error(validatedProduct.error);
          return;
        }

        // use the validatedProduct
        console.log(validatedProduct.data.name);
        console.log(validatedProduct.data.price);
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```


That's also helpful because let's say we change the schema, maybe it also needs a `description`. If we would also have a separate type, we would have to manually change that as well, to make sure they in sync. 
But now because we are inferring it here, whenever we make a change in Zod schema, it will automatically be updated in the TypeScript type as well. That's really handy. 

`products.tsx`
```tsx
"use client";

import { useEffect } from "react";
import { z } from "zod";

//type Product = {       // <- we are duplication ourselves with type and Zod
//  name: string;
//  price: number;
//}

const productSchema = z.object({
  name: z.string(),
  //price: z.number().positive(),
  price: z.number(),
  description: z.string().optional,                   // <- added description
})

type Product = z.infer<typeof productSchema>         // <- we infer the type 

const getPriceFromProduct = (product: Product) => {
  return product.price;
};

export default function Product() {
  useEffect(() => {
    fetch("/api/product")
      .then(res => res.json())
      //.then((product: Product) => {
      .then((product: unknown) => { //             <- better type unknown <- 
        // use Zod to validate the product
        //const validateProduct = productSchema.parse(product);
        const validateProduct = productSchema.safeParse(product);

        if (!validatedProduct.success) {
          console.error(validatedProduct.error);
          return;
        }

        // use the validatedProduct
        console.log(validatedProduct.data.name);
        console.log(validatedProduct.data.price);
      });
  }, []); // dependency array, how often this useEffect should run

  return <div>Product</div>
}
```

#### Tanstack React Query with Zod (validation) vs tRPC (more robust)

Now in practice when we are fetching data like this from an external source usually we are going to use something like Tanstack React Query to help us out with. 

Tanstack React Query does not do validation like this. 
Tanstack React Query is for caching and retrying and things like that, so we may want to use Zod in conjunction with something like Tanstack React Query

And if we are making API requests to own backend, there is an even more robust solution which is called tRPC. If we control your own API routes we may want to use tRPC which does something similar under the hood. 

Now with tRPC it is a little bit more of a setup, so we really have to buy into that system. 
If that's too much we could just use Zod.

(SIC) If we don't control the backend, using third-party APIs for example, we cannot use tRPC, because we don't control that backend API. 

If we're going to get data from a third party API we should run it  through validator like Zod first, before we actually work with that in our application. 
The same is true for API requests to our own backend whatever we get back we want to run it through Zod or want to get an even more robust solution with tRPC which does require a little bit more setup.

### -> Extra information mention:
Why I don't use React-Query and tRPC in Next.js
https://www.youtube.com/watch?v=51pf_nCJpwg






### Frontend: Example 3: Form data (validating data with Zod)

Let's take a look at these other external sources on the frontend. 

Very commonly we want to get input from the user. 
We're going to have form data and that's also external data, for example we may have a form here, a checkout form, and the user will fill out data in there name and email, address, city, state, ZIP code. 

We have a bunch of different types of data and email is a string, but it can be even more specific, it's an email string, and a zip code may be a `number`, checkbox is on or off. 

checkout-form.tsx
```tsx
export default funtion checkoutForm() {
  // react-hook-form + Zod
  // React Hook Form with:
  //   1) form validation
  //   2) error and loading states
  //   3) performance, prevents unnecessary re-renders

  return (
    <form>
      <input type="text" placeholder="Name" />
      <input type="text" placeholder="Email" />
      <input type="text" placeholder="Address" />
      <input type="text" placeholder="City" />
      <input type="text" placeholder="State" />
      <input type="text" placeholder="Zip" />
      <button type="submit">Submit</button>
    </form>  
  )
}
```


Whatever the user is giving us in form data, we can run it through Zod, and if there is a problem with the data we can immediately give feedback to the user so they can fix it.

Now in practice when we work with forms, we want to use a solution like React Hook Form or Formik to manage the forms, because they help out with a lot of issues that we are going to run into with forms. 
For example React Hook Form will help you us with 
1) form validation, 
2) but also with error and loading states, and resetting the form, basically form state in general 
3) and also with performance. It will prevent unnecessary re-renders.

React Hook Form will help us out with validation so we may say why do we even need Zod there? Well because we're going to submit this form data to our backend. From the perspective of the back end that will actually be incoming data, 
(and we'll look at that in a second), 
so then when the backend receives that data, it may want to validate that data as well, because we cannot really trust anything coming from the client and since that's going to be the same validation as here on the frontend, it would be nice if we could reuse some schema, so we can use it both on the client-side as well on the backend.
With React Hook Form alone validation is only on the client-side. 
If we do form validation with just React Hook Form, that's just going to be here on the client-side, we cannot reuse that on the backend.
However if we do form validation with Zod we can use that schema both on the client-side as well as on the backend - when we get that incoming form data.

---

In **V264 "Professional Forms With React-Hook-Form And Zod"** we did a tutorial on React Hook Form, but just to give here a quick example from that tutorial, so with React Hook Form if we scroll down here we have a `form` and we want to use React Hook Form for easily managing form states, so with errors, loading states, resetting states and also with performance so we still want to use React Hook Form for those reasons. 

We can use the `useForm`hook (that is coming form `"react-hook-form"`), 
here `useForm`hook will give us a way to deal with form state, error and loading (or submitting states), resetting the form, and it will give us that performance.
But the form validation, we want to do that with Zod.

Here we can connect Zod to React Hook Form with a so-called resolver: 
`resolver: zodResolver(signUpSchema),`
`resolver` and then while with Zod we always have a schema (here `signUpSchema`), 
schema is basically a description of what we expect or want the data to be like. 
This example has a `signUpSchema`, with Zod we can specify what that should look like. 

There should be an `email` and with Zod we can also be more specific than TypeScript by the way way, so if we have some `email` field, we can say it should be a `string` (by using `string()`), but we can be even more specific, it should specifically be an an `email string` - `email()`

 and then with password for example we can say it should be a string but also at least 10 characters, we cannot do that with TypeScript 

and then here with Zod we can also have a nice custom error message, so if there is a problem with that, we can customize the error message e.g. `"Password must be at least 10 characters"`, 
and with Zod we can also do more advanced validation for example make sure that `confirmPassword` and `password` are the same.

So here we have the `refine` method (`.refine()`), which will give us access to all the `data` from the form in this case and then we can check if the `data.password` is strictly equal to the `data.confirmPassword`,
we can also specify the custom error message `message: "Passwords must match",`. 

Then we can also infer a TypeScript type from this schema. 
`type TSignUpSchema = z.infer<typeof signUpSchema>;`
Why is that beneficial? 
If we scroll down here `useForm<TSignUpSchema>(`, we can also specify a type here `< >` for React Hook Form and we can specify that this form is going to be of this type (`TSignUpSchema`) so with `email`, `password`, `confirmPassword`. 

`form-with-react-hook-form-and-zod.tsx` fragment
```tsx
  } = useForm<TSignUpSchema>({ // <- used type TSignUpSchema
    resolver: zodResolver(signUpSchema),
  });
```

so then here when we register this input for react hook form and we make a mistake here 
`<input {...register('emailmistake345')}`, TypeScript will help us out here. We get a warning here and we can fix our mistake.

And then also when the form gets submitted here `onSubmit` we get `data` here and we know that this is going to be of that type `TSignUpSchema`, so here we can also specify that type. So then we can easily work with this `data`, because we know what fields are going to be on there. This has been validated through Zod before we actually run this function `onSubmit`.

The real benefit is now that when we actually submit this form `onSubmit`.
From the frontend to the backend, from the perspective of the backend that's external data coming in. 
From the frontend to the backend, it's a two-way communication.
The backend will also get data from the frontend and we want to do the same validation on the backend as well. 
We could put this schema `signUpSchema` in our library, and then import this on the backend as well (this has been implemented in detail in V264).
We don't have to duplicate ourselves, we can just have Zod one source of truth, we can infer TypeScript types, as well as use it both on the client and on on the backend,
which is really nice because now if we change a field in our form, maybe we want to add address `address: z.string().optional(),`, if we just change it here `signUpSchema` and we import the same schema on the backend (making Zod schema in it's own different file) it will stay in sync because we have one source of truth:

`form-with-react-hook-form-and-zod.tsx` fragment
```tsx
const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
    address: z.string().optional(),
})
```

Our TypeScript type (here `TSignUpSchema`) will be in sync, our backend will be in sync, and that's much more robust than if we would do it in a different way. 

So also when we're getting data from a form, we also want to run it through Zod before we do anything else with it in our application.

`form-with-react-hook-form-and-zod.tsx` (just before refactoring, moving schema to `types.ts`), no changes to version V264, though it is not the last version
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
    address: z.string().optional(),
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


---


### Frontend: Example 4: localStorage (validating data read from localStorage with Zod)

Let's say we have some kind of cart component, 
we want to store the cart information in localStorage, so then if the user comes back, we can quickly grab it from localStorage again.

What we can do here is we could say `cart` well we can do `localStorage`, get an item `getItem` and that's going to be in JSON format, so we want to convert it from JSON into a normal JavaScript object, we do `JSON.parse`.

cart.tsx
```tsx
"use client";

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart = JSON.parse(localStorage.getItem("cart") || "{}"); // <- empty object
  console.log(cart.totalPrice);

  return <div>Cart</div>
}
```


It could be that the user cleared their `localStorage` and therefore this `getItem` here could return null. If it's null we could also have an empty array `"[]"` let's say or an empty object `"{}"`. 

Then we have a cart object, at least that's what we expect, so then we may want to do something like `console.log(cart.totalPrice)` perhaps. 
Maybe we expect the card object to have some `totalPrice` property and here for now (`cart.tsx`) we don't get any warning from TypeScript, because if we hover `cart`, TypeScript types this as `any`, which means anything goes. 
We can do whatever we want with this, we can now access anything even `console.log(cart.blahblah);` let's say, because with with `any` anything goes. 

So we could type this a little bit better, we could say maybe we expect this to be some type `Cart`, 

cart.tsx
```tsx
"use client";

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart: Cart = JSON.parse(localStorage.getItem("cart") || "{}"); // <- empty object
  console.log(cart.totalPrice);

  return <div>Cart</div>
}
```

but TypeScript does have a better type for when we don't know, what data is actually going to be, and that's the `unknown` type

cart.tsx
```tsx
"use client";

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart: unknown = JSON.parse(localStorage.getItem("cart") || "{}"); // <- empty object
  console.log(cart.totalPrice);

  return <div>Cart</div>
}
```

 and when we type it as `unknown`, TypeScript will actually warn us, when we try to access some property, because here Intellisense will say `'cart' is of type unknown`, 
 well `cart` may not exist, `cart` is of type `unknown` so we cannot just start accessing `totalPrice`. 

Now what we would have to do is the same, as what we saw before, now we have to make sure `cart` exists, that's so `if (cart)` in here, we can do something with `cart`. 
But now we don't know if `totalPrice` is going to exist (Intellisense: `Property 'totalPrice' does not exist on type '{}'`), because it could also be an empty object and so we could add more checks here `if (cart && cart.totalPrice) {` and then try to access the stuff that we need. 
That technically does work, it's not a clean structured way of doing it. 

cart.tsx
```tsx
"use client";

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart: unknown = JSON.parse(localStorage.getItem("cart") || "{}"); // <- empty object
  if (cart) {
    console.log(cart.totalPrice);
  }
  
  return <div>Cart</div>
}
```

So here whatever we get back from localStorage we also want to run it through Zod which will make all of this much more ergonomic.

What we could do here is we could create a `cartSchema`, so we could say `cartSchema` is `z.object` 

cart.tsx
```tsx
"use client";

import { z } from "zod";

const cartSchema = z.object({

});

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart: unknown = JSON.parse(localStorage.getItem("cart") || "{}"); // <- empty object

  return <div>Cart</div>
}
```

and it could also be an array by the way, so maybe we're just storing an array of products, in that case if the cart is empty, we probably just want to have an empty array and then this `z.object` wouldn't be an object, we also have array in Zod `z.array()`, and then what we can do is in the array we want to have a bunch of objects, so we can say in the array we have `z.object({})`.

We have an array of objects and then every object has an `id` so `z.number` let's say and maybe also a quantity so we could say the `quantity` is going to be a `z.number()` but we can be more specific, what we can do, what we cannot do with TypeScript, but what we can do with Zod here is we can say it should be an integer `int()` and specifically a `positive()` integer.

cart.tsx
```tsx
"use client";

import { z } from "zod";

const cartSchema = z.array(z.object({
  id: z.number(),
  quantity: z.number().int().positive(),
}));

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart: unknown = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty object

  return <div>Cart</div>
}
```


With Zod we also get more fine grained control than with just TypeScript.

Then we can run this variable `cart` through that schema so we could say `validatedCart`, we're going to parse that card to see if it adheres to that schema, if that's not the case (if there's no success) we want to do probably is remove whatever was in that `localStorage` because it's outdated. 
Realistically this could happen if for example, the `cart` that we stored in `localStorage` maybe it was still storing data from a long time ago and meanwhile our app has updated to have a different shape of `cart`, so here when we grab the `cart` from `localStorage` `const cart: unknown = (...)` it may still be a different shape, an outdated shape.
If that's the case we may as well just remove it from `localStorage` and then whatever we want to do here `return;`

And if the `cart` is of that shape so if success is `true`, we can now continue safely knowing that `validatedCart` here, this variable, so not this one (`cart`), we need to use this one `validatedCart`, will now have a `data` property on here from Zod which will then have this shape (the schema).
We can see here, we get a suggestion from Copilot here to `map`, and we can use `map` here, because we have validated that it is indeed an array (`z.array`) and `map` is an method on arrays only. We don't get any warning here because it's already validated. 

 cart.tsx
```tsx
"use client";

import { z } from "zod";

const cartSchema = z.array(z.object({
  id: z.number(),
  quantity: z.number().int().positive(),
}));

export default function Cart() {
  //const cart = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty array
  const cart: unknown = JSON.parse(localStorage.getItem("cart") || "[]"); // <- empty object

  const validatedCart = cartSchema.safeParse(cart);

  if (!validatedCart.success) {
    localStorage.removeItem("cart");
    return;
  }

  console.log(validatedCart.data.map(item) => (item.id));

  return <div>Cart</div>
}
```

Whatever we get back from localStorage run it through Zod and then we can work with it in our app. 



### Frontend: Example 5: URL (using Zod when parsing data from URL)

Let's take a look at the last example here for the frontend. 

example URL: `domain.com?id=5&color=blue`

Sometimes we want to store our data in the URL. This has many benefits. 
Once data in the URL, we want to get it into our app. 
We want to read from the URL, we're going to get data from the URL into our app. 

Here in Nextjs, we can use the` useSearchParams()` hook and that will give us `searchParams`, and for the same reasons as before, we don't know what exactly is going to be in here `searchParams`, we may have some idea, but we want to be sure, we want to validate before we continue working with this. 

`product.tsx`
```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function Product() {
  const searchParams = useSearchParams();

  return <div>Product</div>;
}
```


We can quickly create a schema here with Zod `searchParamsSchema` and that's going to be an object `z.object` and in there we may expect an `id`, so here we would expect an `id` from the URL. We could say `z.number`.
Now one other cool thing in Zod is that we can also coerce (enforce) this to be a `number`, because if we read something from the URL `localhost:3000/id=5` here, if we now read that, what we get back is actually a string type, because everything in the URL is going to be a string.
But we may want to work with this `id` as a number, so we can immediately, when we run it through Zod, we can immediately transform that into a number (`z.coerce.number()`). 
We can make sure that it's going to be a number, if it's already a number it will stay a number, but if it's a string Zod will coerce (enforce) this into a number. 
That's not a powerful feature of Zod. 

`product.tsx`
```tsx
"use client";

import { useSearchParams } from "next/navigation";

constsearchParamsSchema = z.object({
  id: z.coerce.number(),
  //color: z.string,
  color: z.enum(["red", "green", "blue"]),
})

export default function Product() {
  const searchParams = useSearchParams();

  return <div>Product</div>;
}
```

Maybe we expect a color (example URL: `domain.com?id=5&color=blue`) as well in there, this is just going to be any string `color: z.string`, but we can also be more specific than that with Zod.
We can say it's an enum and it can only be red, green and blue 
`color: z.enum(["red", "green", "blue"]),`

Then whatever we get back here `searchParams`, we can run that through Zod again. 
Here what we get is actually not just an object, so here we do need to convert that into an object first. 
`searchParamObject` so that would be `Object.fromEntries(searchParams)` and then we can run it through Zod. Whatever we get back from the URL we want to run it through Zod and then we can do something. 

`product.tsx`
```tsx
"use client";

import { useSearchParams } from "next/navigation";

constsearchParamsSchema = z.object({
  id: z.coerce.number(),
  //color: z.string,
  color: z.enum(["red", "green", "blue"]),
})

export default function Product() {
  const searchParams = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams);
  const validatedSearchParams = searchParamsSchema.safeParse(searchParamsObject);

  return <div>Product</div>;
}
```

If there's no success we want to do something and otherwise we can safely assume that this data property is on here `validatedSearchParams`.

We have to be always sure to not to make mistake, we should not continue with object pre validation (e.g. `searchParams`). This is not safe. What Zod returns here `validatedSearchParams` will actually be safe. It will have a `data` property with the validated `data` on there. Then here we could be sure that we get an `id` and that it's also a number, on the number we can do `toFixed()` (rounding numbers does not have a sense with id itself, but this is just an example). 
This `toFixed()` works, we don't even get a warning here because this will also be properly typed. 
Here `console.log(validatedSearchParams.data.` we also get autocomplete, we get `id` and `color`

`product.tsx`
```tsx
"use client";

import { useSearchParams } from "next/navigation";

constsearchParamsSchema = z.object({
  id: z.coerce.number(),
  //color: z.string,
  color: z.enum(["red", "green", "blue"]),
})

export default function Product() {
  const searchParams = useSearchParams();
  const searchParamsObject = Object.fromEntries(searchParams);
  const validatedSearchParams = searchParamsSchema.safeParse(searchParamsObject);

  if (!validatedSearchParams.success) {
    return;
  }

  console.log(validatedSearchParams.data.id.toFixed()); // toFixed() Output: "7" (rounded to the nearest integer), we can also do rounding to toFixed(n) n digits after comma

  return <div>Product</div>;
}
```

Using Zod when parsing data from URL is another reason for using Zod.




### Backend: number 6 - 10 (These are the 7 major sources of external data that backend is going to receive, for each we need Zod-like validation)


Now let's take a look at the backend. 

Let's continue with a Next.js example. 
In Next.js if we are creating a full stack application we can also very easily add backend functionalities, we do that with:
- API Route handlers
- these days we also have Server Actions
- Server Components, these are React components that only run on the server


Let's think about where this backend will get external data from.

### Backend: (our own) API requests (validation through Zod or tRPC)

Well we already saw that here, when we submit something from the frontend to the backend e.g. form data. From the perspective of the backend that's incoming data and generally speaking we cannot trust anything coming from the client. 

When we receive data from the frontend (from the perspective of the backend), we want to run it through Zod or tRPC (more robust setup).

"Form data" for example we're going to get that on the frontend and we run it through Zod and if during parsing, there is an issue with the "Form data", we can immediately give feedback to the user, so they can fix it. 
If everything is good, we will gladly accept it into our frontend application and probably eventually submit it to our server. 

Then here on the server side, when we receive that data, we're going to parse it again and with Zod we can reuse these schemas so we only have to create it once and we can use it on both the client-side as well on the server-side 
and if it validates again we can very safely work with that here on the backend. 

Typically when we submit form data for example in Next.js, 
we are going to work with that in these API Route handlers or in Server Actions. 
We don't submit something directly to Server Components. 

### Backend: Third-party API

But there are other sources of external data for the backend as well, for example the backend may also make third-party API requests themselves. 
Backend can also make third-party API requests. 

When the backend gets data from the third party API, 
whatever ever we get back, we may have some idea what it's going to be, but we don't know for sure. So we want to run it through Zod first. 

We cannot use tRPC, because we don't control the back end of that third-party API. 

Third-party API will not get submitted to our Server Component or Server Action, only get submitted to our API Route handlers.


### Backend: Webhooks

Another source for external data for a backend is Webhooks.

If we are working with payments for example, if somebody successfully completes a payment with stripe, let's say stripe will send us a message, they will let us know that somebody successfully completed a payment, and they will include data in there, so they include data of who paid and how much they paid for which product.
Before we actually work with that data, we can already guess it, we're going to run it through Zod first. 

These are all network requests, so we get a network request from our own frontend, third-party APIs, as well as Webhooks, but there are other sources of data for a backend as well, for example we may be loading environment variables into our app. 

Webhook will not get submitted to our Server Component or Server Action, a Webhook will only get submitted to our API Route handlers.


### Backend: Environment variables

There are actually many things that can go wrong with loading environment variables into our app.

Typically when we work with environment variables, we also want to make sure that they are loaded properly into our app.
We can do that with Zod as well, this is also something we can run through Zod first. 

Environment variables, we can load them anywhere here, 
so in these API Route handlers, 
in Server Actions 
as well as Server Components,


### Backend: File system

What next, where else is a backend going to get external data from? 

Well maybe we are reading data from our file system.
Maybe we are loading some file or data in a file into our application. 

The file system is an external system and there are things that can go wrong there. 

We can run that through Zod.

Server Component, Server Action, API Route handlers, all of them can interact with the file system.


### Backend: URL (using Zod when parsing data from URL)

What else can we get data from on the backend? 
We can also read data from the URL.
\
On the backend the same as on the frontend retrieving data from the URL works almost the same.
On the backend we also want to run it through Zod. 

Server Component, Server Action, API Route handlers, all of them can deal (interact) with the URL.


### Backend: Databases

Typically we are also going to have a database and typically these databases are a separate server.
We would have a separate server for a database, let's say we have some PostgreSQL database. On the backend we may be getting data from that database.

There is another flow of data into our backend (from the database to the backend). Typically we use an ORM for this, typically there is an ORM in between here.
That could be something like Prisma ORM or Drizzle ORM or if we are using MongoDB it would be Mongoose for example, and they are sitting in between our backend and the actual database server. 

Getting data from a database can be implemented using API Route handlers, Server Actions as well as Server Components.

We can even fetch data from our database in our React components these days, as long as they are server components. 



Let's quickly go through them and see an example of them, where we need to use Zod-like validation: 
- API requests (validation through Zod or tRPC),
- Third-party API
- Webhooks
- Environment variables
- File system
- URL (using Zod when parsing data from URL)
- Databases


### Example 6 - 8: back-end API

#### Backend: API requests, Third-party API, Webhooks: Zod as one source of truth, validation

Very commonly we're going to get API requests (on the backend) from the frontend and this will be very similar for all of these three: API requests, Third-party API, Webhooks - these are all network requests that may have some data for us. 
Want to run that through Zod. 

Let's say we have some API Route handler that will receive a POST request, so that the frontend can submit something. 
Let's say the form that we were talking about before. 

Here in `route.ts` is where we're going to receive that form data. 
We're in a route handler and it's going to receive some data here.

Here let's see we will get a `request` and we want to see the `body` of that request so we can parse that `body`.  We can we can take the `request` and convert it from JSON into normal JavaScript object and this variable `body` is now going to be type `any` that's the default in TypeScript. 
A better type here would be `unknown` as we've seen because we don't really know what it's going to be, so we want to restrict ourselves, before we try to access anything, for example maybe we expect the `body` to have some kind of `.address`, maybe we expect there to be an `address` property on the `body`. 
and when we type it in TypeScript as `unknown` TypeScript will warn us, that we don't know what what it's going to be, so we cannot just access that `body.address` here. 
As we've seen, to prevent that we would have to make all of these if statements `if (body) {`, and then also verify that if they exist, they are of the right type. 
And we could go down that route, but it it becomes very messy, it's not really a structured way of validating that something exists and that it is of the type that you want it or expect it to be. 

`route.ts`
```ts
import { NextResponse } from "next/server";

export async function POST(request: Request, response: NextResponse) {
  const body: unknown = await request.json();

  //if (body) {} //messy if statements, if they exist and are of the right type
  console.log(body.address);
}
```

Now this is again a place where we want to run it through Zod.

Now as we mentioned before, since we are going to do the same validation as on the frontend, here `route.ts` is probably where we want to reuse a schema. 
We do not want to repeat ourselves by defining another schema here `route.ts` on the backend.So here is where we would import a schema, that we have already used somewhere else. 
What we can do, is we can create a library folder `/app/lib/` and in there we can create a file `validations.ts` where we are going to keep all of our schemas. 
And maybe we also want to have a file for our typescript types `types.ts`.

Then here in `validations.ts` is where we would have the schemas that we want to reuse (that can be reused both on the client side as well as server side), 
so we could have for example, we want to `export` a `checkoutFormSchema` and and that's going to be an object and that could have a bunch of things in here.

Let's see if co-pilot can suggest some interesting things, actually we get a name here and we can see how fine grained we can get with Zod. 
We can say minimum, custom error message, a maximum, custom error message and even optional. 
And we can even say an `email`, a `phone` number, that's also very helpful, an `address`, maybe `paymentMethod` some `enum`. 

`validations.ts`
```ts
import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().min(3, "Too short").max(50, "Too long").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Invalid phone number").optional,
  address: z.string().min(10, "Too short").max(100, "Too long").optional(),
  paymentMethod: z.enum(["cash", "card"]),
});
```

Again, imagine that we have to do all of this here with a bunch of if statements, so we would have to check if the string is an email, does it have a certain length, is the phone number a certain length. And if there's anything wrong with them, we would have to create a custom error message, it would be so messy to do ourselves.

`route.ts`
```ts
import { NextResponse } from "next/server";

export async function POST(request: Request, response: NextResponse) {
  const body: unknown = await request.json();


  //if (!body) {
  // return response.json({ error: "Invalid request" })
  //}

}
```

Zod is actually just a very ergonomic way of doing this. 


Maybe we have some `paymentMethod` with `enum`, and let's say that this is how we expect our checkout form to be shaped.

Now we can import that `checkoutFormSchema` on the frontend and use it to validate the incoming form data. 
Now we can also import that schema here on our backend. 
We can say `parsedForm` is going to be `checkoutFormSchema` which we can import from our `validations.ts` file and we can do `saveParse` and just run the `body` through there. 
And if that's not the right shape we want to return a NextResponse let's say, we'll send back some JSON. We can send back the errors, Zod will give us nicely shaped errors, and we can we can change the error format. We can also send back a status code of let's say 422, which means the client submitted a malformed (distorted, corrupted) data. 
And otherwise if it was successful we can continue here with this data, maybe store it in a database or process it further and return some success response perhaps.

`route.ts`
```ts
import { checkoutFormSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: NextResponse) {
  const body: unknown = await request.json();
 
  const parsedForm = checkoutFormSchema.safeParse(body);

  if (!parsedForm.success){
    return NextResponse.json(parsedForm.error, 
    {
      status: 422
    });
  }

  // ...
  return response.json({
    message: "Success",
  });
}
```


The nice thing here is, let's say we want to change the shape of the checkout form. Since we're using `checkoutFormSchema` on both the client as well as here on the server, we may expect there to be issues, but here we won't have issues because we have centralized validation this in one place (`validations.ts`), we have one source of truth. 
If we change something here (`validations.ts`), maybe the name should be at max 25, now immediately on the frontend, as well as on the backend the validation is updated. 
Also if we derive a TypeScript type from this, so maybe we we do need a type in our application, so then here in our types file `types.ts` we could say `z.infer` and here `< >` we need to pass `typeof` and then it's that `checkoutFormSchema` which we can just Import in this file. 
And then we have a `CheckoutForm` type which we can then `export` from here.

`types.ts`
```ts
import { z } from "zod";
import { checkoutFormSchema } from "./validations";

export type CheckoutFormType = z.infer<typeof checkoutFormSchema>;
```


Now if we make a change here `validations.ts` or let's say we want to remove the cash option here from `paymentMethod`, we can update it here `validations.ts` and now it's immediately synchronized with both frontend as well as backend and synchronized with our TypeScript type. 

`validations.ts`
```ts
import { z } from "zod";

export const checkoutFormSchema = z.object({
  name: z.string().min(3, "Too short").max(50, "Too long").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().min(10, "Invalid phone number").optional,
  address: z.string().min(10, "Too short").max(100, "Too long").optional(),
  paymentMethod: z.enum(["cash", "card"]),
});
```

It's really nice to have one source of truth. 

This was an example of how to parse incoming network requests on the backend. 
Since we control the frontend and backend ourselves, we can use something like tRPC to make it really robust, or we can just use Zod like what we've done here. 


#### Backend: Third-party API: Zod validation

Now if we are getting incoming data from a third-party API, we don't control that side of things, so we cannot use tRPC there, so with third-party API is where we should actually use something like Zod.

#### Backend: Webhooks: Zod validation

If we have incoming Webhooks it's the same story as with third-party API, we do not control that side of the equation, so with Webhooks we want to use Zod to validate the incoming payload. With 
Webhooks, if Stripe sends us a Webhook, we do want to verify that the incoming Webhook is actually coming from Stripe. 

In this example we were submitting form data from the frontend to our API Route Handler, 
but now these days we can also submit data with Server Actions, but fundamentally nothing has changed here, so we still can't trust, what we get from the client. Also in a Server Action we would validate the data and we don't submit data to a server component (that's not relevant here). 

`route.ts`
```ts
import { checkoutFormSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: NextResponse) {
  const body: unknown = await request.json();
 
  const parsedForm = checkoutFormSchema.safeParse(body);

  if (!parsedForm.success){
    return NextResponse.json(parsedForm.error, 
    {
      status: 422
    });
  }

  // ...
  return response.json({
    message: "Success",
  });
}
```



### Example 9: Backend: environment variables

We also have environment variables, so a lot of things can go wrong with environment variables, so one approach we can take here, is to create a simple TypeScript file let's call that `env.ts` and here we can actually just create a schema for what we expect the environment variables to be. 

We can say `z.object`, it's an object, because what we're going to validate is the `process.env`. In a Node.js environment we are going to get `process.env`, which will be an object with all the environment variables.
We want to validate this variable `process.env`, so that's going to be an object
and this may have things like `DATABASE_URL`- we want this to be a `string()` and now maybe importantly we expect this to be a non-empty string, this should be at least one character `min(1)`.

We can have things like a `PORT` a port may actually be a number: 
`PORT: z.number().min(1),` 
(OR check if this could be a string written by the number `PORT: z.string().min(1),` )

We can have maybe some `THIRD_PARTY_API_KEY`also a `string` with a minimum of one `min(1)`

Then we can say `parsedEnv` and we can parse, we can take that schema and we can say run that `process.env` through that schema, this could be a good use case for the `parse` method, because if there is something wrong, we actually may want to throw an error and we can immediately fix it as developers. Instead of using `safeParse` we may want to consider using the `parse` method here.

`env.ts`
```ts
import { z } from "zod";

//process.env

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  THIRD_PARTY_API_KEY: z.string.min(1),
});

export const parsedEnv = envSchema.parse(process.env);
```

Then we get the parsed environment variable `parsedEnv`, which we can `export` here.

Then if we want to use environment variables somewhere else, and that can be anywhere in the API Route handler, Server Actions, Server Components.

Let's say in some API Route handler here, let's say we want to use one of those environment variables. Instead of using `process.env` we can use this exported variable `parsedEnv`, we can `import` that from `"@/env"` and then we even get autocomplete here `parsedEnv.` - we can see which ones we have `DATABASE_URL` or `THIRD_PARTY_API_KEY`. 

That autocomplete is not what we get with `process.env`, if we use `process.env.` we don't get autocomplete here. We can't see `DATABASE_URL` here.

Now we also know that  `process.env` has been loaded properly when we use `parsedEnv`.

`/api/product/route.ts`
```ts
import { parsedEnv } from "@/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const product = {
    // name: "Cool jeans",
    id: 1,
    price: 100,
  };

  parsedEnv.DATABASE_URL // here we get autocomplete for parsedEnv.
  //process.env. //here we do not get autocomplete process.env.

  return NextResponse.json(product);
}

```

That's another a good use case for Zod. 


### Example 10: Backend: file system

Then let's take a look at file system, so we could also have let's say JSON data in our local file system. Maybe in our library folder `/app/lib/` we have some JSON here, let's call `/app/lib/data.json` and that's just going to be some data like this,

`/app/lib/data.json`
```json
{
  "id": 3452345,
  "name": "Product Name",
  "price": 100
}
```

Maybe we want to get access to this somewhere and that can happen in any of these: API Route handlers, Server Actions, Server Components. 

Let's say it's in our Route handler again, and so now here let's say we want to get that data, instead of hardcoding our `const product` here, we may want to get that data from that JSON file and that would look something like this: 

Here we would get the `jsonDirectory`, we will import the `path` module, and then we can read the `fileContents` there with `fs.readFile`. We need to import the the `promises` version from the file system module.
Then we get the `fileContents`, but again we don't know for sure whether that's the shape that we expect it to be.
Then we can run this `fileContents` through some `productSchema` that we may have, which will just make sure that has this `id`, `name` and `price` and also check for example whether `price` is and `number`.

`/api/product/route.ts`
```ts
import { parsedEnv } from "@/env";
import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export async function GET(request: Request) {
  const jsonDirectory = path.join(process.cwd(), "../../data.json");
  const fileContents = await fs.readFile(jsonDirectory + "/data.json", "utf8");

  const parsedProduct = productSchema.safeParse(fileContents);

  return NextResponse.json(product);
}

```

So now we would create a `productSchema` like we've done before and then we can be rest assured that what we got from the file system is indeed the shape that we expect it to be.

We will omit the creation on a `productSchema` now.

`validations.ts` for `productSchema`
```ts
import { z } from "zod";

export const productSchema = z.object({
  id : z.number(),
  name: z.string().min(3, "Too short"),
  price: z.number()
    .int("Price must be an integer") 
    .positive("Price must be positive")
    .min(1, "Price must be at least 1") 
    .max(100000, "Price must be less than or equal to 100,000"),
});
```


### BONUS Example 11: URL (Backend)

Let's take a look at the URL next. 

Also on the server we can read data from the URL. 
Let's say we have a server component, `product-server.tsx` and server components get access to also the` searchParams`. 
We can say `searchParams`, and here we get it as props,
before here on the on the frontend we got it through the `useSearchParams` hook, but here we get it through props, and so we can read data from the URL in a server component and Next.js does give us a type for this, here we can type the props and then we can say `searchParams` should not be `any`, but `searchParams` itself is an object and Next.js gives us this type `{ [key: string]: string | string[] | undefinded }` , it's going to be an object and then each `key` is going to be some `string` and the value for each `key` is going to be `string` or an `array of strings` or `undefined`. 

But when we read data from a URL, we want to make sure that it has a particular shape, so for example we can say `searchParamsSchema`, we want to make sure that what we get is some object with an `id` let's say, and here what we can do, is we can `coerce` (enforce) it to be a `number`, because everything we get from a URL is going to be a string so here with an `id` for example we may want to transform it to a `number`.  
And also color that it's only going to be red, green or blue.

These search params we can run it through our schema, we take `searchParamsSchema`, `safeParse()`, pass in whatever we want to validate (her `searchParams`) and then this `parsedSearchParams` is what we get back.  

`product-server.tsx`
```tsx
import { z } from "zod";

const searchParamsSchema = z.object({
  id: z.coerce.number(),
  color: z.enum(["red", "green", "blue"]),
})

export default function Product({
  searchParams
}: { // <- type the props
  searchParams: {
    [key: string]: string | string[] | undefinded
  }
}) {
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams);

  //parsedSearchParams.data
  //parsedSearchParams.error

  return <div>Product</div>;
}
```

This `parsedSearchParams` is then what we want to use, any further processing. 
A typical mistake, people sometimes make the mistake of then using not validated `searchParams`, this is not validated, this is unsafe.
It's this variable now `parsedSearchParams` that we get back from Zod, that we want to use, and Zod will give us a `data` property with with all the data, it `parsedSearchParams.data` will have an `id` and `color` in the success case, 
or if there's an `error` Zod will give us that in `.error`




### BONUS Example 12: Database (ORM) (Backend)

Let's take a look at the last one, and this is actually a major one, because we often get data from a database in our backend. 

We can get data from our database in Route handlers, in Server Actions, as well as Server Components.

Let's say we have some product `page.tsx` here, this is a server component. 
These days what we can do, is we can fetch data here from the server in a server component.

Here we are using let's say Prisma as an ORM, and here we attempt to find some product where the `id` is `1`. 

`page.tsx`
```tsx
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function ProductPage() {
  const product = await prisma.product.findUnique({
    where: {
      id: 1,
    }
  });

  return <div>ProductPage</div>;
}
```

Then we get data `product`. When we hover on this `product` we can see this is actually typed as something, Prisma does type this :

Inteliisense output
```js
const product: {
    id: number;
    name: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
} | null
```


So do we still want to validate data that we get from our own database? 

Here we could say it's a little bit less necessary because Prisma is essentially acting as an intermediary here. 
With Prisma we are also creating a schema in which we describe what the data needs to be. 

```sh
application_name/
├── prisma/
│   ├── dev.db
│   ├── dev.db-journal
│   ├── schema.prisma
│   └── migrations/
│       ├── 
│       └── 
├── src/
│   ├── app/
│   │   ├── 
│   │   └── 
│   ├── components/
│   │   ├── 
│   │   └── 
│   └── lib/
│       ├──
│       └──
├── package.json
└── ...

```

`schema.prisma`
```js
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Product {
  id    Int    @id @default(autoincrement())
  name  String
  price Float 
}
```

For example for a product here we will say that needs to have an `id`, `name` and `price` and if we ever try to insert something in the in the `Product` table that's not of this particular shape, Prisma will prevent us from doing that. 
And also when we get back data from this `Product` table, Prisma will essentially guarantee that it's going to be of this shape. 

So then do we really need to parse this whatever we get back from Prisma here? 

Well technically of course it's always possible that what we actually get back over the wire is something different than what we would expect, 
To really exclude any edge case we may want to run this through a Zod schema as well, and it could be said, especially if we are doing raw SQL queries is where we want to do validation, because whatever we pass here `findUnique({` Prisma will transform this into a SQL query for us and that's a little bit safer than doing it yourself.

If we are going to do it ourselves with SQL queries, there's a higher degree that what we get back is different from what you expect, but if we are doing it this way with the Prisma APIs we can make the argument that it's not necessary here. 

Let being said it's possible that we are simply passing the wrong query here `prisma.product.findUnique({ where: { id: 1, } });`, so we make some mistake here, maybe some logical mistake, so it's always possible that what we get back here is different from what we expect. 

We may want to run it through a Zod schema as well and now we could say that we're going to duplicate ourselves, because we also create a schema with Prisma, so now we would also have to create a schema with Zod, which is essentially going to be the same as here with Prisma. 
However there are `npm` packages that can take a Prisma schema and convert it to a Zod schema so that we are not repeating ourselves. 
Then for any database related validation we can make Prisma the one source of truth and then if we do want to do that edge case validation with Zod we can just use a package like Zod Prisma Types 
https://www.npmjs.com/package/zod-prisma-types
which will create those Zod schemas for us from the Prisma schema. 

