import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React from "react";

export default function AccountPage() {
  return (
    <main>
      {/* <div className="my-8"> */}
      <H1 className="my-8 text-white">Account page</H1>
      {/* <h1 className="my-8"></h1> */}
      {/* </div> */}

      <ContentBlock className="h-[500px] flex justify-center items-center">
        <p>Logged in as ...</p>
      </ContentBlock>
    </main>
  );
}
