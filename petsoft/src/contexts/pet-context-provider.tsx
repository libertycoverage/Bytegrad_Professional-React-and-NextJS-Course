"use client";

import { createContext, useState } from "react";

export const PetContext = createContext(null); // 1. create a Context

//export default function PetContextProvider({ children }) { // V280 accept data
export default function PetContextProvider({ data, children }) {
  //const [pets, setPets] = useState([]); // V280
  const [pets, setPets] = useState(data);
  const [selectedPetId, setSelectedPetId] = useState(null);

  return (
    <PetContext.Provider value={{ pets, selectedPetId }}>
      {children}
    </PetContext.Provider>
  );
}
