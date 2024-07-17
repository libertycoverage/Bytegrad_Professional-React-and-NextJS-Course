## V249 Middleware in EVENTO (Use Cases, Redirecting)
Description: Use middleware in Next.js to redirect users to the events page if they try to access the /events page directly.


One other thing we can also do is middleware. If we go to `http://localhost:3000/events/all`, but it is possible the user wants to go to `http://localhost:3000/events/`, but now the user sees "We could not find that page", nothing matches that route. Maybe what we want is to redirect users to `http://localhost:3000/events/all` when they go to `/events/` route. We can do that with middleware. Middleware is something we can run when user makes a request, that goes to the server, but before it touches anything on the server, we can run something before that, in the middleware.

The most common use case for that is authentication, we can check if the user is logged-in for example. 

However here we can use it simply to redirect, redirection is another common use case.

We need to create `middleware.ts` file at the root of directory `/src/middleware.ts`

 now when we refresh being at `http://localhost:3000/events/`, there will be request to the server (automatically searching for middleware), and we get an error from the middleware
 
 ```js
 # Server Error

Error: The Middleware "/src/middleware" must export a `middleware` or a `default` function

This error happened while generating the page. Any console logs will be displayed in the terminal window.
```

 If we go to our website, there will be a request to the server, right before the request touches anything, we can hook into that request with middleware.

What we need to do in `middleware.ts` is to export a function here, we can call it `middleware()`, here we get the `request`(as the input of the function), we can do something with `request`. 

What we can do is to immediately return a response actually, we can do that with `NextResponse`, we import that from `import { NextResponse } from "next/server";` , if we do `next`, `NextResponse.next()` it will continue to the rest of the server. Here before we do that (before `next()`), we want to `redirect()`. 

Here we want to redirect to `"/events/all"`. We also need to type the `request`, it is actually based on standard Request and Response type, `export function middleware(request: Request) {`

(interface `Request` - This Fetch API interface represents a resource request. https://developer.mozilla.org/en-US/docs/Web/API/Request, 
interface `Response` - This Fetch API interface represents the response to a request. https://developer.mozilla.org/en-US/docs/Web/API/Response), 

but Next.js has already extended that to add some additional properties `export function middleware(request: NextRequest) {`

```ts
import { NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
  // return NextResponse.next();
  return NextResponse.redirect("/events/all");
}
```

This is what we want to run not for every route, now it needs to know for which route we want to redirect then.

We need to specify which route should match, we have a `config` and in there we have a `matcher`, e.g. we want to run this only fot `['/events']`. 

```ts
export const config = {
  matcher: ['/events']
}
```

If we want we could have other route, maybe when the user goes to `/about` route, this just an example 

```ts
export const config = {
  matcher: ['/events', '/about']
}
```


Now when we do this, ->

`middleware.ts`
```ts
import { NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
  // return NextResponse.next();
  return NextResponse.redirect("/events/all");
}

export const config = {
  matcher: ['/events']
}
```

we receive an error, Next.js wants us to use absolute URL, does not want us to use relative path

```js
Server Error
Error: URL is malformed "/events/all". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls
```

what we can do is to use `new URL`, this below still does not work

`middleware.ts`
```ts
import { NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
    // return NextResponse.next();
    return NextResponse.redirect(new URL ("/events/all"));
}

export const config = {
    matcher: ['/events']
}
```

but then what we need to do is to combine this with the request url `request.url` of the incoming request. We can take it's URL, combine that with `"/events/all"`, then if we do that,

`middleware.ts`
```ts
import { NextRequest, NextResponse} from "next/server";

export function middleware(request: NextRequest) {
    // return NextResponse.next();
    return NextResponse.redirect(new URL ("/events/all", request.url));
}

export const config = {
    matcher: ['/events']
}
```

that indeed works. Now when we go to `http://localhost:3000/events/` we are redirected to `http://localhost:3000/events/all`. 

Most common use case for middleware is authentication, checking is the user is logged in before continuing, but the redirecting is also quite common.
