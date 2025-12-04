import "server-only"; //V364

import { redirect } from "next/navigation";
import { auth } from "./auth";
import { Pet, User} from "@prisma/client";
import prisma from "./db";

//V362
export async function checkAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
//V362

//V365
export async function getPetById(petId: Pet['id']){
  const pet = await prisma.pet.findUnique({
    where: {
      id: petId,
    },
  });
  return pet;
}
//V365
export async function getPetsByUserId(userId: User['id']){
  const pets = await prisma.pet.findMany({
    where: {
      userId: userId,
    },
  });
  return pets;
} //V365

export async function getUserByEmail() {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  return user;
}
