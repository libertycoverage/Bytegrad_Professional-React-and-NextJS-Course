import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main>
      {/* <div className="my-8"> */}
      <H1 className="my-8 text-white">Account page</H1>
      {/* <h1 className="my-8"></h1> */}
      {/* </div> */}

      <ContentBlock className="h-[500px] flex justify-center items-center">
        <p>Logged in as {session.user.email}</p>
      </ContentBlock>
    </main>
  );
}
