import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

//type ClassValue = string | boolean | null | undefined;
//type ClassValue = string | number | bigint | boolean | ClassArray | ClassDictionary | null | undefined
// we do not need to type ClassValue ourselves, clsx gives us a ClassValue type

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// V220
// We are using Tailwind-Merge to merge these CSS classes together, and before we were using clsx, so we can have nice syntax for conditional CSS classes.
//`Cn()` is a popular utility, popularised by shadcn UI, will allow to combine in one utility function (`twMerge` and `clsx` combined into one).
//`Cn` stands for `class names`. We will write that `cn()` function in `/lib/utils.ts`, so we do not have to work with `twMerge` and `clsx` independently, separately,
// it will be one utility function that we can use in both instances -> h1.tsx and header.tsx
// here we are using clsx for conditional classes, what if we want to use className passed as a prop to Header component?
// This clsx will not take care of it, we would also need to use Tailwind-Merge here, instead of that we are going to combine that in one utility function `cn()`
// `cn()` in `utils.ts`
// `cn` needs to group classes into an array, first `clsx` receives classes, with rest operator `...` we create an array, whatever we pass in,
// it just puts all of that in array called `classes` or `inputs`, we pass the array to `clsx`, the result of this, we are going to put that through Tailwind-Merge `twMerge(clsx(classes));`,
// and the result of that is what we return
// (`clsx` will be able to help with conditional classes, we will be able to use this syntax as in header.tsx, but we also want to be able to merge classes in case we have `className`
// as a prop coming in, it needs to be intelligent merging)
// We type `...inputs` as an array of `ClassValue` type -> `ClassValue[]`, instead of using general strings. We do not need to type ClassValue ourselves, clsx gives us a ClassValue type.
// Now we use `cn()` in h1.tsx nad header.tsx instead of `twMerge` and `clsx` separately.
