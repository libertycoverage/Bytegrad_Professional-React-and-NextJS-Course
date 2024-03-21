import React from "react";

export default function Warning({ warningText }) {
  //const { warningText } = props;
  // destructuring props to not to use return <p className="warning">{props.warningText}</p>;
  return <p className="warning">{warningText}</p>;
}
