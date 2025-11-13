"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
//import { Pet } from "@prisma/client"; //V321
import { revalidatePath } from "next/cache";
// --- pet actions ---
//export async function addPet(formData) { // V316
//export async function addPet(petData: Pet) { //V321
// export async function addPet(petData: PetEssentials) { //V329
export async function addPet(petData: unknown) {
  //V329
  console.log(petData); //V328
  //V321
  // V316
  //await sleep(2000); //V321
  await sleep(1000); //V321

  //  console.log(formData); // V316

  const validatedPet = petFormSchema.safeParse(petData); //V328
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }
  //V328

  try {
    await prisma?.pet.create({
      // data: { // V316
      //   name: formData.get("name"), // V316
      //   ownerName: formData.get("ownerName"), // V316
      //   imageUrl: // V316
      //     formData.get("imageUrl") || // V316
      //     "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png", // V316
      //   age: parseInt(formData.get("age")), // A string to convert into a number. // V316
      //   notes: formData.get("notes"), // V316
      // }, // V316

      //data: petData, // V316 // that is right V318
      data: validatedPet.data,
      //data: pet, // simulating an error with optimistic UI V318
    });
  } catch (error) {
    console.log(error); //V328
    return {
      message: "Could not add pet.",
    };
  }

  revalidatePath("/app", "layout");
}

// export async function editPet(petId, formData) { // V316
//export async function editPet(petId, newPetData) { //V321
//export async function editPet(petId: Pet["id"], newPetData: PetEssentials) { //V329
export async function editPet(petId: unknown, newPetData: unknown) {
  //V329
  // V315

  //await sleep(2000); //V321
  await sleep(1000); //V321

  //V330
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedNewPetData = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedNewPetData.success) {
    return {
      message: "Invalid pet data",
    };
  }
  //V330

  try {
    await prisma.pet.update({
      where: {
        //id: petId, //V330
        id: validatedPetId.data, //V330
      },
      // V316
      // data: {
      //   name: formData.get("name"),
      //   ownerName: formData.get("ownerName"),
      //   age: parseInt(formData.get("age")),
      //   imageUrl:
      //     formData.get("imageUrl") ||
      //     "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      //   notes: formData.get("notes"),
      // },
      // V316
      //data: newPetData, // V316 //V330
      data: validatedNewPetData.data, //V330
    });
  } catch (error) {
    return {
      message: "Could not edit a pet.",
    };
  }
  revalidatePath("/app", "layout");
}

//export async function deletePet(petId) { //V321
//export async function deletePet(petId: Pet["id"]) { // V329
export async function deletePet(petId: unknown) {
  //V329
  //V321
  //await sleep(2000); //V321
  await sleep(1000); //V321

  //V330
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }
  //V330

  try {
    await prisma.pet.delete({
      where: {
        //id: petId, //V330
        id: validatedPetId.data, //V330
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}

// --- user actions ---

//V347
export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());

  await signIn("credentials", authData);
}
//V347

//V353
export async function logOut() {
  await signOut({ redirectTo: "/" });
}
//V353
