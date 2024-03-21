import CountButton from "./CountButton";

// export default function CountButtons({ setCount }) {
//   return (
//     <div className="button-container">
//       <button
//         onClick={() => {
//           setCount((prev) => prev - 1);
//         }}
//         className="count-btn"
//       >
//         <MinusIcon className="count-btn-icon" />
//       </button>
//       <button
//         onClick={() => {
//           //setCount(count + 1);
//           // instead of passing value like this setCount(count + 1); another way is to pass a function here
//           //it has to be a function () => {setCount((prev) => prev + 1);} like this because a function awaits for the (event occurring) action of user, we do not want function to run immediately
//           setCount((prev) => prev + 1);
//           console.log("clicked");
//         }}
//         className="count-btn"
//       >
//         <PlusIcon className="count-btn-icon" />
//       </button>
//     </div>
//   );
// }

// Refactor: it would be better if these buttons were it's own components, rename filename CountButtons.jsx to ButtonContainer.jsx, also make CountButton.jsx

// to address the drilling problem we removed props from below
//export default function ButtonContainer({ setCount, locked }) {
export default function ButtonContainer({ children }) {
  return (
    <div className="button-container">
      {/* prop drilling, with locked={locked}, this is typically undesirable because it clutters up our components */}
      {/* <CountButton type="minus" setCount={setCount} locked={locked} /> */}
      {/*just above we are doing prop drilling, we are passing setCount to count button*/}
      {/* <CountButton type="plus" setCount={setCount} /> */}
      {/* to address the prop drilling problem we comment these just up and we move these buttons to the Card.jsx component and put this react prop below also destructuring props in function ButtonContainer({ children }) */}
      {/* children is a standard name for whatever you put in the opening and closing tags, Children Composition Pattern */}
      {children}
    </div>
  );
}
/// we can use props not only to pass values
/// we are using props to configure the instantiation of the button
