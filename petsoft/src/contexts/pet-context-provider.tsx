"use client";

import { addPet, deletePet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
//import { Pet } from "@/lib/types"; //V321
import { Pet } from "@prisma/client"; //V321
import { createContext, useOptimistic, useState } from "react";
import { toast } from "sonner";

//V281
type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  //selectedPetId: string | null; //V321
  selectedPetId: Pet["id"] | null; //V321
  //handleChangeSelectedPetId: (id: string) => void; //V321
  handleChangeSelectedPetId: (id: Pet["id"]) => void; //V321

  selectedPet: Pet | undefined;
  numberOfPets: number;
  // handleCheckoutPet: (id: string) => void; // V316
  //handleCheckoutPet: (id: string) => Promise<void>; // V316 //V321
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>; // V316 //V321

  // handleAddPet: (newPet: Omit<Pet, "id">) => void; // V316
  //handleAddPet: (newPet: Omit<Pet, "id">) => Promise<void>; // V316 //V321
  handleAddPet: (newPet: PetEssentials) => Promise<void>; //V321
  // handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void; // V316
  //handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => Promise<void>; // V316 //V321
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>; //V321
};

export const PetContext = createContext<TPetContext | null>(null); // 1. create a Context

//export default function PetContextProvider({ children }) { // V280 accept data
export default function PetContextProvider({
  // data: pets, //V316
  data,
  children,
}: PetContextProviderProps) {
  //console.log(data.length);
  //state
  //const [pets, setPets] = useState([]); // V280
  //const [pets, setPets] = useState(data); //V307

  // V316
  // const [optimisticPets, setOptimisticPets] = useOptimistic(
  //   data,
  //   (state, newPet) => {
  //     return [...state, newPet];
  //   }
  // ); // V316 // these pets are now optimistic version of pets optimisticPets
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    //(state, newPet) => { //V320
    // return [...state, { ...newPet, id: Math.random().toString() }]; //V320
    // ----> V320
    (prev, { action, payload }) => {
      switch (action) {
        case "add":
          return [...prev, { ...payload, id: Math.random().toString() }];
        case "edit":
          return prev.map((pet) => {
            if (pet.id === payload.id) {
              return { ...pet, ...payload.newPetData };
            }
            return pet;
          });
        case "delete":
          return prev.filter((pet) => pet.id !== payload);
        default:
          return prev;
      }
    }
  );
  // ----> V320
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  console.log(selectedPetId);

  // derived state
  //const selectedPet = pets.find((pet) => pet.id === selectedPetId); // V284 // V316
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId); // V316
  //const numberOfPets = pets.length; // <- V287 // V316
  const numberOfPets = optimisticPets.length; // V316

  // event handlers / actions
  //const handleAddPet = async (newPet: Omit<Pet, "id">) => { //V321
  const handleAddPet = async (newPet: PetEssentials) => {
    //V321
    //V321
    //V321
    // setPets((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now().toString(),
    //     ...newPet,
    //   },
    // ]);

    // moved from pet-form.tsx V316
    //await addPet(newPet); //V316
    //setOptimisticPets(newPet); // V316 //V320
    setOptimisticPets({ action: "add", payload: newPet }); //V320
    const error = await addPet(newPet); //V311 //V316
    if (error) {
      //V315
      toast.warning(error.message); //V316
      //alert(error.message);
      return; //V316
    }
  };

  //const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => { //V316
  //const handleEditPet = async (petId: string, newPetData: Omit<Pet, "id">) => { //V321
  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
    //V316

    // setPets((prev) => // V316
    //   // prev.map will return a new array
    //   // we are going over the existing pets
    //   prev.map((pet) => { // V316
    //     // we are going to find the pet that is tried to be changed
    //     if (pet.id === petId) { // V316
    //       // for that one we are returning a new object
    //       return { // V316
    //         id: petId, // V316
    //         ...newPetData, // V316
    //       }; // V316
    //     } // V316
    //     // if it is not the id we want to change we do not want to do anything, we just return pet, so the new array will still have other pets that are not being modified
    //     return pet; // V316
    //   }) // V316
    // ); // V316

    // moved from pet-form.tsx V316
    setOptimisticPets({ action: "edit", payload: { id: petId, newPetData } }); //V320
    const error = await editPet(petId, newPetData); //V311 //V316
    if (error) {
      //V316
      toast.warning(error.message); //V316
      //alert(error.message);
      return; //V316
    }
  };

  // const handleCheckoutPet = (id: string) => { // V316
  //const handleCheckoutPet = async (petId: string) => { //V321
  const handleCheckoutPet = async (petId: Pet["id"]) => {
    //V321

    // V316
    // setPets((prev) => prev.filter((pet) => pet.id !== id)); // V316
    //await deletePet(petId); // V316 moved from pet-details.tsx //V320
    setOptimisticPets({ action: "delete", payload: petId }); //V320
    const error = await deletePet(petId); //V320
    // --> V320
    if (error) {
      toast.warning(error.message);
      return;
    }
    // --> V320
    // V316
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    // <PetContext.Provider value={{ pets, selectedPetId, setSelectedPetId }}> // V282
    <PetContext.Provider
      value={{
        pets: optimisticPets, //V316
        selectedPetId,
        handleChangeSelectedPetId,
        selectedPet,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
