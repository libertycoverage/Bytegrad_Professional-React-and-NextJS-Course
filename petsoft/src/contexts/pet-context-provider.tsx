"use client";

import { addPet } from "@/actions/actions";
import { Pet } from "@/lib/types";
import { createContext, useState } from "react";

//V281
type PetContextProviderProps = {
  data: Pet[];
  children: React.ReactNode;
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: string | null;
  handleChangeSelectedPetId: (id: string) => void;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleCheckoutPet: (id: string) => void;
  handleAddPet: (newPet: Omit<Pet, "id">) => void;
  handleEditPet: (petId: string, newPetData: Omit<Pet, "id">) => void;
};

export const PetContext = createContext<TPetContext | null>(null); // 1. create a Context

//export default function PetContextProvider({ children }) { // V280 accept data
export default function PetContextProvider({
  data: pets,
  children,
}: PetContextProviderProps) {
  //console.log(data.length);
  //state
  //const [pets, setPets] = useState([]); // V280
  //const [pets, setPets] = useState(data); //V307
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  console.log(selectedPetId);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId); // V284
  const numberOfPets = pets.length; // <- V287

  // event handlers / actions
  const handleAddPet = async (newPet: Omit<Pet, "id">) => {
    // setPets((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now().toString(),
    //     ...newPet,
    //   },
    // ]);
    await addPet(newPet);
  };

  const handleEditPet = (petId: string, newPetData: Omit<Pet, "id">) => {
    setPets((prev) =>
      // prev.map will return a new array
      // we are going over the existing pets
      prev.map((pet) => {
        // we are going to find the pet that is tried to be changed
        if (pet.id === petId) {
          // for that one we are returning a new object
          return {
            id: petId,
            ...newPetData,
          };
        }
        // if it is not the id we want to change we do not want to do anything, we just return pet, so the new array will still have other pets that are not being modified
        return pet;
      })
    );
  };

  const handleCheckoutPet = (id: string) => {
    setPets((prev) => prev.filter((pet) => pet.id !== id));
    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: string) => {
    setSelectedPetId(id);
  };

  return (
    // <PetContext.Provider value={{ pets, selectedPetId, setSelectedPetId }}> // V282
    <PetContext.Provider
      value={{
        pets,
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
