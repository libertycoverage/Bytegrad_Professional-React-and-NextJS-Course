import { TriangleDownIcon } from "@radix-ui/react-icons";
import BookmarksPopover from "./BookmarksPopover";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "../lib/hooks";

export default function BookmarksButton() {
  const [isOpen, setIsOpen] = useState(false);

  // ****12
  // Below we used the CSS class of the button and bookmarks-popover to detect there was a click inside of them,
  // this is not the React way of doing it, you could do it and it is the easiest way of doing that,
  // the downside is overtime could could change the name of classNames, code can depend of className that could be broken by that
  // we are going to create Ref that we can attach to button in the DOM
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // custom hook des not have to return something, often that is the case, but not always
  useOnClickOutside([buttonRef, popoverRef], () => setIsOpen(false));

  // ---------- MOVED TO CUSTOM HOOK useOnClickOutside(),
  //this code should (and can) be removed but stays to document implementation

  useEffect(() => {
    // const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    const handleClick = (e: MouseEvent) => {
      // //***11 we need to stick to more general type because handleClick red underline -move to ***11>
      //// sometimes for MouseEvent you need to specify it is in the React namespace
      //// These types are in node_modules/@types/index.d.ts <- here is the information about React.MouseEvent<HTMLElement>
      //setIsOpen(false);
      if (
        // You can prove the TypeScript to get rid of red underline for closest() -> e.target instanceof HTMLElement &&
        e.target instanceof HTMLElement && // if this is false you immediately return from if statement (short circuiting), if this is true you can access e.target.closest
        // !e.target.closest(".bookmarks-btn") && // if we click not inside bookmarks-btn (CSS selector)
        // if we click in the bookmarks-btn we do not wanna run above, bookmarks-btn should only be governed by // ***10

        // !e.target.closest(".bookmarks-popover") // We also want to exclude this code setIsOpen(false); from running when we click on any bookmarked jobItem offer in popup
        // When we click on the offer on the popup, popup will close automatically, why is is that? (we do not wanna this behavior)
        // Because now (only with !e.target.closest(".bookmarks-btn")) every click now in the document will run this -> setIsOpen(false); except when you click the bookmarks button

        // ****12
        // Using Ref this is essentially the same as document.querySelector(".bookmarks-popover") <- this is how you would do that in vanilla.js perhaps
        !buttonRef.current?.contains(e.target) && // the actual element is stored in current (that can be null - optional chaining -> ?), we can check if that contains thing that we clicked
        // -> buttonRef.current is underlying DOM Node and we check if that contains the target of a click
        // we check if what we clicked is inside the button, if it was inside the button we do not want to run this code
        // We want do the same for bookmarks popover
        !popoverRef.current?.contains(e.target) // we check if the click was inside popover or not, if that popover contains the target of a click, we do not wanna run that
      ) {
        setIsOpen(false);
      } // we have information in the browser from the event object,
      // when we click on the icon we also do not wanna run the function for close the popup (we open with the icon on the bookmarks button too), closest() will take icon for consideration also
    }; // we want that click to be inactive on the area of a bookmarks button itself, otherwise it will try to open and close at the same time, and bookmarks button does not work
    document.addEventListener("click", handleClick); // ***11 red underline for handleClick -> Type „Event” is missing the following properties from „MouseEvent<HTMLElement, MouseEvent>”: altKey, button, buttons, clientX and 18 more.
    // ***11 document.addEventListener("click", e => ); <- this is trick to get ot know the type of e in intellisense when you hover on e
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []); // on the click we want to run the function
  // empty dependency array, it will run on the first mount of the component
  // if we have useEffect we wanna do some clean up, if the component gets unmounted, e.g. when we navigate to some different page;
  // we do not wanna have lingering event listeners, we return the clean up function -> in there we remove that event listener
  // -> here we need to reference that function that is used here -> document.removeEventListener('click', )

  // ---------- MOVED TO CUSTOM HOOK useOnClickOutside()

  return (
    <section>
      {/* // ***10 */}
      <button
        ref={buttonRef} // when you attach ref you do not have to work with className
        onClick={() => setIsOpen((prev) => !prev)}
        //onClick={(e) => setIsOpen((prev) => !prev)} // ***11 <- this is also a trick to get ot know the type of e in intellisense when you hover on e
        className="bookmarks-btn"
      >
        {/* toggle implemented with prev => !prev */}
        Bookmarks <TriangleDownIcon />
      </button>

      {isOpen && <BookmarksPopover ref={popoverRef} isOpen={true} />}
      {/* isOpen={true} is never user, only for demonstrations purposes for Ref in BookmarksPopover.tsx */}
      {/* conditional rendering ^^ */}
    </section>
  );
}

// One better feature would be if the user of the bookmarks popup click elsewhere on the page and that will close the popup,
// right now we need to click the same button again
// we want to setIsOpen to false if we click outside of the button -> Bookmarks <TriangleDownIcon /> </button> and outside the popover <BookmarksPopover />
// When we click outside there is a click event, we can attach event handler to element that was clicked, problem is that we do not have such element
// As we remember event bubbles up in HTML in the DOM tree
// We gonna add event listener to the document, that is the highest element essentially
// The document object is an external system or side effect, adding event listener is done by useEffect hook
