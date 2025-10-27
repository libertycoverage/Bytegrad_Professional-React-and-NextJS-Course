"use server";

import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { petFormSchema } from "@/lib/validations";
import { Pet } from "@prisma/client";
//import { Pet } from "@prisma/client"; //V321
import { revalidatePath } from "next/cache";

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

  try {
    await prisma.pet.update({
      where: {
        id: petId,
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
      data: newPetData, // V316
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

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}
