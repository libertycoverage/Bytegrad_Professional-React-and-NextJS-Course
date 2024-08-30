## V266 TypeScript Generics (Easy Explanation!)
Description: Generics in TypeScript explained in a simple way.

also here: 
TypeScript Generics are EASY once you know this
https://www.youtube.com/watch?v=ymSRTXT-iK4


### Example 1

Let's show why generics are much easier than we can think.
Let's show some examples of how to use them including in React. 
A lot of developers seem to be a little bit scared of generics and we don't have to.

For example let's say we have some function and it's called `convertToArray` and the only thing that this function does is it takes an input and it returns that input in an array. 
And we want to be able to call this with for example the number `123`, or with the string `test`, or even a boolean `true`, or some object - this may be a particular type, we may have a custom type for this object.

The point is we could call this function with a lot of different types, let's say the number 5.

`helpers.ts`
```ts
function convertToArray(input) {
  return [input];
};

//convertToArray(123);
//convertToArray('test');
//convertToArray(true);
//convertToArray({});

convertToArray(5);
```

So how do we type this? In TypeScript usually we want to type the parameters of a function.

`input` currently has a red squiggly line (Intellisense), because by default it's going to have `any` type and `any` means anything goes. 

If you have the `any` type let's make it explicit here, we can then do something like `toUpperCase()`.
If we do this on a number, we are going to have an error in our program, because this this method does not exist on a number and we don't get a warning here, because with `any` anything goes, we can do whatever we want.
`toUpperCase()` only works on strings, if we pass in a `string` this is not an issue, but if we pass in a `number` or anything else, this should give us an error.

`helpers.ts`
```ts
function convertToArray(input: any) {
  return [input.toUpperCase()];
};

//convertToArray(123);
//convertToArray('test');
//convertToArray(true);
//convertToArray({});

convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

We don't get any errors now because we're using `any`. 
Typically we don't want to have `any`s in our code base. 

We could type this as for example a `number`, we're calling this with a number.

`helpers.ts`
```ts
function convertToArray(input: number) {
  return [input.toUpperCase()]; // <- red squiggly lines on toUpperCase()
};

//convertToArray(123);
//convertToArray('test');
//convertToArray(true);
//convertToArray({});

convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

When we type this as `number` we got let's quickly lines on `toUpperCase()`, because does not exist on type `number`. Now we know we made a mistake, we can remove `toUpperCase()`. 
Often we also want to type the return value, so what we're going to return here is an array and specifically now it's going to be an array with a number in there `number[]`.
The parameter here is now of type `number` as well as the return value is going to be an array of number `number[]`.

`helpers.ts`
```ts
function convertToArray(input: number): number[] {
  return [input]; 
};

//convertToArray(123);
//convertToArray('test');
//convertToArray(true);
//convertToArray({});

//convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

In this specific example (when we deal with numbers) this is correct, but now of course we also want to call this `convertToArray` with the string `"hello"` and now when we do that we get a warning from TypeScript on `"hello"`, because we have just marked this as a `number` type. 

If we want to accept a string here we could say we want to do number or string and number or string array etc. 

`helpers.ts`
```ts
function convertToArray(input: number | string): number[] | string[] {
  return [input];
};

//convertToArray(123);
//convertToArray('test');
//convertToArray(true);
//convertToArray({});

//convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

But if we go down that route we are going to have a problem, because we could have many different types here, also custom types.
This becomes really difficult to manage so that's not what we want to do either.

Here what we want to use is a so-called type parameter, typically called `T`. 

Type instead of `number` it should be a little bit more general, we can just say `T` and we have now specified a relationship between the input and the return value. 
The input, whatever the type is, that's also going to be the type that we are going to get in that array. 

`helpers.ts`
```ts
function convertToArray(input: T): T[] { // <- red squiggly lines on T
  return [input];
};

//convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

Now this is a so-called generic function (`T`) and we get red quickly lines here on `T`, because when we use a type parameter like this, we need to specify that up front here `< >`.
We do that with angled brackets in front of the list of parameters. 

We say this function is now a generic function with one type parameter we call that `T` 

`helpers.ts`
```ts
function convertToArray<T>(input: T): T[] { 
  return [input];
};

//convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

We can also call that `Type` but then we have to use `Type` consequently here

`helpers.ts`
```ts
function convertToArray<Type>(input: Type): Type[] { 
  return [input];
};

//convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```

We can even call that whatever we want.

`helpers.ts`
```ts
function convertToArray<GenericFunctionType>(input: GenericFunctionType): GenericFunctionType[] { 
  return [input];
};

//convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
```
 
Typically it's called `T`.

Now we can call this function with a string, with a number, with a boolean, we may have some object with some custom type, type `User` maybe or maybe type `Guest` etc.

`helpers.ts`
```ts
function convertToArray<T>(input: T): T[] { 
  return [input];
};

convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
convertToArray(true); // we are passing a boolean
convertToArray({}); // we are passing an object
```

In this case we are using generics, or more correctly called a type parameter to codify a relationship between the parameter and the return value and that's what we always do with generics, we are specifying, we are codifying some particular relationship. 
Whenever we see a generic just look at what relationship is being specified. 

Now we are calling it with a number here, so if we do something else here, we try to return the string five, we're going to get an issue. 

`helpers.ts`
```ts
function convertToArray<T>(input: T): T[] { 
  return ['5']; // <-  we are getting an issue here '5'
};

convertToArray(5); // we are passing a number
```


We are using a traditional function syntax here:

`helpers.ts` classic function
```ts
function convertToArray<T>(input: T): T[] { 
  return [input];
};

convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
convertToArray(true); // we are passing a boolean
convertToArray({}); // we are passing an object
```


we can also have an arrow function, it looks almost the same: 

 `helpers.ts` arrow function
```ts
const convertToArray = <T>(input: T): T[] => { 
  return [input];
};

convertToArray(5); // we are passing a number
convertToArray('hello'); // we are passing a string
convertToArray(true); // we are passing a boolean
convertToArray({}); // we are passing an object
```
 
We always specify the type parameter in front of the list of parameters `<T>`.


### Example 2

Let's show another example

Let's say we have some array with numbers and we want to have a function, let's call that `getIndexOfArrayItem();`, we want to create a function where for example, we can pass in this array and let's say we pass in one of these items in the array and it should give me the index of that. 

`helpers.ts`
```ts
function getIndexOfArrayItem(array, arrayItem) {
  return array.findIndex((item) => item === arrayItem);
};

const arr = [55, 99, 77];
getIndexOfArrayItems(arr, 77); //this should give me index 2 (0,1,2)
```

Let's create this function `getIndexOfArrayItem()` and it's going to take in all the actual `array` and then also one of those items in the array `arrayItem`. Then we can use `array.findIndex`.

We get some red squiggly lines here (in `array`, `arrayItem`, `item`), because now we need to type these variables.
By default these are all going to be typed as `any`, we don't want `any`s in our code base. 

How do we type this? 

In previous example we were codifying a relationship between the parameter and the return value. Here we want to codify a relationship between the two parameters. 

Here the first parameter is going to be an array and there's going to be some type `T` of that in there. Here we have an array of numbers (it could also be an array of strings or an array of booleans).

Of course if we pass in one item of that array `getIndexOfArrayItems(arr, 77);` that should have the same type. 

There's a relationship there and we can specify that, we can codify that here with generics, or more appropriately called a type parameter.

We can say that this array item needs to be of the same type, as whatever we have in that array.

`helpers.ts`
```ts
function getIndexOfArrayItem(array: T[], arrayItem: T) {
  return array.findIndex((item) => item === arrayItem);
};

const arr = [55, 99, 77];
getIndexOfArrayItems(arr, 77); //this should give me index 2 (0,1,2)
```


Now we can see there's a relationship, that we specify.  
Now we are going to get red squiggly lines here `T[]`, `T`, because to make it a generic function we need to specify, that here in front of the list of parameters `getIndexOfArrayItem<T>(`, we're just going to call it `T` again. 

`helpers.ts` classic function
```ts
function getIndexOfArrayItem<T>(array: T[], arrayItem: T) {
  return array.findIndex((item) => item === arrayItem);
};

const arr = [55, 99, 77];
getIndexOfArrayItems(arr, 77); //this should give me index 2 (0,1,2)
```

Now we have specified a relationship between two parameters. 

This above is a traditional function syntax.

Let's convert this to an arrow function to show how that looks like.

`helpers.ts` arrow function
```ts
const getIndexOfArrayItem = <T>(array: T[], arrayItem: T) => {
  return array.findIndex((item) => item === arrayItem);
};

const arr = [55, 99, 77];
getIndexOfArrayItems(arr, 77); //this should give me index 2 (0,1,2)
```

We have the list of parameters `(array: T[], arrayItem: T)` where we have specified a relationship and we specified as a generic function like this `<T>`.
In JS we specify type parameter up front.

By the way here we don't have to specify a return (output) value, because TypeScript can already infer this correctly, because here what we are turning with `findIndex`, if we hover this (Intellisense), this `findIndex` returns a `number` and that's what we return from the function `getIndexOfArrayItem`. 

```js 
//Intellisense output
(method) Array<T>.findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number

Returns the index of the first element in the array where predicate is true, and -1 otherwise.

@param predicate
find calls predicate once for each element of the array, in ascending order, until it finds one where predicate returns true. If such an element is found, findIndex immediately returns that element index. Otherwise, findIndex returns -1.

@param thisArg
//...
```

If we hover the function name (Intellisense) you can see this `getIndexOfArrayItem` always returns a number. 

Doesn't matter what types we pass in `index of an array` it's always going to be a number.

So we don't have to specify that output type here at the end `: number`.
`function getIndexOfArrayItem<T>(array: T[], arrayItem: T): number {`.

and that's also not relevant for generics, because there's no relevant relationship between the parameters and the return value here, index of the array is always going to be a number. 
This is not a relationship that we need to specify with type parameters.


### Example 3 (multiple type parameters)

Lets' show one more example and then after we'll look at some examples in React 

Let's say that we want to be able to have a function `createArrayPair()`.

We want to be able to pass in two arguments: `'hello'`, and maybe the number 10.
The only thing this function should do, is take these two arguments and put them in an array. 

Let's create a function that can do that. 
We have function `createArrayPair()` and it will take in two inputs and the only thing it does is return them in an array, an array with `input1` and `input2`.

`helpers.ts`
```ts
function createArrayPair(input1, input2) {
  return [input1, input2] 
}

createArrayPair('hello', 10);
```

Let's think about the types here here. 

Now currently TypeScript is going to infer a lot of `any` here, both for the parameters as well as for the return value. We don't want that.

```js
//Intellisense output, hover createArrayPair 
function createArrayPair(input1: any, input2: any): any[]
```

These inputs they can be of `any` type, these inputs can be a string, number etc., but we don't want to use `any`. 
What we can say the first input is going to be of some type `T`, and the other input (we could say `T`,  but this means that `input2` will be the exact same type as `input1`), we don't want to use `T` again, because this would mean that and these inputs are the same types, but obviously both of inputs can be any types (`input1` and `input2` can be of different type).
Here we can have another type parameter and this is sometimes called `U` or `K` some other letter, that doesn't really matter, we could call this type parameter `blahblah` if we want so.

We are going to call this type parameter `K`, this `input2` can also be some type, and here there is no relationship between the parameters `T` and `K` here, but there is going to be a relationship between the parameters and what we get back from the function `createArrayPair`, because when we think about it, this `input1`, whatever that type is, that's going to be the first value in the array. `input2`, whatever that type is, that's going to be the second value in the array. 
We can say that the return here is going to be a tuple, basically just an array, a more specific array. 
If the first input going to be a string, we're going to get an array back with the first item being a string. 
If `input2` is a number, we're going to get an array back and the second value being a number.

We can specify relationship with type parameters or more commonly called generics, by making this a generic function. 

We need to define these time parameters up front here `<T, K>`, we can have multiple here.
We have two type parameters here, we have specified a relationship between the inputs and the return value.

`helpers.ts`
```ts
function createArrayPair<T, K>(input1: T, input2: K): [T, K] {
  return [input1, input2] 
}

createArrayPair('hello', 10);
```


How would this look with an arrow function? It looks almost the same.

`helpers.ts`
```ts
const createArrayPair = <T, K>(input1: T, input2: K): [T, K] => {
  return [input1, input2] 
}

createArrayPair('hello', 10);
```



### React example

Let's take a look at an example in React. 

Let's say we have some kind of `Themes()` component and we have some `themeOptions` light, dark and system. `themeOptions` this is just a constant defined outside the components here.

Then we can also select themes, by default it's going to be the light one, but if we click on these (light, dark and system), it changes accordingly.

We just have an `h1` with text `Themes`. 
Then we have a list where we map over all the options, for each option here in the array, we have a light, dark, system. It's going to create an `<li>` and in there we're going to have a `<button>` and the text in the button (`{theme}`) is going to be that light, dark, system.

Now when we click the button, we're going to set the selected theme `setSelectedTheme` to some other one, to whatever the theme we choose to click.
If the theme that we're mapping over is the currently selected one, it's going to have a bolder font `font-bold`. 
At the bottom we just output the `selectedTheme`. 

`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

const themeOptions = ["light", "dark", "system"];

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ul className="list-disc">
        {themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}
```


So far, so good, no generics needed. 

What if we want to refactor this list of options into a separate component? 

We can define multiple components in the same file and since these are related, it makes sense to have them in the same file (`themes.tsx`).

Let's do that here, we can say this is going to be `ThemeOptions()`. We have theme options here and this will just return this entire list `<ul> (...) </ul>`. Let's copy and paste that here. 

Now this is refactored into this component and now we can replace that with our custom component here .

`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

const themeOptions = ["light", "dark", "system"];

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions />

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p> 
    </section>        
  );
}

function ThemeOptions() {
  return (
      <ul className="list-disc">
        {themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```

Now when we do this, we're going to get an issue because it's saying a `selectedTheme` is not defined in this component that we just created (`ThemeOptions()`), as we are using `selectedTheme` but it's not defined in here. 
`ThemeOptions()` is also using some setter function `selectedTheme` which is not defined in this component `ThemeOptions()` and `ThemeOptions()` is also using `themeOptions`.
This `themeOptions` works now because we defined that here outside this `Themes()` component, 

but what if we have defined this `const themeOptions = ["light", "dark", "system"];` inside `Themes() `component or this `themeOptions` is coming from some API or whatever.

`themes.tsx`, we have errors here with (`themeOptions`, `selectedTheme`, `setSelectedTheme`) inside `ThemeOptions()` component:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions />

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p> 
    </section>        
  );
}

function ThemeOptions() {
  return (
      <ul className="list-disc">
        {themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```

`themeOptions` is coming from this `Themes()` component.
Now this `themeOptions` in` ThemeOptions()` also doesn't work here. 

Basically we need to pass these values (`themeOptions`, `selectedTheme`, `setSelectedTheme`) now to that `<ThemeOptions />` component and in React we do that with props. 

Let's start with the `themeOptions` here, we want to pass the `themeOptions` as props to `<ThemeOptions />`. 

Now `ThemeOptions()` component needs to accept a prop called `themeOptions`, 
Remember `props` is just an object and this is a parameter of a function, components are just normal JavaScript functions, usually we want to type these props and we can do it like this in line here. 

`props` is going to be an object with `themeOptions` within it. 

Let's say `themeOptions` is going to be typed as an array of strings `string[]`.
Then we can use `props.themeOptions`.

`themes.tsx`, we have still errors here with (`selectedTheme`, `setSelectedTheme`) inside `ThemeOptions()` component, we pass `themeOptions` as props, we use `props.themeOptions`, `props` types defined inline:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions themeOptions={themeOptions} />

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>
    </section>    
  );
}

function ThemeOptions(props: {
  themeOptions: string[];
}) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


Now typically this `props` is destructured here `function ThemeOptions(props:` immediately, but still an object.

We can write it like this `function ThemeOptions({themeOptions}:`.

`themes.tsx`, we have still errors here with (`selectedTheme`, `setSelectedTheme`) inside `ThemeOptions()` component, we pass `themeOptions` as props, we do not use `props.themeOptions`, we immediately destructure `themeOptions` from `props`, `props` types defined inline:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions themeOptions={themeOptions} />

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}

function ThemeOptions({
  themeOptions // we destructure themeOptions from props immediately
}: {
  themeOptions: string[];
}) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```

Now `themeOptions` this will work in `ThemeOptions()`. 

Now we still need to do `selectedTheme` and `setSelectedTheme`. 

Now we also want to pass `selectedTheme` as props to `<ThemeOptions>`.
Now we need to accept that prop, then we destructure that in `ThemeOptions()`.


`themes.tsx`, we have still errors here with (`setSelectedTheme`) inside `ThemeOptions()` component, we pass `themeOptions`and `selectedTheme` as props, we do not use `props.themeOptions`, we immediately destructure `themeOptions`and `selectedTheme` from `props`, `props` types defined inline:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions themeOptions={themeOptions} selectedTheme={selectedTheme}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}

function ThemeOptions({
  themeOptions, 
  selectedTheme, // we destructure themeOptions, selectedTheme from props immediately
}: {
  themeOptions: string[];
  selectedTheme: string;
}) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


Now before we continue here, we can already sense that there is some relationship here between `themeOptions: string[];` and `selectedTheme: string;`, because this `themeOptions` this is going to be an array of strings, but the `selectedTheme` is essentially just going to be one item out of `themeOptions` array.

So `selectedTheme` is always going to be the same type as the type in the array. 
Here we have a relationship, and we can codify that, we can specify that here. 
Here in destructuring the props `themeOptions: string[]; selectedTheme: string;` we're saying `selectedTheme` is always going to be a `string`, `themeOptions` is always
going to be an array of strings `string[]`. 

Not necessarily, it could also be an array of numbers `number[]`, but if `themeOptions` is an array of numbers, `selectedThem`is also going to be a number 

If this `themeOptions`as a destructured prop is going to be an array of some custom type maybe we call that `Theme[]` -> `themeOptions: Theme[];`, then `selectedTheme` is going to be of that same type `selectedTheme: Theme;`

So there is a relationship here, that we can specify that we can codify, by making this a generic function, we can use `T` -> `themeOptions: T[];` and `selectedTheme: T;`
Now when we see something like this we know that there's a relationship here. 
This is going to be the same type as what we are going to see in the array here. 

Now remember, we have to specify the generic type `T` upfront in the React component `function ThemeOptions<T>({`, because we make it a generic function.

`themes.tsx`, we have still errors here with (`setSelectedTheme`) inside `ThemeOptions()` component, we pass `themeOptions`and `selectedTheme` as props, we do not use `props.themeOptions`, we immediately destructure `themeOptions`and `selectedTheme` from `props`, we use `T` as the generic type for typing `props`, `T` defined inline:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions themeOptions={themeOptions} selectedTheme={selectedTheme}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}

function ThemeOptions<T>({
  themeOptions, 
  selectedTheme, // we destructure themeOptions, selectedTheme from props immediately
}: {
  themeOptions: T[];
  selectedTheme: T;
}) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


### Extracting type

Now here we are specifying this inline here `: { themeOptions: T[]; selectedTheme: T; }` and it may look a bit clumsy, so to prevent that, people often define the props up here separately. 
Then we can use the type `}: ThemeOptionsProps )`

Now we can see we have extracted this into its own separate type (`ThemeOptionsProps`),
but now we get some red squiggly lines, because now `ThemeOptions()` component cannot find the name `T` inside of `ThemeOptions<T>()`. 

When we extract props types with generics e.g. `T` outside, we have to do some additional things here. We still need to have a type parameter here at the front of the function `ThemeOptions<T>()`, but then if we want to pass that type from here function `ThemeOptions<T>(`, we need to also specify that here `}: ThemeOptionsProps<T> )` as well as here `type ThemeOptionsProps<T> = {` (this also needs to accept that type parameter).
We're going to say this type accepts a type parameter `type ThemeOptionsProps<T> = {`, that's what we're passing here `<T>`. 

Now we can see we're passing `<>` this `T` quite a bit, now we have basically two additional `T`'s with `ThemeOptionsProps<T>` and that's also why TypeScript generics are so confusing sometimes, because it's just a bit difficult to follow here.

Whenever we see a type parameter or you see that something is a generic, just look at the object properties in this case and just look at what type of relationship is being specified, that's what it's all about. 
All the other `T`'s here (e.g. `ThemeOptionsProps<T>`) this is just some necessary syntax, to make that work. It is all about the relationship.

`themes.tsx`, we have still errors here with (`setSelectedTheme`) inside `ThemeOptions()` component, we pass `themeOptions`and `selectedTheme` as props, we do not use `props.themeOptions`, we immediately destructure `themeOptions`and `selectedTheme` from `props`, we use `T` as the generic type for typing `props`, `T` defined separately:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions themeOptions={themeOptions} selectedTheme={selectedTheme}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p> 
    </section>        
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
}

function ThemeOptions<T>({
  themeOptions, 
  selectedTheme, // we destructure themeOptions, selectedTheme from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              onClick={() => setSelectedTheme(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


Now we have `themeOptions` this is a string, so now if we try to pass a number here `<ThemeOptions themeOptions={themeOptions} selectedTheme={5}/>`, let's say maybe this is an `id` of some theme. 
In this case we get an issue here, because it's saying type number is not assignable to type string, because here we're passing strings and we just specified that's going to be the same type for `themeOptions` as well as  `selectedTheme`, but now we're trying to pass a number here, until we get a warning from TypeScript.  If we pass a boolean here (`true`), we also get an issue. If we pass an object `{ }` here, we will also get an issue. 

This is some nice type safety.


### State setter function

Let's continue here with this setter function `setSelectedTheme`. 
We want to be able to click on any of these themes (names of themes) and it should properly update the state.

What we can do is `onThemeClick`, we can just specify a function here `() => setSelectedTheme` that will just set selected theme to whatever the theme is being clicked on. What we want to be able to do here is get that function let's say `onThemeClick`, when we actually click on one of these we want to fire a function `() => onThemeClick(theme)` and in that function we want to invoke this `onThemeClick()`, we need to pass the `theme` that we're mapping over here, so it can set it to the appropriate theme.

Here this is just going to be a function that accepts a `theme` and just sets the selected `theme` -> `onThemeClick={(theme) => setSelectedTheme(theme)}/>`

What we're doing here is when we click on `"dark"` for example, we get this `onClick={() => onThemeClick(theme)}` function that will run. It will invoke `onThemeClick` with "dark" as the `theme` and that function gets dark here `onThemeClick={(theme) => setSelectedTheme(theme)}/>` and that's what we set the selected theme to.

Now we are making this work again. 

Now how do we type this? 
Here we are accepting a new prop `onThemeClick` here 
`function ThemeOptions<T>({ themeOptions, selectedTheme, onThemeClick }:` , we should now also type this and we actually got a good suggestion here from Copilot
`onThemeClick: (theme: T) => void;`.

So we define a function like this in TypeScript `onThemeClick: () => void;`
and if we have a parameter of the function we can do it like this: `onThemeClick: (theme) => void;` It takes some parameter that we call `theme` and it doesn't return anything `void`.

But here there is a relationship (`T`) -> `onThemeClick: (theme: T) => void;`, because the theme that we pass here `onClick={() => onThemeClick(theme)}` is going to be of the same type as the `selectedTheme :T` as well as the type in the array `themeOptions: T[];`, so we can specify that here as well with functions `onThemeClick: (theme: T) => void;`
Now we have codified a relationship between these properties in this object. 

`themes.tsx`, we pass `themeOptions` and `selectedTheme` as props, we do not use `props.themeOptions`, we immediately destructure variables from `props`, we use `T` as the generic type for typing `props`, `T` defined separately:
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions 
        themeOptions={themeOptions} 
        selectedTheme={selectedTheme} 
        onThemeClick={(theme) => setSelectedTheme(theme)}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
  onThemeClick: (theme: T) => void;
}

function ThemeOptions<T>({
  themeOptions, 
  selectedTheme,
  onThemeClick // we destructure them from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              {/* onClick={() => setSelectedTheme(theme)} */}
              onClick={() => onThemeClick(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme} {/* here we have red squiggly lines */}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


Sometimes we will see generics being used in React. 
We will also see them used for hooks sometimes.
Actually a lot of things in React are generics. 


### `extends` (restricting the type parameter `T`)

Here inside the `button` we get red squiggly lines `{theme}` and it's saying something that "Type T is not assignable to type ReactNode" 

So here within the button we are trying to put something and that needs to be a ReactNode. ReactNode can be an actual jsx element e.g. `<button>`, it can also be text, it can even be a number, it can be all sorts of things, but it does need to be a ReactNode at the end of the day. 

Since we have specified this `theme` to be essentially of type `T`, we don't know for sure the `theme` is actually going to be a ReactNode, it could technically be something else. 

We could assert the `theme` right now is going to be a `string` -> `{theme as string}`:
but like we said it could be something else could be a number it could be something else. 

`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions 
        themeOptions={themeOptions} 
        selectedTheme={selectedTheme} 
        onThemeClick={(theme) => setSelectedTheme(theme)}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p> 
    </section>          
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
  onThemeClick: (theme: T) => void;
}

function ThemeOptions<T>({
  themeOptions, 
  selectedTheme,
  onThemeClick // we destructure them from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              {/* onClick={() => setSelectedTheme(theme)} */}
              onClick={() => onThemeClick(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme as string} {/* we assert the is going to be string */}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


We can also say that it's going to be some `React.ReactNode` -> `{theme as React.ReactNode}`:

`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions 
        themeOptions={themeOptions} 
        selectedTheme={selectedTheme} 
        onThemeClick={(theme) => setSelectedTheme(theme)}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
  onThemeClick: (theme: T) => void;
}

function ThemeOptions<T>({
  themeOptions, 
  selectedTheme,
  onThemeClick // we destructure them from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              {/* onClick={() => setSelectedTheme(theme)} */}
              onClick={() => onThemeClick(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme as React.ReactNode} {/* we assert it is going to be Reactnode */}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


Now the cleaner way of doing this `{theme as React.ReactNode}`, we want to restrict what this type `T` can be.

Right now this type parameter `T` can be any type.
We can restrict it a little bit better, 

so if we go back to one of our first examples here `convertToArray` it just takes an input and it just puts that in an array.

`helpers.ts` classic function
```ts
function convertToArray<T>(input: T): T[] { 
  return [input];
};

// we can call this with whatever type we want
convertToArray(5);
convertToArray('hello');
// etc.
```

There's a relationship between the parameter `(input: T)` and the return value of type `T[]`. The value for the parameter is going to be the same as what we get back in the array. 
We can call this now with any type we want, number, string etc.

#### `extends` (restricting the type parameter `T`)

But maybe we want to restrict this.

When we want to restrict it, we can use the `extends` keyword in here.

We can say this type `T` is going to be a `number` or a `string`. 

`helpers.ts` classic function, restricting the type parameter `T`
```ts
function convertToArray<T extends number | string>(input: T): T[] { 
  return [input];
};

// we can call this with number or string
convertToArray(5);
convertToArray('hello');

// we get red squiggly lines when we try to call that with boolean
convertToArray(true); 
```


So the type that we pass in now should be either a `number` or a `string`.

if we are trying to pass a boolean `convertToArray(true);`, we get a warning here, it's not allowed.

This is how you we restrict the type being passed in. 

So this does need to be a ReactNode.

That's what we want to do here as well:
This T extends `ReactNode`, now this comes from the `React` name space `React.ReactNode`

`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions 
        themeOptions={themeOptions} 
        selectedTheme={selectedTheme} 
        onThemeClick={(theme) => setSelectedTheme(theme)}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p>  
    </section>       
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
  onThemeClick: (theme: T) => void;
}

function ThemeOptions<T extends React.ReactNode>({
  themeOptions, 
  selectedTheme,
  onThemeClick // we destructure them from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              {/* onClick={() => setSelectedTheme(theme)} */}
              onClick={() => onThemeClick(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme} {/* we type T to be ReactNode */}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```

Now we can see that warning for `{theme}` inside `button` that "Type T is not assignable to type ReactNode" is gone as well.


### Inference vs specifying yourself

Now in React there are actually a lot of generics also with hooks. 

If we go to this example one more time:

`helpers.ts` classic function
```ts
function convertToArray<T>(input: T): T[] { 
  return [input];
};

// we can call this with whatever type we want
convertToArray(5);
convertToArray('hello');
// etc.
```

we have have `convertToArray()`

If I pass in the number 5 it can infer that what we are passing in.
When we call the function and we hover that, we can see that it has set the type parameter as a `number`. The input is going to be a number and the return value is going to be an array of numbers.

Intellisense output
```js
function converToArray<number>(input: number): number []
```


If we pass in a string "hello" it can infer that what we are passing in is a string etc. 


We could specify this `<string>` ourselves, this is something we could do `convertToArray<string>('hello');`. 

`helpers.ts` classic function
```ts
function convertToArray<T>(input: T): T[] { 
  return [input];
};

convertToArray<string>('hello');
```

When we call a generic function, we can specify the type `< >`, that we are passing in.

We have now specified explicitly `< >` that's going to be a `string`.

If we try to do this `convertToArray<number>('hello');`, we're passing in a number, now we will actually get red squiggly because we passing in a string, this needs to be a number. 


Now we don't need to do this `convertToArray<string>('hello');`, it can already infer from what we pass in, what the type is going to be `convertToArray('hello');`.

#### specifying the type in useState

In React this is relevant for example when we are using `useState` here. 
`useState` is actually also a generic function just like here `function convertToArray<T>(input: T): T[] {`, `useState` has a type parameter. 

What we could do, is we can call this function and we can specify by the type that we're passing in and now we're passing in a `string` ("light") -> `useState<string>("light");`  (based on `themes.tsx`) so we could say well this is going to be a string `<string>`, but we don't need to do that, Typescript can already infer that. 

When we hover `selectedTheme`, it has already inferred this to be a string. 

If we hover `useState("light")` we can see `useState` it has already inferred this to be a `string`.
and we can also take a look at the return value, so after the colon (`:`), it says we're going to get back an array `[ ]`  the first one is going to be a `string` and it's going to be a `selectedTheme` and the second thing we're going to get back is some complicated setter function, `Dispatch` function  in React. We can see that function should get a `<string>`.


Intellisense output on  `useState("light")`
```js
(alias) useState<string>(initialState: string | (() => string)):
[string, React.Dispatch<React.SetStateAction<string>>] (+1 overload)
import useState
```


If we want to update this like a theme for example to dark, that needs to be the string "dark", it needs to be a string.

if I make this state a number, let's say it has some `id` of the theme:
`const [selectedTheme, setSelectedTheme] = useState(8);`,
now if we hover `useState`, we can see it has already inferred this `useState` to be a number, the return value is going to be an array with first a number and then a setter function that will also only accept numbers.

Intellisense output on  `useState(8)`
```js
(alias) useState<number>(initialState: number | (() => number)):
[number, React.Dispatch<React.SetStateAction<number>>] (+1 overload)
import useState
```


With `useState` we could specify this `< >` -> `useState<string>("light")`, but it's not necessary.

#### Tricky

Now it's different when we have some other type.

So if we have a custom type, let's say maybe type `Theme` and this can be light dark or system `type Theme = "light" | "dark" | "system";`.

Now if we pass in `"light"` in `useState`, it will still think that, this is going to be a string and also this variable here `selectedTheme` it's been inferred as a string, not as a type `Theme`. This is a bit tricky, because TypeScript is just looking at this it's just seeing this `"light"` as just a general string.

`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

type Theme = "light" | "dark" | "system";

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions 
        themeOptions={themeOptions} 
        selectedTheme={selectedTheme} 
        onThemeClick={(theme) => setSelectedTheme(theme)}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p> 
    </section>        
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
  onThemeClick: (theme: T) => void;
}

function ThemeOptions<T extends React.ReactNode>({
  themeOptions, 
  selectedTheme,
  onThemeClick // we destructure them from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              {/* onClick={() => setSelectedTheme(theme)} */}
              onClick={() => onThemeClick(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme} {/* we type T to be ReactNode */}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


We can be more specific than that, we know it's going to be specifically of this type `Theme`. 

Here is actually an example where we do want to specify the type when we use `useState`:
`const [selectedTheme, setSelectedTheme] = useState<Theme>("light");`

We can also restrict the type parameter `T` by using `extends` on the type `Theme` as we have it now `type Theme = "light" | "dark" | "system";`.

We can be more specific than saying that `{theme}` used in button is of a `ReactNode` type, we can say `theme` is of a type specified by `T` and specifically also a type `Theme`, it is either `"light" | "dark" | "system"`.

We replace this `function ThemeOptions<T extends React.ReactNode>({` with 
`function ThemeOptions<T extends Theme>({`


`themes.tsx`
```tsx
"use client";

import React, { useState } from "react";

//const themeOptions = ["light", "dark", "system"]; // moved to Themes()

type Theme = "light" | "dark" | "system";

export default function Themes() {
  const [selectedTheme, setSelectedTheme] = useState<Theme>("light");
  const themeOptions = ["light", "dark", "system"];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-5 font-semibold">Themes</h1>

      <ThemeOptions 
        themeOptions={themeOptions} 
        selectedTheme={selectedTheme} 
        onThemeClick={(theme) => setSelectedTheme(theme)}/>

      <p className="mt-10">
        Selected theme: <strong>{selectedTheme}</strong>
      </p> 
    </section>        
  );
}

type ThemeOptionsProps<T> = {
  themeOptions: T[];
  selectedTheme: T;
  onThemeClick: (theme: T) => void;
}

{/*  function ThemeOptions<T extends React.ReactNode>({ */}
function ThemeOptions<T extends Theme>({
  themeOptions, 
  selectedTheme,
  onThemeClick // we destructure them from props immediately
}: 
  ThemeOptionsProps<T>
) {
  return (
      <ul className="list-disc">
        {props.themeOptions.map((theme, index) => (
          <li key={index}>
            <button
              {/* onClick={() => setSelectedTheme(theme)} */}
              onClick={() => onThemeClick(theme)}
              className={theme === selectedTheme ? "font-bold" : ""}
            >
              {theme} {/* we type T to be not ReactNode but Theme */}
            </button>
          </li>    
        ))}
      </ul>  
  );
}
```


But at the end of the day these generics (e.g. `T`) are just a way of specifying a relationship between, in this case properties in objects, or relationship between two parameters in a function, or a relationship between a parameter and a return value in a function. 
There is some relationship there that you can see as a developer and you want to codify that for extra type safety. 

We can use generics, or more appropriately a type parameter. 
Whenever we see something like `T` or some other time parameter just look at what relationship the developer has tried to codify.
