import React from "react";

export default function Counter({ numberOfItemsPacked, totalNumberOfItems }) {
  return (
    <div>
      <p>
        <b>{numberOfItemsPacked}</b> / {totalNumberOfItems} items packed
      </p>
    </div>
  );
}
