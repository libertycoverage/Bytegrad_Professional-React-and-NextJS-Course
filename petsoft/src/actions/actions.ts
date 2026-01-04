"use server";

import { auth, signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/db";
import { PetEssentials } from "@/lib/types";
import { sleep } from "@/lib/utils";
import { authFormSchema, petFormSchema, petIdSchema } from "@/lib/validations";
import { Pet, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs"; //V356
//import { Pet } from "@prisma/client"; //V321
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkAuth, getPetById } from "@/lib/server-utils"; //V362-V363
import { AuthError } from "next-auth";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); //

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
  // if (process.env.NODE_ENV === "development" ) {
  //   await sleep(1000); //V321
  // } // V397

  const session = await checkAuth(); //V362

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
      data: {
        ...validatedPet.data,
        User: {
          connect: {
            id: session.user!.id,
          },
        },
      },
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
  //await sleep(1000); //V321 // V397

  // authentication check
  const session = await checkAuth(); //V363

  // validation
  //V330
  const validatedPetId = petIdSchema.safeParse(petId);
  const validatedNewPetData = petFormSchema.safeParse(newPetData);
  if (!validatedPetId.success || !validatedNewPetData.success) {
    return {
      message: "Invalid pet data",
    };
  }
  //V330

  // authorization check
  const pet = await prisma.pet.findUnique({
    where: {
      id: validatedPetId.data,
    },
  });
  if (!pet) {
    return {
      message: "Pet not found.",
    };
  }
  if (pet.userId !== session.user!.id) {
    return {
      message: "Not authorized."
    };
  }

  // database mutation
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
  //await sleep(1000); //V321 // V397

  //authentication check (User own pet) //V360
  // const session = await auth(); //V360
  // if (!session?.user) {
  //   redirect("/login");
  // }
  const session = await checkAuth(); //V363

  //V330
  // validation
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "No pet data",
    }; //V368
  }
  //V330

  //V360
  // authorization check
  // const pet = await prisma.pet.findUnique({
  //   where: {
  //     id: validatedPetId.data,
  //   },
  // }); // moved to src/lib/server-utils.ts
  const pet = await getPetById(validatedPetId.data); //V365
  if (!pet) {
    return {
      message: "Pet not found.",
    }; //
  }
  if (pet.userId !== session.user!.id) {
    return {
      message: "Not authorized.",
    }; //
  }
  //V360

  // database mutation
  try {
    await prisma.pet.delete({
      where: {
        //id: petId, //V330
        id: validatedPetId.data, //V330
      },
    }); //
  } catch (error) {
    return {
      message: "Could not delete pet.",
    }; //
  }

  revalidatePath("/app", "layout");
}

// User actions

//V347
//export async function logIn(formData: FormData) //V367
// export async function logIn(formData: unknown) { //V367 //V375
export async function logIn(prevState: unknown, formData: unknown) { //V375

  //await sleep(1000); // V397


  if (!(formData instanceof FormData)) {
  //let formDataObject; //V367

  //V368
  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "There is no form data."
    }; //V368
  }
    // return {
    //   message: "There is no form data."
    // }; //V367
  }
  // convert formData to an object
  const formDataObject = Object.fromEntries(formData.entries()); //V367
  //V368


  // validate moved to auth.ts V368
  // const validatedFormDataObject = authFormSchema.safeParse(formDataObject); //V367
  // if(!validatedFormDataObject.success) {
  //   return {
  //     message: "There is no form data.",
  //   }; //V367
  // } //V368

  //const authData = Object.fromEntries(formData.entries());
  // await signIn("credentials", formData); //V356
  // await signIn("credentials", formDataObject); //V367
//await signIn("credentials", validatedFormDataObject.data); //V368
console.log('SIGNIN DEBUG formDataObject', formDataObject); // debug
console.log('SIGNIN DEBUG formData', formData); // debug

try {
await signIn("credentials", formData); //V368
  //redirect(); //V376
} catch (error) {
  if (error instanceof AuthError) {
    switch (error.type) {
      case 'CredentialsSignin': {
        return {
          message: "Credentials could be incorrect",
        }; //V375
      }  //V375
      default: {
        return {
          message: "Error. Could not sign in.",
        };
      }
    }  //V375
  }  //V375
  // return {
  //   message: "Could not sign in."
  // }; //V375
  throw error; // nextjs redirects throws error, so we need to rethrow it //V376
}  //V375
 //  await signIn("credentials", Object.fromEntries(formData.entries())); //V368

  redirect("/app/dashboard"); //V356
}
//V347

//V353
export async function logOut() {
  //await sleep(1000); //V377 //V397

  await signOut({ redirectTo: "/" }); //V353
}


//export async function signUp(formData: FormData) { //V369
//export async function signUp(formData: unknown) { //V369
export async function signUp(prevState: unknown, formData: unknown) { //V369
  // check if formData is a FormData type
  if (!(formData instanceof FormData)) {
    return {
      message: "No form data"
    }; //V369
  } //V369

  //convert formData to a plain object
  const formDataEntries = Object.fromEntries(formData.entries()); //V369

  //const validatedFormData = authFormSchema.safeParse(formData); //V369
  const validatedFormData = authFormSchema.safeParse(formDataEntries); //V369

  if (!validatedFormData.success) {
    return {
      message: "No form data."
    }; //V369
  } //V369

  const { email, password, subscription } = validatedFormData.data;

  //"use server";
  // const hashedPassword = await bcrypt.hash(
  //   formData.get("password") as string,
  //   10
  // ); //V369
  // const hashedPassword = await bcrypt.hash(
  //   validatedFormData.data.password,
  //   10
  // ); //V369
  const hashedPassword = await bcrypt.hash(
    password,
    10
  ); //V369

try {
  await prisma.user.create({
    data: {
      // email: formData.get("email") as string, //V369
      email, 
      hashedPassword: hashedPassword,
    }, //V369
  }); //V369
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        message: "Email already exists.",
      }; //V372 
    } //V372
  } //V372
  return {
    message: "Could not create."
  }; //V372
} //V372

  await signIn("credentials", formData); //V369
} //V356 moved to actions.ts from auth-form.tsx


// V381
// payment actions

export async function createCheckoutSession() {
  // authentication check
  const session = await checkAuth(); // V381

  // create checkout session
  const checkoutSession = await stripe.checkout.sessions.create({
    customer_email: session.user?.email,
    line_items: [
      {
        price: "price_1ShAN8CkBPUNWuR98slil9Xm",
        quantity: 1,
      } // V381
    ], // V381
    mode: "payment",
    success_url: `${process.env.CANONICAL_URL}/payment?success=true`,
    cancel_url: `${process.env.CANONICAL_URL}/payment?cancelled=true`,
  }); // V381

  // redirect user
  redirect(checkoutSession.url); // V381
} // V381
