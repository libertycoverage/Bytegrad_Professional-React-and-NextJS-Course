"use client";

import { usePetContext } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { addPet, editPet } from "@/actions/actions";
import PetFormBtn from "./pet-form-btn";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

type PetFormProps = {
  actionType: "add" | "edit";
  onFormSubmission: () => void;
};

type TPetForm = {
  name: string;
  ownerName: string;
  imageUrl: string;
  age: number;
  notes: string;
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

  //V322
  // const {
  //   register,
  //   formState: { errors },
  // } = useForm<{
  //   name: string;
  //   ownerName: string;
  //   imageUrl: string;
  //   age: string;
  //   notes: string;
  // }>();
  //V322

  //V322
  const {
    register,
    formState: { errors },
  } = useForm<TPetForm>();
  //V322

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
          await handleAddPet(petData); //V316 //V321
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
            {...register("name")} //V322
            // name="name" //V322
            // type="text" //V322
            // required //V322
            // defaultValue={actionType === "edit" ? selectedPet?.name : ""} //V322
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input
            id="ownerName"
            {...register("ownerName")} //V322
            // name="ownerName"//V322
            // type="text" //V322
            // required //V322
            // defaultValue={actionType === "edit" ? selectedPet?.ownerName : ""} //V322
          />
          {errors.ownerName && (
            <p className="text-red-500">{errors.ownerName.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input
            id="imageUrl"
            {...register("imageUrl")} //V322
            // name="imageUrl" //V322
            // type="text" //V322
            // defaultValue={actionType === "edit" ? selectedPet?.imageUrl : ""} //V322
          />
          {errors.imageUrl && (
            <p className="text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...register("age")} //V322
            // name="age" //V322
            // required  //V322
            // defaultValue={actionType === "edit" ? selectedPet?.age : ""}  //V322
          />
          {errors.age && <p className="text-red-500">{errors.age.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")} //V322
            // name="notes" //V322
            // rows={3} //V322
            // required //V322
            // defaultValue={actionType === "edit" ? selectedPet?.notes : ""} //V322
          />
          {errors.notes && (
            <p className="text-red-500">{errors.notes.message}</p>
          )}
        </div>
      </div>

      <PetFormBtn actionType={actionType} />
    </form>
  );
}
