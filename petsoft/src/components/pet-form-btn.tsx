import React from "react";
import { Button } from "./ui/button";
import { useFormStatus } from "react-dom";

// V321
// export default function PetFormBtn({ actionType }) {
//   const { pending } = useFormStatus();
//   return (
//     <Button type="submit" disabled={pending} className="mt-5 self-end">
//       {actionType === "add" ? "Add a new pet" : "Edit pet"}
//     </Button>
//   );
// }
// V321

// V321
type PetFormBtnProps = {
  actionType: "add" | "edit"; //string literal
};

export default function PetFormBtn({ actionType }: PetFormBtnProps) {
  return (
    <Button type="submit" className="mt-5 self-end">
      {actionType === "add" ? "Add a new pet" : "Edit pet"}
    </Button>
  );
}
// V321
