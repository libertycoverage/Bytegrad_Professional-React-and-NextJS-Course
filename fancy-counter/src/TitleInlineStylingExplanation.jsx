export default function TitleInlineStylingExplanation() {
  return (
    <h1
      style={{
        fontSize: "50px",
        //in css it would be font-size, but in the object you have to use camel case fontSize
      }}
    >
      Fancy Counter
    </h1>
  );
  // the easiest way is to use inline styles
  // in normal html would be normal style attribute as just below, but here (jsx) style attribute is an object {{}}
  // return <h1 style="235">Fancy Counter</h1>;
  // in style = {} you can have number style = {5}, boolean true style = {true}, you can even have an array style = {[]}
}

/// instead of doing inline styling we want to have a css in a separate file
