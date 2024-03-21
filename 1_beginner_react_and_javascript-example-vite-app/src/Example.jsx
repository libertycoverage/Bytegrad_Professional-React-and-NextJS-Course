//export default function Example() {
//  return <div>Example</div>;
//}
// instead of writing above by hand we can:

// using addon ES7 + React snippets by dsznajder, we write rfc, and it invokes rfc snippet

//rfc
//import React from "react";
import { useState } from "react";

export default function Example(count) {
  //const [Number, setNumber] = React.useState(4);
  const [Number, setNumber] = useState(4);

  return (
    <div
      onClick={() => {
        setNumber(5);
      }}
    >
      Example
    </div>
  );
}
