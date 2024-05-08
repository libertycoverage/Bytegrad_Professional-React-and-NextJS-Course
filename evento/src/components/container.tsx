import React from "react";

export default function Container({ children }) {
  return (
    <div className="flex flex-col max-w-7xl min-h-screen mx-auto bg-white/[2%]">
      {children}
    </div>
  );
}

// V203
// 31) Now website is sticking to the left (with constraint in width), it should be centered,
// we have 7xl width `max-w-7xl` in `<Container>` React component.
// When you have constraint width with something and you want to center it you can do that with margin auto (margin horizontal)
// (e.g. `x` axis - horizontal) `mx-auto`, which will center everything
// 32) We want to set background color of the constrained area to lighter in reference to the color on the side `bg-white/[2%]`
// 33) There is not enough content to reach the end of the viewport, we need to reach the and before we put the Footer there,
// we want the minimum height of constrained area to be at least of height of the viewport `min-h-screen`
// (viewport is called screen in Tailwind CSS). When we hover over `min-h-screen` we can see it is 100 percent of the viewport height (`min-height: 100vh`)
// 34) Now we can put the Footer at the and, (it is still somewhere in the middle of the height), it is a layout problem,
// since the last change, now the Container component is a parent element of the Footer, we can create Container component a `flex` container,
// we need to add `flex-col` so `main` and `Footer` are in the same column, (not close to each other horizontally).
// It looks like nothing changed, now we can go to the Footer, and what we can do in `flex` child element
// (Footer is a child element of `Container` React component),
// we can add to Footer  margin top auto `mt-auto`, it will put as much space between itself and another `flex` items,
// now we have a sticky footer at the bottom, that is what we want.
// --
// next part in footer.tsx
