"use server";

import prisma from "@/lib/db";

export async function addPet(formData) {
  console.log(formData);
  await prisma?.pet.create({
    data: {
      name: formData.get("name"),
      ownerName: formData.get("ownerName"),
      imageUrl:
        formData.get("imageUrl") ||
        "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
      age: parseInt(formData.get("age")), // A string to convert into a number.
      notes: formData.get("notes"),
    },
  });
}
