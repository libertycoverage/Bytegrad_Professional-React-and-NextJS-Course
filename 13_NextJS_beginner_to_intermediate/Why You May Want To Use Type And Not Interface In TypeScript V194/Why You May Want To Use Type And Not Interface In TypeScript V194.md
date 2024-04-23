## V194 Why You May Want To Use Type And Not Interface In TypeScript

Description: Learn why you may want to use Type and not Interface in TypeScript.

Also here: https://www.youtube.com/watch?v=Idf0zh9f3qQ

There is a conclusion that you always favor Type over Interface in TypeScript, here is why.

### Type alias vs interface

What are the differences between Type alias and interface, well let's say we have some kind of user component and we take some props. We want to describe it with UserProps. We're describing an object {} here.

We could do the same thing with interface.

This looks very similar, instead of type you have interface and type has equal sign.

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

interface UserProps {
  name: string;
  age: number;
}

export default function User({}: UserProps) {
  return <div>Card</div>;
}
```

now sometimes people add for interface they add the I in front of the name, to indicate it's an interface ->

```tsx
interface IUserProps {}
```

and for types (type aliases) people sometimes add a T in front to indicate this is type alias ->

```tsx
type TUserProps = {};
```

Now these days 2023/2024 this naming convention is a little bit less common.

Now very often you have some kind of base type or base interface and you want to extend upon that.
Let's say again we have type UserProps it can be an object with name, age.

We also also want to have another type maybe an AdminProps, we're going to have an admin component perhaps, and this is going to be very similar to a user because an admin also has a name and age, but now an admin maybe should also get a role.

We still want to get the properties from this UserProps as well.

Over the type you do what's called an intersection, you do the the other type UserProps and then you have this ampersand (&), and then you have the additional stuff that you want to add.

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}
```

For interface it's called extending so we could have interface UserProps, name and age and then if we want to extend this we use the "extends" keyword. Now it's the same result.

In general though they're very similar, so on the official documentation website they also mentioned: "Type aliases and interfaces are very similar, and in many cases you can choose between them freely."

https://duckduckgo.com/?q=Type+aliases+and+interfaces+are+very+similar%2C+and+in+many+cases+you+can+choose+between+them+freely.&ia=web

citation:
"Differences Between Type Aliases and Interfaces"
Type aliases and interfaces are very similar, and in many cases you can choose between them freely.
https://www.typescriptlang.org/docs/handbook/2/everyday-types.html

### however we can take the position that you should pretty much always use type, type alias, because interface comes with some problems

### Interface problem 1

for example the interface can only describe an object while the type alias can also describe object AND everything else such as primitive values, string number and boolean etc.

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive vaules such as string, number, boolean etc.)

type address = string;

// interface Address = string; // this is wrong syntax

// this will also not work
interface Address {
  address: string;
}

const address: Address = "123 Main St";
```

Now we have typed this address variable specifically to be of this type Address and this is only possible with a type alias.

If we would try doing this with an interface. You cannot do this equal sign, with the interface you don't have an equal sign, you have curly braces, because you're always describing an object with interface.

right so here if we would do address: string; this doesn't work this is an object with a property address, we get red underline error from intellisense, this is expecting an object now. We could turn this `const address: Address = "123 Main St";` into an object, as key you would need (address:)

```tsx
// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

const address: Address = {
  address: "123 Main St",
}; // right so now we have an object
```

It is the first problem with interfaces, you can only describe objects. And with type alias you can describe objects as well but then also everything else.

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax

// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface
```

### Interface problem 2

for example a type alias can also describe union types and interface cannot

Maybe we want to allow the array of string `type Address = string | string[];` User could have multiple addresses, maybe they moved recently, and we want to keep the history of the addresses?
`type Address = string | string[];` this is union type, e.g. we have string or array of strings.
You cannot do that with interface, this is only possible with type alias. This is going to be some problem because you are going to use type alias quite often in the app.

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type Address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax

// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface

// --------------------------------------------

// type alias can also describe union types and interface cannot

type Address = string | string[]; // this is called union type, e.g. we have string or array of strings
const address: Address = ["123 Main St", "456 Main St"];
```

### Interface problem 3

Type alias can also easily use utility types and interface can too but it's kind of an ugly syntax.

For example let's say we have UserProps and that could have a name, an age and createdAt (some date). We have another component that is a Guest component, it's not a registered user but just somebody browsing, hasn't registered yet, and we want to use the same from UserProps but without name and age because the user hasn't registered yet (we don't know about name and age), but we do know about createdAt, maybe it's just when they first landed on the page.

We basically want to have the same as UserProps but we want to omit something (we want to remove something), TypeScript gives us some utility types, this one's called Omit. We can say Omit from UserProps, (we want to remove something essentially).

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type Address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax

// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface

// --------------------------------------------

// type alias can also describe union types and interface cannot

type Address = string | string[]; // this is called union type, e.g. we have string or array of strings
const address: Address = ["123 Main St", "456 Main St"];

// --------------------------------------------

// type alias can easily use utility types - interface can too but only with ugly syntax

type UserProps = {
  name: string;
  age: number;
  createdAt: Date;
};
//type GuestProps = Omit<UserProps, "name" | "age">; // name and age will be removed
// the same with interface
interface GuestProps extends Omit<UserProps, "name" | "age"> {}
```

We are getting an object. GuestProps is going to describe an object with age: number; and createdAt

Name has been removed from `Omit<UserProps` and we can also remove multiple things like this `
"name" | "age"` , so now name and age will be removed and this will only have createdAt

Technically it's possible to do the same with interface, technically it works but this is ugly syntax, we have the extends keyword and then we have these empty curly braces at the end

This is another reason for preferring type because you can just immediately sort of assign it to GuestProps, without any keywords, without weird curly braces

### Interface problem 4

Sometimes you're gonna have to describe tuples, this is basically an array and specifically for example a string and a number in an array

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type Address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax

// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface

// --------------------------------------------

// type alias can also describe union types and interface cannot

type Address = string | string[]; // this is called union type, e.g. we have string or array of strings
const address: Address = ["123 Main St", "456 Main St"];

// --------------------------------------------

// type alias can easily use utility types - interface can too but only with ugly syntax

type UserProps = {
  name: string;
  age: number;
  createdAt: Date;
};
//type GuestProps = Omit<UserProps, "name" | "age">; // name and age will be removed
// the same with interface
interface GuestProps extends Omit<UserProps, "name" | "age"> {}

// --------------------------------------------

// type alias can easily describe tuples - interface too but only with ugly syntax

// type UserProps = [string, number, Date];
//type Address = [1, "123 Main St."] // it is not correct, that is only for comprehension
type Address = [number, string];
const address: Address = [1, "123 Main St."];
const address: Address = [2, "55 Other St."];

// the same with interface
interface Address extends Array<number | string> {
  0: number;
  1: string;
}
```

let's say we have some kind of address, we could have multiple addresses, maybe we could say something like the first address that the user registered with, we could say something like 1 and that could be "123 Main St." We could have an array, a tuple as it's called.

To describe this as a type we could say it could be a number and then a string `[number, string];`, this is a tuple and then we can say we're going to have an address of type Address, that's going to be the first address was this `[1, "123 Main St."];` and then we could have another one, the second address is other street.

These tuples are easily described with the type alias and it's the same story as before, the interface can technically do the same thing but it's going to be quite ugly syntax with indexes.

That technically works the same way but with the type is much cleaner syntax.

That's another reason to use type.

### Consideration

We have seen four good reasons to use type,

1. we can describe primitive values such as string number and boolean, you cannot do that with an interface
2. we can also use type to describe grab union types, not possible with interface
3. we can easily use utility types that we get from TypeScript and it's clean syntax; interface can do the same but it's going to be ugly syntax
4. we also have tuples, very easily done with the type alias and awkwardly possible with interface

These are quite common things especially Omit for example, with these utility types as well as union types, these are quite common, it's pretty much guaranteed that you're going to use a type alias in your code.

Since you're already going to use a type alias, why not just use a type alias everywhere for consistency

### Interface problem 5

There is another really good reason to prefer type alias over interface.

It's when you want to extract type from something else

For example we have some kind of project object this project could have a `title: "Project 1";` and then it could have a nested object, some kind of specification, area size and a number of rooms

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps = {
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
};

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type Address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax

// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface

// --------------------------------------------

// type alias can also describe union types and interface cannot

type Address = string | string[]; // this is called union type, e.g. we have string or array of strings
const address: Address = ["123 Main St", "456 Main St"];

// --------------------------------------------

// type alias can easily use utility types - interface can too but only with ugly syntax

type UserProps = {
  name: string;
  age: number;
  createdAt: Date;
};
//type GuestProps = Omit<UserProps, "name" | "age">; // name and age will be removed
// the same with interface
interface GuestProps extends Omit<UserProps, "name" | "age"> {}

// --------------------------------------------

// type alias can easily describe tuples - interface too but only with ugly syntax

// type UserProps = [string, number, Date];
//type Address = [1, "123 Main St."] // it is not correct, that is only for comprehension
type Address = [number, string];
const address: Address = [1, "123 Main St."];
const address: Address = [2, "55 Other St."];

// the same with interface
interface Address extends Array<number | string> {
  0: number;
  1: string;
}

// --------------------------------------------

// extracting type from something else
const project = {
  titile: "Project 1",
  specification: {
    areaSize: 100,
    rooms: 3,
  },
};

//type Specification = typeof project;

type Specification = (typeof project)["specification"];
```

We have a specification in inside a project and now we want to have a type for specification

we can simply say `type Specification = typeof project;`

If you do `typeof project;` and now hover on Specification (intellisense) you can see in it, it simply infers the shape of this variable project

intellisense output

```tsx
type Specification = {
  title: string;
  specification: {
    areaSize: number;
    rooms: number;
  };
};
```

Now we want to create a type out of this `specification : { areaSize etc. }` object

We can be more specific, pull out this specification object `type Specification = typeof project["specification"];`

Now when we hover on Specification (intellisense) we can see it has pulled out this object of area size and rooms

intellisense output

```tsx
type Specification = {
  areaSize: number;
  rooms: number;
};
```

Technically possible with interface as well, but you have to use extends keyword and the interface just doesn't look as clean as this where you can just immediately sort of assign something to a new type.

This equal sign is something that we are used to as JavaScript developers, because we do a lot of this assignment to variables, syntax using type alias feels a bit cleaner

As a side note, if we hover on Specification `type Specification = typeof project["specification"];`we can see that TypeScript has inferred this to be these

intellisense output

```tsx
type Specification = {
  areaSize: number;
  rooms: number;
};
```

What if we know `areaSize: 100` always is going to be a 100 and this `rooms: 3,` is going to be 3,

Very cool trick that you can do in TypeScript is you can you can add (you can be more precise than that), you can say `as const;` so literally it's going to be this `areaSize: 100, rooms: 3,`

```tsx
const project = {
  titile: "Project 1",
  specification: {
    areaSize: 100,
    rooms: 3,
  },
} as const;
```

now if you hover on Specification `type Specification = typeof project["specification"];` you can see (intellisense) it infers this to be literally the number 100, not just any number (we can be more specific than that), it's always going to be the number 100, always going to be number 3.

intellisense output

```tsx
type Specification = {
  readonly areaSize: 100;
  readonly rooms: 3;
};
```

That is just a side note this "as const" trick is actually really helpful.

Technically that is possible with interfaces but it just looks cleaner with type alias

```tsx
// extracting type from something else
const project = {
  titile: "Project 1",
  specification: {
    areaSize: 100,
    rooms: 3,
  },
};

//type Specification = typeof project;

type Specification = (typeof project)["specification"];
```

### Interface problem 6

Another good reason to prefer type

Interfaces can be merged

What that mean?

You can sort of declare interface again.

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps ={
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
}

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type Address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax


// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface


// --------------------------------------------

// type alias can also describe union types and interface cannot

type Address = string | string[]; // this is called union type, e.g. we have string or array of strings
const address: Address = ["123 Main St", "456 Main St"];


// --------------------------------------------

// type alias can easily use utility types - interface can too but only with ugly syntax

type UserProps = {
  name: string;
  age: number;
  createdAt: Date;
}
//type GuestProps = Omit<UserProps, "name" | "age">; // name and age will be removed
// the same with interface
interface GuestProps extends Omit<UserProps, "name" | "age"> {}

// --------------------------------------------

// type alias can easily describe tuples - interface too but only with ugly syntax

// type UserProps = [string, number, Date];
//type Address = [1, "123 Main St."] // it is not correct, that is only for comprehension
type Address = [number, string];
const address: Address = [1, "123 Main St."];
const address: Address = [2, "55 Other St."];

// the same with interface
interface Address extends Array<number | string> {
  0: number;
  1: string;
}

// --------------------------------------------

// extracting type from something else
const project = {
  titile: "Project 1",
  specification: {
    areaSize: 100,
    rooms: 3,
  },
}

//type Specification = typeof project;

type Specification = typeof project["specification"];

// --------------------------------------------

// interfaces can be merged
// "interfaces are open" and "type aliases are closed"

interface User {
  name: string;
  age: number;
}

interface User {
  role: string;
}

let user: User = {

}

// again for types

//interface User {
type User {  // -> error "duplicate identifier User"
  name: string;
  age: number;
}

//interface User {
type User { // -> error "duplicate identifier User"
  role: string;
}

let user: User = {

}

// ----THIS WILL WORK ----

type User { // <- THIS WILL WORK TOGETHER
  name: string;
  age: number;
}

type User2 = User & { // <- THIS WILL WORK TOGETHER
  role: string;
}

let user: User = {

}
```

If you use that type `let user: User = {`, intellisense shows us that we can use age, name, and role

What happens here is basically that TypeScript has merged these into one interface

The the good use case for this is when we are getting some interface from a third-party library and it doesn't contain something that we want, so we can add that by redeclaring it (interface)

It's very confusing because you can have multiple declarations of this (interface) with the same identifier throughout the code base. That's really confusing, but the bigger problem is now when we use User here `let user: User = {` and we try to use intellisense here we know right now what we can use here, but this can change at any moment (somebody else could change this, especially if we are working in a team, big project), somebody else could change the interface, so it could be that we do not really know what User interface is going to be, it's unpredictable and when something is unpredictable in your code, bad things can happen generally speaking.

If we try doing that with a type alias, if we have already created a type user and we try doing that again with type

```tsx
// interfaces can be merged
// "interfaces are open" and "type aliases are closed"

//interface User {
type User {  // -> error "duplicate identifier User"
  name: string;
  age: number;
}

//interface User {
type User { // -> error "duplicate identifier User"
  role: string;
}

let user: User = {

}


// THIS WILL WORK
type User { // <- THIS WILL WORK TOGETHER
  name: string;
  age: number;
}

type User2 = User & { // <- THIS WILL WORK TOGETHER
  role: string;
}

let user: User = {

}
```

TypeScript compiler is giving us an error with red underline on User "duplicate identifier User"

This is also called "interfaces are open", because we can sort of redeclare them and they will be merged.

"Type aliases are closed", we cannot just redeclare them and add something like that.

Now if we want to add something we can still do that, but we have to give it a different identifier here (different type name e.g. `type User2 = User & {`). (& - intersection)

That would work the same way but it's more predictable now because now this this won't suddenly change, we do have to change the name here (User2), but it's much more predictable. It reduces the opportunity for bugs and unintended stuff happening in our code base.

### Classes

Some people think that we have to use an interface for classes, we don't write many classes these days especially if you're a React developer, but sometimes you come across it.

With classes, for TypeScript you can make sure it adheres to some interface, we can use "implements" and

user.tsx

```tsx
// example of type alias vs interface

//type UserProps = {
//  name: string;
//  age: number;
//}

//interface UserProps {
//  name: string;
//  age: number;
//}

//export default function User({}: UserProps){
//  return <div>Card</div>;
//}

// combining a base with additional properties

// "intersection"

type UserProps ={
  name: string;
  age: number;
};

type AdminProps = UserProps & {
  role: string;
}

// "extending"

interface UserProps {
  name: string;
  age: number;
}

interface AdminProps extends UserProps {
  role: string;
}

// --------------------------------------------

// interface can only describe object - type alias describe object AND everything else (e.g. primitive values such as string, number, boolean etc.)

type Address = string;
const address: Address = "123 Main St";
// interface Address = string; // this is wrong syntax


// this will also not work with this (const address: Address = "123 Main St";)
interface Address {
  address: string;
}
//const address: Address = "123 Main St";

// interface implementation, address is an object
interface Address {
  address: string;
}

const address: Address = {
  address: "123 Main St",
}; // works with interface


// --------------------------------------------

// type alias can also describe union types and interface cannot

type Address = string | string[]; // this is called union type, e.g. we have string or array of strings
const address: Address = ["123 Main St", "456 Main St"];


// --------------------------------------------

// type alias can easily use utility types - interface can too but only with ugly syntax

type UserProps = {
  name: string;
  age: number;
  createdAt: Date;
}
//type GuestProps = Omit<UserProps, "name" | "age">; // name and age will be removed
// the same with interface
interface GuestProps extends Omit<UserProps, "name" | "age"> {}

// --------------------------------------------

// type alias can easily describe tuples - interface too but only with ugly syntax

// type UserProps = [string, number, Date];
//type Address = [1, "123 Main St."] // it is not correct, that is only for comprehension
type Address = [number, string];
const address: Address = [1, "123 Main St."];
const address: Address = [2, "55 Other St."];

// the same with interface
interface Address extends Array<number | string> {
  0: number;
  1: string;
}

// --------------------------------------------

// extracting type from something else
const project = {
  titile: "Project 1",
  specification: {
    areaSize: 100,
    rooms: 3,
  },
}

//type Specification = typeof project;

type Specification = typeof project["specification"];

// --------------------------------------------

// interfaces can be merged
// "interfaces are open" and "type aliases are closed"

interface User {
  name: string;
  age: number;
}

interface User {
  role: string;
}

let user: User = {

}

// again for types

//interface User {
type User {  // -> error "duplicate identifier User"
  name: string;
  age: number;
}

//interface User {
type User { // -> error "duplicate identifier User"
  role: string;
}

let user: User = {

}

// ----THIS WILL WORK ----

type User { // <- THIS WILL WORK TOGETHER
  name: string;
  age: number;
}

type User2 = User & { // <- THIS WILL WORK TOGETHER
  role: string;
}

let user: User = {

}

// --------------------------------------------

// type alias can be used for classes too

interface IUser {
  name: string;
  age: number;
}

class User implements IUser {
  name: string;
  age: number;

  constructor(name: string, age: number){
    this.name = name;
    this.age = age;
  }
}

// --- now with type---

interface TUser {
  name: string;
  age: number;
}

class User implements TUser {
  name: string;
  age: number;

  constructor(name: string, age: number){
    this.name = name;
    this.age = age;
  }
}

```

We're forcing the class User to implement this shape IUser and that's not necessary, this also works with type, this works perfectly fine. Type alias works with class and implements as well.

### Best arguments!

Of course word "type" is simply fewer characters as well, "type" is 4 characters and interface is 9 characters.

We saved the best argument for the last, language it's called TypeScript not InterfaceScript

### Arguments pro interface

There are no good reasons to use interface at all.

There are some very specific use cases, so on the official website they do mention that with interface you get some shorter and more focused error messages when you work with interfaces than when you work with type aliases.

"If you hover over the following errors, you can see how TypeScript can provide terser and more focused messages when working with interfaces"

That's one reason for using interface, or you really need that merging feature of interfaces. Maybe you're developing a library and there are some specific use case where this makes sense.

In the **past performance was also a reason to use interface**, which if you had a huge code base interface was maybe a little bit faster than type, the type alias, but these days that doesn't seem to be any difference in performance.
