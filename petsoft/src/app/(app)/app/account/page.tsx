import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import React from "react";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import SignOutBtn from "@/components/sign-out-btn";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  async function logOut() {
    "use server";

    await signOut();
  }

  return (
    <main>
      {/* <div className="my-8"> */}
      <H1 className="my-8 text-white">Account page</H1>
      {/* <h1 className="my-8"></h1> */}
      {/* </div> */}

      <ContentBlock className="h-[500px] flex flex-col gap-3 justify-center items-center">
        <p>Logged in as {session.user.email}</p>

        <SignOutBtn />
      </ContentBlock>
    </main>
  );
}
