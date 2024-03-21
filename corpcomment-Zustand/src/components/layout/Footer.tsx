import React from "react";

// </a> - anchor tag
{
  /* <a target="_blank" - open ups a new tab */
}

export default function Footer() {
  return (
    <footer className="footer">
      <small>
        <p>
          &copy; Copyright by{" "}
          <a target="_blank" href="https://bytegrad.com">
            Edgemaster
          </a>
          . Intended for learning.
        </p>
        <p>
          <span className="u-bold u-italic">Not allowed</span> to use as your
          own teaching material.
        </p>
      </small>
    </footer>
  );
}
