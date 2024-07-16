"use client";

import { getEvents } from "@/lib/server-utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SearchForm() {
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
 // const events = getEvents("austin", 2); // V255 this line is for a behaviour check while using server-only package

  // V208
  // 1) We have a `form` in page.tsx, when we type something in `<input />` and press enter there would be a submit event we can hook into
  // When we have event `e` we need to type the event. If we do not know the type or use Github Copilot we can write `<form onSubmit={e => handleSubmit}` - when we hover on `e` we get type of event.
  // 2) When we have event `e` we need to type the event
  // If we do not know the type or use Github Copilot we can write `<form onSubmit={e => handleSubmit}` - when we hover on `e` we get type of event
  // What we want to do is to `preventDefault`, remember if we submit the form, by default the browser will try to submit it to whatever we pass in the action attribute, this is a bit oldschool,
  // we would have something like search.php (the browser will try to submit there). These days we do not wanna do it like that, we want to do it ourselves with JavaScript.
  // (oldschool solution `<form action="/search.php" onSubmit={handleSubmit} className="w-full sm:w-[580px]">`), (desired solution `<form onSubmit={handleSubmit} className="w-full sm:w-[580px]">`)
  // 3) We run into issue because everything by default is a server component, that has certain benefits, if we can we want to keep it that way,
  // but sometimes we need to have interactivity, when we have an event we are hooking into, click event `onClick` or `onChange`, `onSumbit`,
  // when we need interactivity we need to convert it to a client component, typically we want to be careful with that
  // "# Unhandled Runtime Error, Error: Event handlers cannot be passed to Client Component props. <form onSubmit={function} className=... children=...> ^^^^^^^^^^ If you need interactivity, consider converting part of this to a Client Component."
  //
  // A beginner in Next.js would convert entire component to client component (That is not what we want to do), so the entire page would become a client component,
  // even though we only need it because of this `<form>`, other components added to page.tsx would be also affected by that, event though we do not need to do it for them to make this a client component,
  // we only need for the `<form>`. Let's say we have a component we import to the page that is a client component, now everything we import to such page becomes a client component
  // e.g. `import HeavyComponent from "@/components/heavy-component";`, and also everything these components also import, that also becomes a client component.
  // That is not what we want to do, we do not want to add `"use client";` on top of the page component making it a client component, a lot of other thing are gonna be affected by that
  // We may consider extracting the part that needs to be a client component into own component and make that component a client component e.g. ```<form onSubmit={handleSubmit} (...) </form>
  // 4) We move form from page.tsx to search-form.tsx, search-form needs to be a client component, we need to be explicit `"use client"`.
  // There is no way around this in many cases, we do want interactivity, we want `onChange`, `onClick`, `onSubmit` and other things. By using a client component we lose certain benefits.
  // By doing this way only `<SearchForm>` is client component an nothing in page.tsx is affected by that. `Home()` is still a server component
  // 5) When we press enter there is a submit event, and we grab whatever the user typed in the input field. The easiest way is to make it controlled input,
  // till now the input was controlled internally outside React, now we are gonna manage the value we input with controlled input, we will use useState
  // 6) Now the value is always the empty string, we need to update value with `setSearchText` When we use hook like useState or useEffect or useRef we have to use that in components that are client component.
  // Basically we have to add `"use client";`  to a file when we use a hook or hook into events e.g. using `onChange`, `onClick`, `onSubmit` .
  // These are the most common cases for turning into a client component.
  // 7) When we put the name of the city in the search bar we want to redirect, re-route `/events/austin`, Next.js gives us access to the router,
  // we want to do that programmatically, use `useRouter` hook form Next.js, (`<Link>` is actually when you click on the component)
  // We need to make sure we import `useRouter` from `next/navigation`, not from `"next/router`" , this one also existed in Pages Router (nowadays we have App Router),
  // it will give us an instance of the router, we do it programmatically with code instead of the component. We can push to events whatever the user types on the keyboard
  // `router.push(`/events/${searchText}`);`
  // We can have a validation, but if it is for example empty input and uses presses enter, we do not wanna do anything,
  // if the text is falsy (empty input this one returns `if (!searchText) return;` only when user tries to type something we will try to re-route with that `router.push(`/events/${searchText}`);`
  // https://stackoverflow.com/questions/76285831/whats-the-difference-between-next-router-and-next-navigation, https://github.com/vercel/next.js/discussions/48426

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // When we put the name of the city in the search bar we want to redirect, re-route `/events/austin`, Next.js gives us access to the router
    if (!searchText) return;

    router.push(`/events/${searchText}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full sm:w-[580px]">
      <input
        className="w-full h-16 rounded-lg bg-white/[7%] px-6 outline-none ring-accent/50 transition focus:ring-2 focus:bg-white/10"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)} // it will grab the value, set in setSearchText and rerender
        placeholder="Search events in any city..."
        spellCheck={false}
      />
    </form>
  );
}

// V203 copied for organizational purposes
// 14) We will add some width on the form itself, on the small viewport we want this to take the entire width `w-full`,
//  but on a larger viewports we will make custom width of `sm:w-[580px]` (custom 580px). Tailwind CSS uses rem units,
// you may wanna do this in rem (it is a little bit better to use rem), rem is more complicated to work with,
// to calculate what pixels are in rem,  we will use pixels here. There is no convenient tool to calculate rem units and pixels yet in Q4 2023, but is should be soon
// 15) `<input>` inside the form should be the same width as the `<form>` is, we add className of `w-full`;
// 16) we also give a height of 16 `h-16`;
// 17) we want to add some border radius `rounded-lg`;
// 18) we want background to be more subtle `bg-white/[7%]` (custom 7%), custom values are in square brackets;
// 19) we want to add some padding horizontal `px-6`;
// 20) we also want to remove outline `outline-none` (there is no frame around that input field when we put cursor there, trying to type in the field);
// 21) we want the frame around to be green (static outline around, without a cursor), it is `ring`, we want ring of custom color `ring-[#a4f839]`,
// we want 50% opacity `ring-[#a4f839]/50`; we want to be smooth, we add `transition`. We do not see anything because ring has no size,
// we want to give ring a size when we click in here (this is gonna be the focused state) `focus:ring-2`;
// also we want to change background colour a little bit `focus:bg-white/10` (technically we could  do custom 7% `focus:bg-white/[7%]`)
