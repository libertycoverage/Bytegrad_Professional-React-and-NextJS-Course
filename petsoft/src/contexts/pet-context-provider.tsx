"use client";

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
};

export const PetContext = createContext<TPetContext | null>(null); // 1. create a Context

//export default function PetContextProvider({ children }) { // V280 accept data
export default function PetContextProvider({
  data,
  children,
}: PetContextProviderProps) {
  //state
  //const [pets, setPets] = useState([]); // V280
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  console.log(selectedPetId);

  // derived state
  const selectedPet = pets.find((pet) => pet.id === selectedPetId); // V284
  const numberOfPets = pets.length; // <- V287

  // event handlers / actions
  const handleAddPet = (newPet: Omit<Pet, "id">) => {
    setPets((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newPet,
      },
    ]);
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
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
