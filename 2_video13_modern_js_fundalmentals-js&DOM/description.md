in vs code there is an extension called emmet, we write html, and then we choose html5 snippet template (boilerplate)

// why style.css, it's an abbreviation from stylesheet, common names are styles or main.css

we want separation between css js and html, ideally we put everything in separate files

In javascript files when we link to other things we use

<script src="script.js"></script>

    <!-- more common version in javascript files ./script.js -->

// script.js other common names are app.js or specific names

Using <script> tags in html.

What is the problem with this
This is not how people do it and done it in the past, as soon as the browser receives the html file it's gonna go line by line
It (engine of the browser) fetches the resources (icons scripts etc.), it make a http request to the resource

  <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap"
    />
the same goes for stylesheet style.css etc.

The stylesheets are being fetched in parallel, but the rest of the page will not be blocked, the rest of the page it's building
When we get to javascript file it is not the case

As soon as the browser receives the script it will actually stop building the page, this is you could say "blocking" the building the rest of our page,

one of the reasons is actually that the javascript can manipulate the html, at first the browser will not know what the script is going to do

To be safe will actually start fetching the script, it will wait until the script gets back, it will execute the script and only then it's going to build the rest of the page

to resolve this people were putting script ( <script src="script.js"></script>) at the end of the page, at the end of the body element

The downside of this is it takes long time basically before the browser can make that network request to fetch the script, because it is only at the end
It is not the optimal solution either because it takes long time before the browser can make request and ideally it starts fetching all of the external resources as quickly as possible

In modern websites we want speed, snappiness

We have the solution to this, we put <script src="script.js"></script> in <head> we add an attribute called "defer"

<script src="script.js" defer></script>

Defer will make sure that it does not block the rest of the page but it can still fetch the script file
It will make the network request to get the script file while not blocking the page

This is the optimal solution how we can include javascript files in websites and web apps

---

In JS

// -- variables (var/let/const) & data types/structure (strings/numbers/booleans/arrays/objects) --
// -- traditional functions vs arrow functions --
// -- string concatenation vs template literals --
// -- if-else vs ternary operator --
// -- manipulating html and CSS --
// -- events and functions for handling events (also called "event handlers") --
