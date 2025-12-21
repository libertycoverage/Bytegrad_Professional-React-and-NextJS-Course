//V353
"use client";

import React, { useTransition } from "react";
import { Button } from "./ui/button";
import { logOut } from "@/actions/actions";

export default function SignOutBtn() {
  const [isPending, startTransition] = useTransition(); //V377

  return (
    <Button
      disabled={isPending} //V377
      onClick={async () => {
        startTransition(async () => {
          await logOut();
        }); //V377
      }} //V377
    >
      Sign Out
    </Button>
  ); //V377
}
//V353
