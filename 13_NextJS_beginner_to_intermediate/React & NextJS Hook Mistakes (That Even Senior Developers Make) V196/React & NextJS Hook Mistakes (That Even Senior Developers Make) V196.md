## V196 React & NextJS Hook Mistakes (That Even Senior Developers Make!)

Description: All the typical mistakes that people make (even senior developers!)

Also here:
"All 12 useState & useEffect Mistakes Junior React Developers Still Make in 2024
https://www.youtube.com/watch?v=-yIsQPp31L0

We'll talk about the top 12 mistakes that Junior react developers make when it comes to the useState and useEffect hooks in React

### 12/12 - State updates aren't immediate

Let's say we have a simple counter component, we have a simple button here on the page and it's showing us the count is Count when we click the button. We have handleClick and that's going to set the count to count + 1. What if we duplicate the line `setCount(count + 1);`, because let's say, we want to do it again.

The expectation now is that it will increase by 2 when we click. We we are going to click, we don't see an increase of 2, we actually see an increase of 1. No matter how many times we add `setCount(count + 1);`, if we click on the button, it does not increase by anything more than 1.

Because when you set the count `setCount(count + 1);` this is basically scheduling a state update, in this line we're scheduling that sometimes in the future React will update the count.

When you go to the next `setCount(count + 1);` line it's not like this count variable has already updated, this one has been scheduled and this second line`setCount(count + 1);` will also schedule some update in the future, but still using that same count variable

If we first load the page, initially `count` is going to be zero and in the second line `setCount(count + 1);` this `count` will also be zero

If we click on the button `count` is simply 0, so it's going to be 0 + 1 and the result of that is 1 and it will be scheduled in the future

When we get to the second line, `count` is still 0, it isn't 1 yet, so it's still 0, this will also schedule the `count` to be 1 in the future, when we get to second line counter still 0, it hasn't been updated yet and the same would be in another, e.g. 3rd `setCount(count + 1);` line for this, they're all gonna set counts to 1, therefore it doesn't become 2 as you would expect on the first click.

The solution to this is to use the updater function version of updating the state `setCount(prev => prev + 1);`

With useState we can also obtain like this with a function `=>`, if we do it with a function, we get the `prev` previous value as the argument, we can use that previous value instead of count, we can just take the previous value and increment it by 1.

This previous value `prev` is actually up to date, if we schedule something, we basically can get access to that, as here in the next line, as long as we use that updater function (second line of `setCount(prev => prev + 1);`). This is the most up-to-date value of that count variable. It increments by 2 every time we click on the button.

number-12.tsx

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    //setCount(count + 1);
    //setCount(count + 1); // <-  duplicate, this method does not work due to scheduling
    setCount(prev => prev + 1); // updater function
    setCount(prev => prev + 1); // <- increments by 2 when we click on the button.
  };

  return (
    <>
      <button>
        onClick={handleClick}
        className="bg-blue-500 px-4 py-2 text-white rounded mb-"
      >
        Click me
      </button>

      <p>Count is: {count}</p>
    </>
  );

}
```

We may think that we should always update the state with this updater function e.g. `setCount(prev => prev + 1);`and that's not entirely true, we can still use that `setCount(count + 1)`. There's nothing inherently wrong with updating like this, however in this case when we have multiple set counts we may want to use that updater function.

In all other scenarios essentially we can still use `setCount(count + 1)`

### 11/12 - Conditional rendering

Let's say we have some kind of ProductCard and in the props we get the ID, this component is responsible for taking some ID and just rendering the relevant product card for that ID

number-11.tsx

```tsx
import { useState, useEffect } from "react";

export default function ProductCard({ id }) {
	if (!id) {
	  return "No id provided";
	}

    const [seomething, setSomething] = useState("blabla";)

	useEffect(() => {},[something]);

	return <section>{/* Product card... */}</section>;
}
```

It's possible of course that the ID doesn't get passed, wherever it's used. When it doesn't pass the ID, in that case we could simply return "No id provided", then you don't get to this part `return <section>{` because we already use the return keyword (early return), it returns out of the function.

Component is just a function in React, as soon as you we use return keyword we stop there, it doesn't continue further. Here the only thing we're doing is just returning a string.

The problems here will start if we try using hooks after that - if block -, maybe we do useState, and after that useEffect. We could do something like this.

We got red squiggly lines warning with useState ->
"React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?"

We get the same problem with useEffect here.

The problem is that sometimes this ID may not exist and therefore we already return out of the function here. However sometimes the ID may exist, actually most of the time it does exist and then we actually do use useState and useEffect, they will actually be invoked.

That's not allowed in React, this invocation of the hooks always needs to be the same in every render,

#### to solve that problem,

we could simply invoke useState and useEffect before the if statement, put the if statement after the hooks

number-11.tsx

```tsx
import { useState, useEffect } from "react";

export default function ProductCard({ id }) {
    const [seomething, setSomething] = useState("blabla";)

	useEffect(() => {},[something]);

	if (!id) {
	  return "No id provided";
	}

	return <section>{/* Product card... */}</section>;
}
```

#### another error, we cannot use useState and useEffect in server components in Next.js

We got another error here since we are using Next.js. These days we have clients and server components, essentially we cannot use useState and useEffect in server components, we have to make this a client component

number-11.tsx

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ProductCard({ id }) {
    const [seomething, setSomething] = useState("blabla";)

	useEffect(() => {},[something]);

	if (!id) {
	  return "No id provided";
	}

	return <section>{/* Product card... */}</section>;
}
```

#### Small refactor

Now as a matter of style having these two returns in a component function can be disliked. We can do it in one return. If there is no ID, return "No id provided", otherwise if there is an ID, render the product card. This will work the exact same, it looks better to only have one return keyword.

number-11.tsx

```tsx
"use client";

import { useState, useEffect } from "react";

export default function ProductCard({ id }) {
    const [seomething, setSomething] = useState("blabla";)

	useEffect(() => {},[something]);

	return (
	  <section>
        {!id
	      ? "No id provided"
	      : {
	        /* Product card... */
	        <div>Proiduct card {id}</div>
	        }}
	  </section>;
	);
}
```

### 10/12 - Updating object state

Incorrectly updating an object's state.

Sometimes we are going to have an object in state.

Let's say we have this object here, it has a name property, city and age. There can be other things in this form, let's say we just have one input for now.

number-10.tsx

```tsx
"use client";

import { useState } from "react";

export default function User() {
  const [user, setUser] = useState({ name: "", city: "", age: 50 });
  console.log(user);

  const handleChange = (e) => {
    setUser((user.name = e.target.value)); // <- this will not work
  };

  return (
    <form>
      <input type="text" onChange={handleChange} placeholder="Your name" />
    </form>
  );
}
```

When we start typing in the form, we want to actually update the state to be that text. What we can say is onChange, every time there is a change in that input field, run the function handleChange.
We have this event `e` and when we try to update the objects, we may do a couple of things wrong here.

#### couple things wrong

We cannot just say something like user.name is e.target.value `setUser((user.name = e.target.value));`. We're going to assign that to text to user.name, but this will not work.

When we log the user here `console.log(user);`, we can actually see what it will be, it's just going to be an object with name empty CONSOLE OUTPUT `{ name: "", city: "", age: 50 }`

so now I'm going to type something and now you can

We actually get errors, this `setUser((user.name = e.target.value));` doesn't work of course because we actually need to return an object

Let's make this an object and in that object we have a name, we should set that name to e.target.value (whatever we put in the input field)

number-10.tsx

```tsx
"use client";

import { useState } from "react";

export default function User() {
  const [user, setUser] = useState({ name: "", city: "", age: 50 });
  console.log(user);

  const handleChange = (e) => {
    //setUser((user.name = e.target.value)); // <- this will not work
    setUser({
      name: e.target.value,
    });
  };

  return (
    <form>
      <input type="text" onChange={handleChange} placeholder="Your name" />
    </form>
  );
}
```

Now if we try typing, we can see initially we have this object CONSOLE OUTPUT `{ name: "", city: "", age: 50 }`, and now if we start typing, we can see we get an object again and it has the name correctly, it doesn't have the city and age properties. CONSOLE OUTPUT `{ name: "this is text from the input field"}`

Our objects here in console log should have name and also a city and age.

When we do it like this `name: e.target.value,`, this is a common mistake, we are not copying over the city and age properties.

What we want to do here, is we can take the user objects here and we can just spread that out over here. This will copy all of those properties, including name, into this new object that we're passing to setUser. Then we have this name `name: e.target.value,` after that, so this will override that previous name.

We are using `...user` to spread output of an exact initial form of `{ name: "", city: "", age: 50 }`, we are coping over the name, city and age, we are spreading user object

number-10.tsx

```tsx
"use client";

import { useState } from "react";

export default function User() {
  const [user, setUser] = useState({ name: "", city: "", age: 50 });
  console.log(user);

  const handleChange = (e) => {
    //setUser((user.name = e.target.value)); // <- this will not work
    setUser({
      ...user,
      name: e.target.value,
    });
  };

  return (
    <form>
      <input type="text" onChange={handleChange} placeholder="Your name" />
    </form>
  );
}
```

so if we do this, first what we have is the initial object CONSOLE OUTPUT `{ name: "", city: "", age: 50 }`, and if we start typing, we can see our object has the same properties with the updated name

CONSOLE OUTPUT `{ name: "this is text from the input field", city: "", age: 50 }`

this is the correct way of updating one property in an object

####

We are using this user variable here, in practice you do see a lot of people use the updater function here `(prev => {...prev, name: e.target.value,};` (it's not necessary, but a lot of people seem to do it). We can get the previous value of user, instead of using user we can just use prev.

This is also a common syntax when we do this, we have to pay attention to how you're returning something here, here it's a function now. Now when you have the first curly brace, that's not going to be the opening curly brace of an object, this is going to be the opening curly brace of the function block.

number-10.tsx

```tsx
"use client";

import { useState } from "react";

export default function User() {

  const [user, setUser] = useState({ name: "", city: "", age: 50 });
  console.log(user);

  const handleChange = (e) => {
    //setUser((user.name = e.target.value)); // <- this will not work
    setUser(prev => {
      //...user,
      ...prev,
      name: e.target.value,
    });
  };

  return (
    <form>
      <input type="text" onChange={handleChange} placeholder="Your name" />
    </form>
  );
}
```

We can wrap it in parentheses, so we don't have to use the return keyword, everything in the parentheses will be returned by the function

```tsx
const handleChange = (e) => {
  //setUser((user.name = e.target.value)); // <- this will not work
  setUser((prev) => ({
    //<- wrap in extra parenthesis to return an object without writing a return keyword
    //...user,
    ...prev,
    name: e.target.value,
  }));
};
```

**or you can actually write the return keyword** here so then we would go into the function block itself and then have an actual return statement, and we would return an object here with these things
`...prev, name: e.target.value,` in there

```tsx
const handleChange = (e) => {
  //setUser((user.name = e.target.value)); // <- this will not work
  setUser((prev) => {
    //<- wrap in extra parenthesis to return an object without writing a return keyword
    return {
      ...prev,
      name: e.target.value,
    };
  });
};
```

and so now looks a bit strange with all these curly braces and parentheses, really make sure you've mastered JavaScript itself

number-10.tsx

```tsx
"use client";

import { useState } from "react";

export default function User() {
  const [user, setUser] = useState({ name: "", city: "", age: 50 });
  console.log(user);

  const handleChange = (e) => {
    //setUser((user.name = e.target.value)); // <- this will not work
    setUser((prev) => ({
      //...user,
      ...prev,
      name: e.target.value,
    }));
  };

  return (
    <form>
      <input type="text" onChange={handleChange} placeholder="Your name" />
    </form>
  );
}
```

this is another way of doing the same thing using return keyword ->

number-10.tsx

```tsx
"use client";

import { useState } from "react";

export default function User() {

  const [user, setUser] = useState({ name: "", city: "", age: 50 });
  console.log(user);

  const handleChange = (e) => {
    //setUser((user.name = e.target.value)); // <- this will not work
    setUser(prev => ({
      return {
        ...prev,
        name: e.target.value,
      };
    }));
  };

  return (
    <form>
      <input type="text" onChange={handleChange} placeholder="Your name" />
    </form>
  );
}
```

### 9/12 - 1 Object state instead of multiple smaller ones

number 9. Let's say we have a form with a lot of inputs,

in the real world we can have forms with dozens of inputs and we want to keep state of all of that

number-9.jsx

```jsx
"use client";

import { useState } from "react";

export default function Form() {
	const [firstName, setFirstName] = useState(""); // <- we do not want state for each input filed
	const [lasttName, setLastName] = useState("");  // <- we do not want state for each input filed

	return (
      <form className="flex flex-col gap-y-2">
        <input
          type="text"
          name="firstName"
          placeholder="first name" // <- placeholder is a default text displayed in the input field, hinting what kind of text value we want in that input field
          className="px-4 py-2"
        />
        <input
          type="text"
          name="lastName"
          placeholder="last name"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="address"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="zipCode"
          placeholder="zip code"
          className="px-4 py-2"
        />
	);
}
```

so let's say we have first name, last name, email, password, address, zip code etc. and now a beginner may think we also need to create a separate state for each of the input fields, for all of them

that's not what we want to do!

#### first version of syntax

It's cleaner to just use one object for the whole form. We can have one object as state and then it would just be form, setForm and then in the form we would like to have a key for each input. Inputs are empty initially.

number-9.jsx

```jsx
"use client";

import { useState } from "react";

export default function Form() {
	const [form, setForm] = useState({
	    firstName: "",
	    lastName: "",
	    email: "",
	    password: "",
	    address: "",
	    zipCode: "",
	});

	const handleChange = e => {
	  setFrom({
	    ...form,
	    firstName: e.target.value,
	  }); // <- we are setting a new object here
	};

	return (
      <form className="flex flex-col gap-y-2">
        <input
          type="text"
          onChange={handleChange}
          name="firstName"
          placeholder="first name" // <- placeholder is a default text displayed in the input field, hinting what kind of text value we want in that input field
          className="px-4 py-2"
        />
        <input
          type="text"
          name="lastName"
          placeholder="last name"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="address"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="zipCode"
          placeholder="zip code"
          className="px-4 py-2"
        />
	);
}
```

Now if we want to update values in the object, it's actually very easy, we can just use one function.
If we want to put text in the input, this firstName should get updated, we can use onChange, we want to run a function called handleChange, which we're going to define, we want to update that,

we have setForm().
Now we want to update one property in an object, so it should be an object `{}`, we can spread the form, we get all the contents of that form `...form` and then we want to override firstName with whatever we put in the form, we get that from `e.target.value`

Now firstName will get properly updated here in the form.

#### updater function version (second version of syntax)

In practice you're gonna see this updater function format as well,

when we want to return something, we need to wrap it in parentheses or we need to use that return keyword like we it was before, then we can use previous `...prev` instead of the `...form`. This is pretty common to see.

number-9.jsx

```jsx
"use client";

import { useState } from "react";

export default function Form() {
	const [form, setForm] = useState({
	    firstName: "",
	    lastName: "",
	    email: "",
	    password: "",
	    address: "",
	    zipCode: "",
	});

	const handleChange = e => {
	  setFrom(prev => ({ // <- we use prev updater function
	    ///...form,
	    ...prev,
	    firstName: e.target.value,
	  })); // <- we are setting a new object here
	};

	return (
      <form className="flex flex-col gap-y-2">
        <input
          type="text"
          onChange={handleChange}
          name="firstName"
          placeholder="first name" // <- placeholder is a default text displayed in the input field, hinting what kind of text value we want in that input field
          className="px-4 py-2"
        />
        <input
          type="text"
          name="lastName"
          placeholder="last name"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="password"
          placeholder="password"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="address"
          placeholder="address"
          className="px-4 py-2"
        />
        <input
          type="text"
          name="zipCode"
          placeholder="zip code"
          className="px-4 py-2"
        />
	);
}
```

#### come back to the first version of syntax

we're setting a new object here `{}`, we copy everything over, `...form` from the form and then we override the firstName, that's only the firstName, what if we type something in the form in the lastName field?

We can just copy `onChange={handleChange}` for all the other ones as well. We can actually do that, this is the best way to do this.

These inputs they also have a name attribute, here the name is firstName, name is lastName, name is email, name is passwords, these names are the exact same as what we have in the objects for the keys.

What we can use is actually instead of hard coding `firstName: e.target.value,` there is something else that we got in this event variable `e`, which is either `e.target.name` and we can use that for the object key, that we want to override. We can actually write this in JavaScript like this `[e.target.name]: e.target.value,`

If we type in the input field, we're going to run the handleChange function that will grab `e.target.name` for each input field e.g. lastName, email etc.
That will properly update `lastName: "", email: "",` in useState.
We can use this handleChange for all of the inputs in the form.

number-9.jsx

```jsx
"use client";

import { useState } from "react";

export default function Form() {
	const [form, setForm] = useState({
	    firstName: "",
	    lastName: "",
	    email: "",
	    password: "",
	    address: "",
	    zipCode: "",
	});

	const handleChange = e => {
	  setFrom({
	    ...form,
	    [e.target.name]: e.target.value, // <- e.target.name as key, this will take the name attribute as a key e.g. lastName, email etc.
	  }); // <- we are setting a new object here
	};

	return (
      <form className="flex flex-col gap-y-2">
        <input
          type="text"
          onChange={handleChange}
          name="firstName"
          placeholder="first name" // <- placeholder is a default text displayed in the input field, hinting what kind of text value we want in that input field
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="lastName"
          placeholder="last name"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="email"
          placeholder="email"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="password"
          placeholder="password"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="address"
          placeholder="address"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="zipCode"
          placeholder="zip code"
          className="px-4 py-2"
        />
	);
}
```

#### updater function version (second version of syntax) for all of the input fields

If we want to use the updater function here, it works the exact same, we just make this a function and now the opening curly brace with functions is going to be like the opening of the block `{`, so we need to wrap this in parentheses `prev => ({})`. Also need previous to spread the previous value here `...prev` and then override it like this `[e.target.name]: e.target.value,`

number-9.jsx

```jsx
"use client";

import { useState } from "react";

export default function Form() {
	const [form, setForm] = useState({
	    firstName: "",
	    lastName: "",
	    email: "",
	    password: "",
	    address: "",
	    zipCode: "",
	});

	const handleChange = e => {
	  setFrom(prev => ({ // <- using prev, different syntax
	    ...prev,
	    [e.target.name]: e.target.value, // <- e.target.name as key, this will take the name attribute as a key e.g. lastName, email etc.
	  })); // <- we are setting a new object here
	};

	return (
      <form className="flex flex-col gap-y-2">
        <input
          type="text"
          onChange={handleChange}
          name="firstName"
          placeholder="first name" // <- placeholder is a default text displayed in the input field, hinting what kind of text value we want in that input field
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="lastName"
          placeholder="last name"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="email"
          placeholder="email"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="password"
          placeholder="password"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="address"
          placeholder="address"
          className="px-4 py-2"
        />
        <input
          type="text"
          onChange={handleChange}
          name="zipCode"
          placeholder="zip code"
          className="px-4 py-2"
        />
	);
}
```

or we actually want to go in here and use the return keyword like we saw before (not shown here, but we can use implementations from the past).

#### We can use first syntax, we don't need the previous value `...prev`

### 8/12 - Information can be derived from state / props

Let's say we have some kind of cart and this card is keeping track of the quantity and every time we click this button, we run the function handleClick which just increases the quantity by one

Now let's say we want to show the total price here as well, we need to keep track of the total price.

A beginner may think to add a new useState holding a totalPrice, initially zero `const [totalPrice, setTotalPrice] = useState(0);` and then every time we update the quantity we want to update the totalPrice.

A beginner will also want to use a useEffect, we want to to run this function every time the quantity changes (we have a dependency array, every time this quantity variable changes).

Every time we click the button, we run this function `setQuantity(quantity + 1);` and it will update the quantity, which means that this useEffect will run and it will set the totalPrice. It makes sense logically when you think about it like that. Every time a click of a button, `totalPrice` increases by five.

number-8.jsx

```jsx
import { useState } from "react";

const PRICE_PER_ITEM = 5;

export default function Cart() {
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleClick = () => {
    setQuantity(quantity + 1);
  };

  useEffect(() => {
    setTotalPrice(quantity * PRICE_PER_ITEM);
  }, [quantity]); //<- this will run initially 1 * 5

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-500 px-4 text-white rounded"
      >
        Add 1 item
      </button>

      <p>Total price: {totalPrice}</p>
    </div>
  );
}
```

#### Less bloated solution

This is very bloated and this is not necessary at all, if we want to know the totalPrice we don't need to use useState or useEffect, we can derive it from the quantity and the price per item.

Here we can just create a variable in the function body.

It still works the exact same (as the useEffect version), because what happens is initially, when it first renders this component Cart(), it will go in the function body line by line, the quantity will be multiplied by price, initially total price is 5.

Then if we click handleClick, this function will run, it will update the quantity, which will re-render Cart() component, so we will go into the function body again, this time quantity will be 2, because we added 1, and then we run this line again `const totalPrice = quantity * PRICE_PER_ITEM;` this statement should will be 2 times the price per item (5) which is 10 (output on the page).

We don't need all these hooks every time, if we can derive or calculate it from already existing states, we don't need to create new state and use useEffect.

number-8.jsx

```jsx
import { useState } from "react";

const PRICE_PER_ITEM = 5;

export default function Cart() {
  const [quantity, setQuantity] = useState(1);
  //const [totalPrice, setTotalPrice] = useState(0);
  const totalPrice = quantity * PRICE_PER_ITEM;

  const handleClick = () => {
    setQuantity(quantity + 1);
  };

  //useEffect(() => {
  //  setTotalPrice(quantity * PRICE_PER_ITEM);
  //}, [quantity]) //<- this will run initially 1 * 5

  return (
    <div>
      <button
        onClick={handleClick}
        className="bg-blue-500 px-4 text-white rounded"
      >
        Add 1 item
      </button>

      <p>Total price: {totalPrice}</p>
    </div>
  );
}
```

#### Another typical example of this

is for example if you have the firstName and then maybe also keeping track of the lastName.

Now we want to know the full name, so we may think we need another useState with fullName, that's not necessary, we can derive it from already existing states, avoiding typical junior developer mistake (bloating with useStates).

```jsx
import { useState } from "react";

export default function Names() {
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const fullName = firstName + ' ' + lastName;
```

### 7/12 - Primitives vs non-primitives

Let's say we have a price component, when we click the button we run a function called handleClick which we have defined, the only thing it does is set the price to zero every time. Initially price is zero and setPrice also gonna set the price to zero.

In React if the state doesn't change the component doesn't re-render.

Rendering a component just means in the function body we just run all the statements again.
Let's check that, we log using dev tools console in the browser.

number-7.jsx

```jsx
"use client";

import { useState } from "react";

export default function Price() {
  console.log("Component rendering...");

  const [price, setPrice] = useState(0);

  const handleClick = () => {
    setPrice(0);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 py-2 px-4 rounded text-white"
    >
      Click me
    </button>
  );
}
```

Now if we load the page and this component first mounts, we see component rendering, when it first mounts it's going to run all the statements in the function body.

Now if we keep clicking, we can see it doesn't log the message "Component rendering...", because it can see that this `setPrice(0);` is the same value as it already is `= useState(0);`, it won't re-render the component.

That is true for a number, string or boolean e.g. `setPrice(true);`, `= useState(true);`, it won't re-render the component.

However what if we actually have an object here, this may actually describe the price, it may have a number for the price let's say 100 and it may also have some kind of boolean in there, totalPrice: true

number-7.jsx

```jsx
"use client";

import { useState } from "react";

export default function Price() {
  console.log("Component rendering...");

  const [price, setPrice] = useState({
    number: 100,
    totalPrice: true,
  });

  const handleClick = () => {
    setPrice({
      number: 100,
      totalPrice: true,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 py-2 px-4 rounded text-white"
    >
      Click me
    </button>
  );
}
```

Now the price variable here is an object with these two properties (number: 100, totalPrice: true), what happens if we set the price to an object with the exact same properties and values?

Now what happens is whenever we click, the component re-renders, why is that?

That's because in JavaScript there are primitive values (e.g. number, string, boolean) that are passed by value and **the objects and arrays are passed by reference**

#### Simple example in plain JavaScript

Simple example in plain JavaScript e.g. if we have in a dev tools console `const a = 5;` `const b = 5;`, now if we do `a === b`("a" is strictly equal to "b"), console returns true (JavaScript tells that's true).

If we have a variable `const c ="test"`, `const d ="test"`, now if we do `c === d`, JavaScript console returns that's `true`

However if we have objects, with the keys of hello:

```js
const y = {
  hello: 1,
};

const z = {
  hello: 1,
};
```

if we write in the console `y === z`(y is strictly equal to z), the JavaScript console returns `false`

because in JavaScript whenever we write an object literal like this e.g.`{ hello: 1 };` we're not actually working with the object itself, we're working with a reference (a pointer),

we need to know that this is not the actual value that we're working with

we're working with an address (the address for this first object is going to be different from the address of this second object),

an object is more like a box in the real world, we can have one box with the exact same contents as another box, but there are two different boxes,

an object may have the exact same contents as another object, but there's still two different objects, we work with their reference

In contrary, we can actually work with the actual value of strings and numbers and boolean.

Using different objects with the same values inside, the component re-renders, in our case it keeps re-rendering every time we click a button.

#### dangerous

In practice this is mostly dangerous when we have some kind of dependency array, most commonly with useEffects, we are going to run function specified within useEffect every time, the values in the dependency array change (if we have an empty dependency array it will run only once when it first) mounts.

We want to be careful with this because this object is going to change every time it will be updated.

Typically we don't want to depend on an object, we want to depend on a primitive value (like a number, boolean, string).

We can also just look at the contents of the objects, ...

number-7.jsx

```jsx
"use client";

import { useState } from "react";

export default function Price() {
  console.log("Component rendering...");

  const [price, setPrice] = useState({
    // <- price is an object {,} here
    number: 100,
    totalPrice: true,
  });

  const handleClick = () => {
    setPrice({
      number: 100,
      totalPrice: true,
    });
  };

  useEffect(() => {}, [price]); // <- every time price changes, function within useEffect runs

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 py-2 px-4 rounded text-white"
    >
      Click me
    </button>
  );
}
```

... We can also just look at the contents of the objects, so we can say `price.number` in the dependency array, so it is depending on a primitive value, which will prevent this useEffect function `useEffect(() => {},` from unnecessarily running

number-7.jsx

```jsx
"use client";

import { useState } from "react";

export default function Price() {
  console.log("Component rendering...");

  const [price, setPrice] = useState({
    // <- price is an object {,} here
    number: 100,
    totalPrice: true,
  });

  const handleClick = () => {
    setPrice({
      number: 100,
      totalPrice: true,
    });
  };

  useEffect(() => {}, [price.number]); // <- every time price changes, function within useEffect runs

  return (
    <button
      onClick={handleClick}
      className="bg-blue-500 py-2 px-4 rounded text-white"
    >
      Click me
    </button>
  );
}
```

### 6/12 - Initializing state with object

Let's say we have some kind of BlogPost component, we have the post and we can set the post and we have a useEffect, in useEffect we have a function with the dependency array that determines when the function should run (an empty dependency array means it's going to run only when it first mounts).

When the BlogPost() component mounts, it's going to fetch the post, eventually it gets a response, it will parse that response as json, meaning it will convert response from json to a normal JavaScript object (`data` here), that is what we are going to set as the post.

This can take some time, can take multiple seconds, but we are already rendering post, the title and the body. We see an error that says "cannot read properties of undefined ". The `post.title` is undefined because we haven't specified an initial value in useState(); Initially post is going to be undefined. It is going to try to do `undefined.title` and that's not possible.

#### Also we need to remember useEffects runs after rendering

First we try to render `<article>` on the page, and then after that useEffect runs

While we're waiting for fetch and promises to finish and we actually retrieve post data, we are already trying to access `post.title`, `post` is initially undefined and if we try to access something that is undefined in JavaScript, we're going to get this error.

number-6.jsx

```jsx
"use client";

import { useEffect, useState } from "react";

export default function BlogPost() {
  const [post, setPost] = useState(); // <- error, we do not have initial state

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      });
  }, []);

  return (
    <article>
      <h1>{post.title}</h1>{" "}
      {/* <- error, it is trying to render undefined.title*/}
      <p>{post.body}</p>
    </article>
  );
}
```

One way around this is to use optional chaining (saying `post` may not exist, it may be undefined),
Using optional chaining, if we try to access something it does not throw an error. We actually get the data as well. People typically will initialize this `useState();` with undefined or leave it empty.

It's better to make it explicit that it's initially null....

number-6.jsx

```jsx
"use client";

import { useEffect, useState } from "react";

export default function BlogPost() {
  const [post, setPost] = useState(); // <- error, we do not have initial state

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      });
  }, []);

  return (
    <article>
      <h1>{post?.title}</h1>{" "}
      {/* <- we do not get an error, it is trying to render undefined.title, with optional chaining that is possible */}
      <p>{post?.body}</p> {/* <- optional chaining, we do not get the error */}
    </article>
  );
}
```

...It's better to make it explicit that it's initially null.

#### **In JavaScript if we want to mark something explicitly as not-existing we use null.**

"undefined" is more accidentally not-existing essentially. `null` is when we are really deliberate about it.

Here we are deliberate, initially it's empty, for the empty state initially it should be `null`.
Initially it's going to be `null` and we can try accessing title and body.

It works the same way here, so if we try to remove optional chaining, this initially is going to throw an error again. We cannot access `null.title`.

number-6.jsx

```jsx
"use client";

import { useEffect, useState } from "react";

export default function BlogPost() {
  const [post, setPost] = useState(null); // <- null as the initial state

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
      });
  }, []);

  return (
    <article>
      <h1>{post?.title}</h1>{" "}
      {/* <- we do not get an error, it is trying to render undefined.title, with optional chaining that is possible */}
      <p>{post?.body}</p>
    </article>
  );
}
```

#### We could use optional chainings, but a cleaner solution is to use some kind of loading state.

We want to **not render anything until we actually have the data from the post**

That makes much more sense.

What we can do here, is we can have something like loading, if it is true, we may just want to say nothing or maybe `loading...` and otherwise if it is not loading, we actually want to display `post.title` and `post.body`

We are going to put this in a React Fragment because we don't want to clutter up the markup with divs or anything (we don't need a div),

We have a state for loading, we can check if it is still loading, we can say loading initially is true.
Then in the function of useEffect it starts fetching this, eventually it has received data, then we setLoading to false.

number-6.jsx

```jsx
"use client";

import { useEffect, useState } from "react";

export default function BlogPost() {
  const [post, setPost] = useState(null); // <- null as the initial state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, []);

  return (
    <article>
      {/* <- instead of optional chaining we use loading */}
      {/* <- if it is true we have a 'message...', otherwise we display details */}
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1>{post.title}</h1>
          <p>{post.body}</p>
        </>
      )}
    </article>
  );
}
```

The error disappears, we get a loading state (loading message) and then we get the post

This is a much cleaner solution than using optional chaining as before.

#### We don't really want to fetch in useEffect and we'll talk more about this later

### 5/12 - TypeScript mistakes

Very typical TypeScript mistake in React

we have .tsx file, previously in mistakes we had mostly .jsx (plain JavaScript)

We take the previous example. We have this post in useState, initially the post is null.
In rendering (return) we also have loading state, if it's loading, we just want to render loading message. We're fetching the data when the component first mounts (empty dependency array), only once when it first mounts it will fetch the post. Eventually when we get the response, we setPost to the data and we setLoading to false. When loading is false, the post has been fetched and we want to display the title and body.

number-5.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export default function BlogPostExample() {
  const [post, setPost] = useState(null); // <- null as the initial state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, []);

  return (
    <article>
      {/* <- instead of optional chaining we use loading */}
      {/* <- if it is true we have a 'message...', otherwise we display details */}
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1>{post.title}</h1> {/* <-red squiggly lines on post, TS warning */}
          <p>{post.body}</p> {/* <-red squiggly lines on post, TS warning */}
        </>
      )}
    </article>
  );
}
```

#### TypeScript warning with post

Previously we didn't get any red squiggly lines, but now TypeScript is giving us a warning
saying `post` is possibly null `TS intellisense -> const post: null` (of type null) and that's because with TypeScript in React, if we are using state (as with useState), TypeScript can infer what the type of this variable is going to be.

For loading for example `const [loading, setLoading] = useState(true);` if we hover over `loading` TypeScript (intellisense) is telling that loading is going to be of type boolean `TS intellisense -> const loading: boolean`

How does TypeScript know that? We have not specified this ourselves

We could specify it ourselves and the way we would specify it, is with this weird looking angled brackets, we could say this loading state is going to be of type boolean `const [loading, setLoading] = useState<boolean>(true);`

But TypeScript could already infer that so we don't need to do that -> `<boolean>`

Typescript can infer from the initial value that we pass in, what type it's going to be, "useState(true)".
`const [loading, setLoading] = useState(true);`

If we have text here for example `const [text, setText] = useState('');` initially that may be a string

We could specify string here `const [text, setText] = useState<string>('');`but we don't need to do that because TypeScript can infer that this is going to be a string,

If we hover over text `const [text, setText] = useState('');` we can see it has already been inferred as a string `TS intellisense -> const text: string`

What's the benefit of this?

TypeScript knows that text is going to be a string, if typescript has the correct type here e.g. string TypeScript can then help us out e.g. let's say in the rendering (return section) we are trying to do something with text, e.g. toUpperCase

TypeScript will not give a warning with that `text.toUpperCase()` because it knows that toUpperCase is a method that we can use on a string

However if we try doing this on the loading variable `loading.toUpperCase()` which is a boolean we get an error.

TypeScript has inferred `loading` to be a boolean, TS will tell us that toUpperCase does not exist on type boolean.

number-5.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export default function BlogPostExample() {
  const [post, setPost] = useState(null); // <- null as the initial state
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, []);

  return (
    <article>
      {/* <- instead of optional chaining we use loading */}
      {/* <- if it is true we have a 'message...', otherwise we display details */}
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1>{post.title}</h1> {/* <-red squiggly lines on post, TS warning */}
          <p>{post.body}</p> {/* <-red squiggly lines on post, TS warning */}
          {
            text.toUpperCase() // <-toUpperCase is a method on string
          }
          {
            loading.toUpperCase() // <-error, toUpperCase is not a method on boolean
          }
        </>
      )}
    </article>
  );
}
```

By correctly typing things we get guard rails from TypeScript.

another example, `const [count, setCount] = useState(100);`, these are all primitive values e.g. number

We could specify this count is going to be of type number, but we do not need to, TypeScript can look at the initial value and infer this is going to be of type number.
`const [count, setCount] = useState<number>(100);`

`TS intellisense -> const count: number`

TypeScript can automatically infer type when we use a primitive value like a boolean, string, number

That's not the case when we have objects.

Here with objects initially we want to have `null` (as in `const [post, setPost] = useState(null);`) but later we know that it's not going to be null. We're actually going to set it to some data.
This is quite common when you have some fetching in a component.

TypeScript infers type of the `post` to be type null and that is not what we want. `TS intellisense -> const post: null`

If it's of type null we cannot access `post.title` and `post.body` and we actually do need to specify what type it's going to be.

We have these built-in types like `<string>`, `<number>`, `<boolean>`, but we can also create our own type, we can say this is going to be of type `<Post>`

(Maybe this post has tags for example and maybe it's an array of strings.)

Now we are telling TypeScript this `post` variable is going to be of type `Post`. Now we can safely access `post.title` and `post.body`, we don't have red squiggly lines anymore, but now we got red squiggly lines here under `null` here `useState<Post>(null)`. This is because we are telling TypeScript this `post` is going to be of this type `null`, now what we're passing in is `null`.

We specified type `Post` that it's gonna be an object with `title` and `body`, but what we are passing is `null`and it's the initial value. Typically what we want to do is we can say it's going to be of type (Post or null), `useState<Post | null>(null);`. It could be `null` initially but eventually it's going to be a type `Post`.

number-5.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type Post = {
  // it is going to be an object, curly braces
  title: string;
  body: string;
  tags: string[]; // tags - array of strings
};

export default function BlogPostExample() {
  const [post, setPost] = useState<Post | null>(null); // or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/posts/1")
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setLoading(false);
      });
  }, []);

  return (
    <article>
      {/* <- instead of optional chaining we use loading */}
      {/* <- if it is true we have a 'message...', otherwise we display details */}
      {loading ? (
        "Loading..."
      ) : (
        <>
          <h1>{post.title}</h1>{" "}
          {/* <- we can safely access title due to Post type */}
          <p>{post.body}</p> {/* <-we can safely access body due to Post type */}
        </>
      )}
    </article>
  );
}
```

### 4/12 - Not using custom hooks

Junior React developers seem to be a little bit confused or scared to use custom hooks.

Let's say that this component needs to know the width of the window.

In Next.js when we are using useState or useEffect we need to make this a client component `"use client";`.

We're going to keep track of that window size in useEffect (we want to run function in UseEffect only initially when the component first mounts), in this function we're simply going to attach an event listener to the window object, whenever it resizes we, want to update the state. This function `handleWindowsSizeChange` we want to attach, this function will run every time there is a resize event.

number-4.tsx

```tsx
"use client";

import React { useState, useEffect } from "react";

export function ExampleComponent1() {
    const [windowSize, setWindowSize] = useState(1920);

    useEffect(() => {
      const handleWindowsSizeChange = () => {
        setWindowSize(window.innerWidth);
      };
      windows.addEventListener("resize", handleWindowSizeChange);

      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }, []);


	return <div>Component 1</div>;
}


export function ExampleComponent2() {
	return <div>Component 2</div>;
}
```

These useEffects they also have a so-called cleanup function, because when this component unmounts for example, maybe we're navigating away and this component should not be visible anymore, this event listener `windows.addEventListener` is still attached to the window, and we want to remove that when this component is not being used.

In react we can also return a function, this function will run when we unmount the component and in this function we can simply remove this event listener. It's a cleanup function, we need to clean up our mess before we completely remove this component.

```tsx
return () => {
  window.removeEventListener("resize", handleWindowSizeChange);
};
```

It's also important to know the inner details of how all of this works.

The important point here, is that this is actually a quite common scenario, we have some states and we update it in useEffect.

This is a lot of code, now very commonly other components will want the same information.

Let's say this example component 2 also wants this code, a naive Junior React developer would simply duplicate all of this, he would also put all of this code in those other components.
Now we're going to bloat up all our other components that need access to that as well, very duplicative code.

```tsx
export function ExampleComponent2() {
  const [windowSize, setWindowSize] = useState(1920);

  useEffect(() => {
    const handleWindowsSizeChange = () => {
      setWindowSize(window.innerWidth);
    };
    windows.addEventListener("resize", handleWindowSizeChange);

    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return <div>Component 2</div>;
}
```

#### Refactoring to a custom hook (DRY principle)

No if we've learned JavaScript properly we may have heard of the DRY principle (Don't Repeat Yourself).

Whenever we have some kind of repetition it's a good candidate for refactoring it into something that's a little bit more reusable, and that's the same when we use Hooks in React.

Here we can create a custom hook out of this, it's just refactoring this into a separate utility function or helper function.

We can just create a function, typically the name of these start with the word "use" to indicate that it will have React hooks in it.

No need to duplicate ourselves, we're going to refactor it into one function, just like we would do otherwise in JavaScript if we have some kind of repetition, it's the same in React. The only difference is basically that we add the word "use" in front of it, because we're using useState and useEffect in there. This helps indicate that we're using these React features under the hood.

We can just use `useWindowSize();` in components, we can just call that function and it will basically run as the exact same, as what we had before, but we can add it in alla components we need without duplication of the code. This is much cleaner looking in the components.

In the components we wanted access to the `windowSize`, we do need to return the `windowSize` from this function. We can just grab that here `export function ExampleComponent1() { const widowSize = useWindowSize();` when we invoke it.

number-4.tsx

```tsx
"use client";

import React { useState, useEffect } from "react";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(1920);

    useEffect(() => {
      const handleWindowsSizeChange = () => {
        setWindowSize(window.innerWidth);
      };
      windows.addEventListener("resize", handleWindowSizeChange);

      return () => {
        window.removeEventListener("resize", handleWindowSizeChange);
      };
    }, []);

    return windowsSize;
}

export function ExampleComponent1() {
    const widowSize = useWindowSize();
	return <div>Component 1</div>;
}

export function ExampleComponent2() {
    const widowSize = useWindowSize();
	return <div>Component 2</div>;
}
```

Now we get access to the windowSize in these components, but the code has been refactored into one function that we can reuse, so that we don't bloat up our component with repetitive code

### 3/12 - Server & Client components

These days we have server and client components in React.
They are use widely in Next.js.

When using Vite or Create React App, server components are not yet that common (Q3 2023/ Q1 2024), but this is basically the future of React.

We need to know a little bit about how it works in relation to these hooks.

In this example we are using Next.js and specifically we are using the /app/ directory in Next.js, and by default components are server components and that means they're only going to run on the server.

On the server, server components will not keep track of state, if we try using useState in server components, even if we import it here, we get an error.

number-3.tsx

```tsx
import React, { useState, useEffect } from "react";

export default function ServerComponentExample() {
  //useState();
  //useEffect();
  //window.alert();
  //localStorage.getItem("test");

  return <div>ServerCompoenentExample</div>;
}
```

We cannot use this useState in a server component, we need to convert this into a client component by adding "use client"; at the top

---

Some other things that also don't work, useEffect (this is a sort of a life cycle hook) also doesn't work in server components,

for example if we do anything with the window objects, for example alerting `window.alert();` does not work on the server, on the server we don't have access to that window object (we're going to get something like "Error: window is not defined"), because there is no window on the server, this has nothing to do with hooks. That's a browser feature, the browser gives us the window we can interact with, this is not going to be available on the server, it's not going to be defined.

The other hooks in React also don't work here,

also for example localStorage does not exist in the server components (on the server)
`localStorage.getItem("test");`, if we try to do some get item, localStorage does not exist on the server, it only exists in the browser.

Whenever we need access to these client-side features we need to make this component e.g. `ServerComponentExample()` a client component.

There are two ways of doing that, we can add `"use client";` at the top, or not use `"use client"`, but import it into another component, that is already a client component.

number-3.tsx

```tsx
"use client"; // <- we can only use useState when it is a client component

import React, { useState, useEffect } from "react";

export default function ServerComponentExample() {
  useState();
  useEffect();
  window.alert();
  localStorage.getItem("test");

  return <div>ServerCompoenentExample</div>;
}
```

For example if another component has `"use client";` at the top, if you import `ServerComponentExample()` into that other component, `ServerComponentExample()` will automatically also become a client component.

We can imagine a tree of components in React, as soon as we add `"use client";` to some component, all the other components that we imported there, will also become clients components, so this is basically like a boundary in a React tree. From now on everything in `ServerComponentExample()` becomes a client component.

### 2/12 - Stale closure

Let's say we have some kind of counter component, we're keeping track of the count in this useState.

Let's say that every one second we want to increment this count by 1. We can set up a setInterval when this component first mounts, that's a life cycle thing. We can use useEffect, we want to run a function, but only when this component first mounts. In there we want to set up an interval as it called in JavaScript. In there we want to run a function every one second.

The first time this component `CounterExample()` mounts we're gonna set up this interval `setInterval(() => {}, 1000)`, that will make this function `() => {}`run every one second.

number-2.tsx

```tsx
import React, { useState } from "react";

export default function CounterExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log("Interval function running...");
      setCount(count + 1);
    }, 1000);
  }, []);

  return <p>Count is: {count}</p>;
}
```

**We can see that the number has increased to one but it stays there.**

Why doesn't it keep increasing? It should increase every one second.

When we check the console log in the console tab in dev tools in the browser, we can see that the interval function is actually running, interval function keeps going, every second this function is indeed running

```tsx
                   () => {
         console.log('Interval function running...');
         setCount(count + 1);
       }, 1000)
```

This function is actually running every second, but the count for some reason stays at 1 on the page.

How is this possible? This has to do with a closure in JavaScript.

Initially count is zero `const [count, setCount] = useState(0);`, the first time we mount this component CounterExample() count is zero and then we're gonna run the useEffect.

This whole function will run once when the component mounts, then we're gonna run useEffect

```tsx
() => {
  setInterval(() => {
    console.log("Interval function running...");
    setCount(count + 1);
  }, 1000);
};
```

In the useEffect we are setting up this interval function, basically this function will run every one second.

But JavaScript will not recreate the function every one second, it will just create this function once

```tsx
//***
                   () => {
         console.log('Interval function running...');
         setCount(count + 1);
       },
```

and then it will just execute that function every one second,

In JavaScript these variables (if you use a variable like `count`) those are created at function creation time, and at the time of creating this function `count` is zero

This function `***` is only created once and then it's just executed every one second,

we can see here that in `setCount(count + 1);` if we make the addition here `setCount(0 + 1);`
it becomes 1

This function is created one time, and then it's just doing setCount is one every single time

```tsx
//***
                   () => {
         console.log('Interval function running...');
         setCount(0 + 1);
       },
```

That's why we can see that interval function running in a console log, this confirms to us that it is actually running every one second, but setCount is just going to be 1 all the time.

#### This is a very tricky mistake that some Junior React developers make, this is called closure

This `count` variable is getting the value at function creation time and that's going to be 0 simply `setCount(count + 1);` `setCount(0 + 1);`

How do we make sure that this `count` is updated, that every one second it gets access to the new value?

We need to make sure that every one second that function is actually destroyed and then recreated again, that in the new creation of that function, it can simply get the new value

```tsx
                   () => {
         console.log('Interval function running...');
         setCount(value + 1);
       },
```

Well, maybe we can add `count` to this dependency array?

number-2.tsx

```tsx
import React, { useState } from "react";

export default function CounterExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log("Interval function running...");
      setCount(count + 1);
    }, 1000);
  }, [count]);

  return <p>Count is: {count}</p>;
}
```

Now useEffect will run not only when we mount the component, but also whenever this `count` variable changes

Initially it's going to set this to 0+1, which means that `count` will change, `count` will be 1, `count` has changed, so now we're going to recreate this function and `count` will be 1+1 is 2

Then it should work, see what we get...

The counter has a weird hiccup and there we have some more hiccups and now it's getting really strange, now we get a really strange result here, where it's sort of spasming out, counter simply doesn't work.

The reason is that we are not canceling the previous intervals.

Now whenever `count` changes, we're simply adding another interval, now every one second we're just adding another intervals, this is going to go completely wrong, it's completely out of whack now

What we need to do is not only create a new interval, we also need to cancel the previous one interval.

`setInterval` actually returns an identifier we can call it identifier which is `i` and we can use that to cancel this one,

number-2.tsx

```tsx
import React, { useState } from "react";

export default function CounterExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      console.log("Interval function running...");
      setCount(count + 1);
    }, 1000);

    return () => {
      clearInterval(i);
    };
  }, [count]);

  return <p>Count is: {count}</p>;
}
```

useEffect also has a so-called cleanup function, we can return a function here `return () => {}` and this function will run when we unmount the component (that's not the case here), but it also runs before running the next useEffect call .

Basically we can clean up something from the previous useEffect run.

What we can do here is we can cancel that interval from the previous run, we can call `clearInterval(i)` and we pass the identifier like this.

Now we get a normal result which we want, we don't get any strange effects here

This problem solved above looks very tricky we have this inner functions so it's really important that you have mastered the JavaScript fundamentals.

Make sure you've mastered like JavaScript and also CSS.

#### Now there is actually a cleaner solution than this,

we don't need to do all of this. We can actually just create this function once.

number-2.tsx

```tsx
import React, { useState } from "react";

export default function CounterExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log("Interval function running...");
      setCount(count + 1);
    }, 1000);
  }, []);

  return <p>Count is: {count}</p>;
}
```

It will work but we have to do the set function a little bit differently.

We need to depend on the previous value`setCount(prev => prev + 1);`, whatever the previous value is just increment that by 1. This `prev` will always be the most up-to-date value that we can get for setting state.

number-2.tsx

```tsx
import React, { useState } from "react";

export default function CounterExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setInterval(() => {
      console.log("Interval function running...");
      setCount((prev) => prev + 1);
    }, 1000);
  }, []);

  return <p>Count is: {count}</p>;
}
```

Now we can see t is properly updating the count on the page.

### 1/12 - Fetching in useEffect

Let's talk a little bit more about why you shouldn't do that in the real world,

so as an example we have a simple Post component, it's just showing us a button and it's keeping track of an ID and currently ID is set to 1. Then it's also rendering this `<PostBody />` component.

We have another component here `PostBody()` where it's using useState for text and it's going to output that text `return <p>{text}</p>;`. Then we have a useEffect, which is currently empty.

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button className="bg-blue-500 px-4 py-2 text-white rounded mr-2">
        Show me a different post
      </button>

      <PostBody />
    </div>
  );
}

export function PostBody() {
  const [text, setText] = useState("");

  useEffect(() => {}, []);

  return <p>{text}</p>;
}
```

We want to pass ID to the `<PostBody />` and based on that ID the `PostBody()` will fetch some post.

Let's pass the ID to post body

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button className="bg-blue-500 px-4 py-2 text-white rounded mr-2">
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody() {
  const [text, setText] = useState("");

  useEffect(() => {}, []);

  return <p>{text}</p>;
}
```

We get a TypeScript problem (red underline on `id={id}`), it's telling us that this component `PostBody()`right now is not accepting an ID prop, let's actually accept an ID prop, if we have props for a component, we want to type this usually. We can type that in line, e.g. `{ id }: { id: number }`.

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button className="bg-blue-500 px-4 py-2 text-white rounded mr-2">
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: { id: number }) {
  const [text, setText] = useState("");

  useEffect(() => {}, []);

  return <p>{text}</p>;
}
```

Doing that in line looks a bit clumsy. We can extract this into its own separate type `PostBodyProps`

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type PostBodyProps = {
  id: number;
};

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button className="bg-blue-500 px-4 py-2 text-white rounded mr-2">
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {}, []);

  return <p>{text}</p>;
}
```

Based on that ID we want to fetch a post and display it here.

Junior developers do this, it is quite typical, is when you mount a component you want to fetch some data.

We're going to make a fetch call to some dummy API based on the ID.
Initially ID is 1, it's going to be post 1, we get some response, we're going to parse that as JSON, meaning we're going to get JSON as a response, and convert that to a normal JavaScript object.
Then we can just set the text that we actually want to display eventually.

Whenever we click this button, we want to be able to change the ID, and then it's going to fetch a new post (different post).

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type PostBodyProps = {
  id: number;
};

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button className="bg-blue-500 px-4 py-2 text-white rounded mr-2">
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setText(data.body));
  }, []);

  return <p>{text}</p>;
}
```

What happens is this `<PostBody id={id}/>` will be mounted, it's going to run once because this dependency array is empty, so it's going to run once on mounting, it's going to fetch that based on the ID, the ID right now is 1. We get some post text.

Now we want to click on this button and it should change the ID.

We use onClick, we could call it handleClick can define that up here, but this time we'll do it in line.

We want to set the ID but not to some fixed number, it should be a random number, in JavaScript we can use `math.random` to get a random number between 0 and 1, and we want to do that times `*` 100.
This can contain decimals, so we're going to round it up or down, doesn't really matter, we can do
`math.floor` to round it down, so that we don't have any decimals, 4.5 will become 4, 3.2 becomes 3.

The idea here is that we're just changing the ID to some random number.

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type PostBodyProps = {
  id: number;
};

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button
        onCLick={() => setId(Math.random() * 100)}
        className="bg-blue-500 px-4 py-2 text-white rounded mr-2"
      >
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setText(data.body));
  }, []);

  return <p>{text}</p>;
}
```

What should happen is that it should fetch a new post but it doesn't work, because right now the way that we've done this, is useEffect this will only run when the component first mounts because it's an empty dependency array. This `PostBody` component will re-render but this useEffect will not run again because it only run when it's mounted.

We can add ID to the dependency array, so now it will run both when it's mounted, but also every time the ID changes.

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type PostBodyProps = {
  id: number;
};

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button
        onCLick={() => setId(Math.random() * 100)}
        className="bg-blue-500 px-4 py-2 text-white rounded mr-2"
      >
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setText(data.body));
  }, [id]);

  return <p>{text}</p>;
}
```

Now every time we click on the button, we get a new post. That takes a second or so before we actually get the post.

All of this is fine if we are just testing something or we are building some very small app, now in the real world though, if we want to make it more professional, we need to think about the edge cases as well.

#### Real world - click on the button multiple times quickly after another, AbortController

For example what if we click on the button multiple times quickly after another.

Here we can see when we click multiple times in a row, it sort of goes through them, it flashes through them. If we click three times we can see it flashes through them, if we click five times here it flashes through all of them.

Because what happens is, every time we click, the ID gets changed and it's going to fire a fetch call, so if we click five times, we're gonna get five times, it's gonna make this fetch call for all of them, eventually they get some data, and they're gonna try to set the text.

So we are gonna get five setText very quickly one after another and that's not really the UI experience that we would expect here.

If we click multiple times after another we don't want to flash through them, we only want to see the last click basically, the last one.

We basically want to cancel previous fetch calls.

This is the real world, so if you want to become a professional developer, these are the things that you're going to have to think about and solve.

Browsers do give us the option to do this ourselves so what we can have is a so-called `new AbortController()`. We have a new AbortController and we can pass a second argument to fetch, it's going to be an object and we can pass a signal here and that's coming from the controller, `controller.signal`. Basically we're attaching some signal to this fetch and then we can use that to cancel it.

useEffect also has a cleanup function `return () => {};`, this function runs whenever you unmount the component (which will not happen here), but it also runs before you go for another round of the useEffect. It allows to clean up some stuff from the previous run.

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type PostBodyProps = {
  id: number;
};

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button
        onCLick={() => setId(Math.random() * 100)}
        className="bg-blue-500 px-4 py-2 text-white rounded mr-2"
      >
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://dummyjson.com/posts/${id}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setText(data.body));

    return () => {};
  }, [id]);

  return <p>{text}</p>;
}
```

That's what we can use here , we can just write it like this, `controller.abort()` .

number-1.tsx

```tsx
"use client";

import { useEffect, useState } from "react";

type PostBodyProps = {
  id: number;
};

export default function Post() {
  const [id, setId] = useState(1);

  return (
    <div>
      <button
        onCLick={() => setId(Math.random() * 100)}
        className="bg-blue-500 px-4 py-2 text-white rounded mr-2"
      >
        Show me a different post
      </button>
      <PostBody id={id} /> {/* <- red underline on id={id}/*/}
    </div>
  );
}

export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    fetch(`https://dummyjson.com/posts/${id}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => setText(data.body));

    return () => controller.abort();
  }, [id]);

  return <p>{text}</p>;
}
```

Now every time this ID changes (dependency array) and we're going to run this useEffect again, right before we do that, we're first going to run this cleanup function `return () => controller.abort();`,
which allows us to abort the previous fetch call.

Looks very clumsy but now when we click on the button multiple times in a series, we can see when we stop clicking, it will just show us the last fetch (last one post). It doesn't flash through them so if we click twice, it's only going to show one, if we click three times it's only going to show one.

#### that flashing through the fetch calls was a race condition

What we saw here before we implemented the solution to that flashing through the fetch calls when we click multiple times and when we abort them, to display only the result of the last one fetch, what we saw here is basically sort of a race condition, where the different fetches are basically racing against each other to see which one will set the text first or last.

#### another problem, caching on fetch

That's one problem that you're going to have with fetching and useEffect, but there are other problems as well like caching for example.

What if the ID is the same as one that we already fetched before, we're gonna make another fetch call unnecessarily, we could cache that fetch call and we can reuse the previous result.

If we had some kind of caching solution we cannot do that like this here.

```tsx
export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setText(data.body));
  }, [id]);

  return <p>{text}</p>;
}
```

Also it only fetches after the rendering, first we're going to run all of this `const [text, setText] = useState("");`, then it is gonna render this `return <p>{text}</p>;` and then it's gonna fire useEffect which will then change the text here and then it's going to render again

It's quite late basically before it can start fetching.

#### loading state problem

Also what if we want to do some loading state, we would have to create a new variable here, `[loading, set loading]` and then sort of undo that here `.then((res) => res.json()).then((data) => setText(data.body));` then setLoading to false at the end right after fetch function pipeline.

```tsx
export function PostBody({ id }: PostBodyProps) {
  const [text, setText] = useState("");
  const [loading, setLoading];

  useEffect(() => {
    fetch(`https://dummyjson.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setText(data.body));
  }, [id]);

  return <p>{text}</p>;
}
```

#### error with fetching

If we have an error with fetching, we would have an error state and we have to keep track of that

```tsx
export function PostBody({ id }: PostBodyProps) {
	const [text, setText] = useState("");
	const [error,

	useEffect(() => {
	  fetch(`https://dummyjson.com/posts/${id}`)
	     .then((res) => res.json())
	     .then((data) => setText(data.body));
	}, [id]);

	return <p>{text}</p>;
}
```

#### we shouldn't do fetch in useEffect

If we shouldn't do it in useEffect then how should we fetch data?

These days in Next.js we should try fetching data in server component.

And if we want to fetch data on the client and clients components, there are libraries like:

- React-Query
- or SWR by Vercel (Next.js),

that will take care of a lot of those issues like:

- caching,
- race conditions,
- loading states,
- error states
- and many other things that we will run into in the real world when we start fetching data
