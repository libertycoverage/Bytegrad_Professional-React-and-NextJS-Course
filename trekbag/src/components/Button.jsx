import React from "react";

export default function Button({ text }) {
  return <button className="btn">{text}</button>;
}

export function ButtonWithTextProp({ buttonType, text }) {
  return (
    <button
      className={`btn ${buttonType === "secondary" ? "btn--secondary" : ""}`}
    >
      {text}
    </button>
  );
}

// export function ButtonWithChildren({ type, children, handleRemoveAllItems }) {
export function ButtonWithChildren({ onClick, buttonType, children }) {
  return (
    <button
      // onClick={() => {
      //   handleRemoveAllItems();
      // }}
      // the same as above but shorter
      // onClick={handleRemoveAllItems}

      //we need to refactor "type" as prop name as because a button can have native <button type='submit' or type='reset'
      onClick={onClick}
      className={`btn ${buttonType === "secondary" ? "btn--secondary" : ""}`}
    >
      {children}
    </button>
  );
}
