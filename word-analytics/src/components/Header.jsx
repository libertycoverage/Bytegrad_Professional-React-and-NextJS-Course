import React from "react";
import BackgroundImage from "./BackgroundImage";
import H1 from "./H1";

export default function Header() {
  return (
    // instead of div use sematic taqs e.g. header,
    // it is good for understanding website structure, accessibility and also SEO, clearance for rank bot e.g. Google
    <header>
      <BackgroundImage />

      <H1 />
    </header>
  );
}
