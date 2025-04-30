"use client";

import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet, editPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { toast } from "sonner";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

export default function PetForm({
  actionType,
  onFormSubmission,
}: PetFormProps) {
  // V305
  // const { handleAddPet, handleEditPet, selectedPet } = usePetContext();
  const { handleAddPet, handleEditPet, selectedPet } = usePetContext();

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   const formData = new FormData(event.currentTarget);
  //   const pet = {
  //     name: formData.get("name") as string,
  //     ownerName: formData.get("ownerName") as string,
  //     imageUrl:
  //       (formData.get("imageUrl") as string) ||
  //       "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
  //     age: +(formData.get("age") as string),
  //     notes: formData.get("notes") as string,
  //   };
  //   if (actionType === "add") {
  //     handleAddPet(pet);
  //   } else if (actionType === "edit") {
  //     handleEditPet(selectedPet!.id, pet);
  //   }

  //   onFormSubmission();
  // };
  // V305

  return (
    // <form onSubmit={handleSubmit} className="flex flex-col"> // V305
    <form
      action={async (formData) => {
        onFormSubmission(); // V316
        // V316
        const petData = {
          name: formData.get("name") as string,
          ownerName: formData.get("ownerName") as string,
          imageUrl:
            (formData.get("imageUrl") as string) ||
            "https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png",
          age: Number(formData.get("age")),
          notes: formData.get("notes") as string,
        };
        // V316
        if (actionType === "add") {
          // we can do other things before we invoke the action, and also after we invoke the Server Action
          // before
          // const error = await addPet(formData); //V311 //V316
          // if (error) {  //V316
          //   toast.warning(error.message);  //V316
          //   //alert(error.message);
          //   return;  //V316
          // }  //V316
          await handleAddPet(petData); //V316
        } else if (actionType === "edit") {
          // const error = await editPet(selectedPet?.id, formData); //V311 //V316
          // if (error) { //V316
          //   toast.warning(error.message); //V316
          //   //alert(error.message);
          //   return; //V316
          // }
          await handleEditPet(selectedPet!.id, petData); //V316 //it always exists when editing pet hence !
        }

        // after
        //onFormSubmission(); // V316
      }}
      className="flex flex-col"
    >
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.name : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            name="ownerName"
            type="text"
            required
            defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="text"
            defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            name="age"
            required
            defaultValue={actionType === "edit" ? selectedPet?.age : ""}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            rows={3}
            required
            defaultValue={actionType === "edit" ? selectedPet?.notes : ""}
          />
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
