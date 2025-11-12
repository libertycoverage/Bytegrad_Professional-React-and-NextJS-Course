import { logIn } from "@/actions/actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

//V344
type AuthFormProps = {
  type: "logIn" | "signUp";
};
//V344

//export default function AuthForm() { //V344
export default function AuthForm({ type }: AuthFormProps) {
  //V344
  return (
    <form action={logIn}>
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>
      <div className="space-y-1 mt-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" />
      </div>
      {/* <Button className="mt-4">Log In </Button> //V344 */}
      <Button className="mt-4">
        {type === "logIn" ? "Log In" : "SignUp"}
      </Button>{" "}
      {/* //V344 */}
    </form>
  );
}
