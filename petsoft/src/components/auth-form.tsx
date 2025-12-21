"use client";

import { logIn, signUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import prisma from "@/lib/db"; //V356
import AuthFormButton from "./auth-form-button";
import { useFormState } from "react-dom";

//V344
type AuthFormProps = {
  type: "logIn" | "signUp";
};
//V344

//export default function AuthForm() { //V344
export default function AuthForm({ type }: AuthFormProps) {

  // function signUp(formData: FormData) {
  //   "use server";

  //   prisma.user.create({
  //     data: {
  //       email: formData.get("email"),
  //       password: formData.get("password"),
  //     },
  //   });
  // } //V356 moved to actions.ts
  //V344

  const [signUpError, dispatchSignUp] = useFormState(signUp, undefined); //V374
  const [logInError, dispatchLogIn] = useFormState(logIn, undefined); //V375
  return (
    // <form action={type === "logIn" ? logIn : signUp}> //V374
    <form action={type === "logIn" ? dispatchLogIn : dispatchSignUp}>
      {/* //V374 V375*/}
      {/* //V356 */}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        {/* <Input id="email" name="email" type="email" /> */}
        <Input id="email" name="email" type="email" required maxLength={170} />
        {/* //V367 */}
      </div>
      <div className="space-y-1 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required maxLength={170} />
      </div>
      {/* <Button className="mt-4">Log In </Button> //V344 */}
      {/* <Button className="mt-4"> 
        {type === "logIn" ? "Log In" : "SignUp"}
      </Button>{" "} //V372 */}
      {/* //V344 */}
       <AuthFormButton type={type} />  {/* //V373 */}

       {signUpError && <p className="text-red-500 text-sm mt-2">{signUpError.message}</p>}
       {/* //V374 */}
       {logInError && <p className="text-red-500 text-sm mt-2">{logInError.message}</p>}
       {/* //V375 */}       
    </form>
  );//
}//
