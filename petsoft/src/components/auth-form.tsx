import { logIn, signUp } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import prisma from "@/lib/db"; //V356
import AuthFormButton from "./auth-form-button";

//V344
type AuthFormProps = {
  type: "logIn" | "signUp";
};
//V344

//export default function AuthForm() { //V344
export default function AuthForm({ type }: AuthFormProps) {
useFormStatus();

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
  return (
    <form action={type === "logIn" ? logIn : signUp}>
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
       <AuthFormButton type={type} />  {/* //V372 */}
    </form>
  );
}
