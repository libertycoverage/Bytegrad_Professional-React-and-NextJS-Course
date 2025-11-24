import "server-only"; //V364

import { redirect } from "next/navigation";
import { auth } from "./auth";

//V362
export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
//V362
