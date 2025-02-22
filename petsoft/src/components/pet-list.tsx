"use client";

//import { Pet } from "@/lib/types"; // V280
import { usePetContext, useSearchContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMemo } from "react";

// V280 removed
// type PetListProps = {
//   pets: Pet[];
// };

//export default function PetList({ pets }: PetListProps) { // V280 prop 'data' accepted as `pets` removed for usage of Context API Provider component pet-context-provider.tsx
export default function PetList() {
  //const { pets, setSelectedPetId } = usePetContext(); //V280 Consuming the Context with custom hook // V282
  //const { pets, handleChangeSelectedPetId } = usePetContext(); // V282 //V283
  const { pets, handleChangeSelectedPetId, selectedPetId } = usePetContext(); //V283
  const { searchQuery } = useSearchContext(); //V289

  //const filteredPets = pets.filter(pet => pet.name.includes('b')); //V289
  //const filteredPets = pets.filter(pet => pet.name.toLowerCase().includes(searchQuery)); //V289
  const filteredPets = useMemo(
    () => pets.filter((pet) => pet.name.toLowerCase().includes(searchQuery)),
    [pets, searchQuery]
  );

  return (
    // <ul className="bg-white border-b border-black/[0.08]"> // V286
    <ul className="bg-white border-b border-light">
      {" "}
      {/* // V286 */}
      {/* {pets.map((pet) => ( // V289 */}
      {filteredPets.map(
        (
          pet // V289
        ) => (
          <li key={pet.id}>
            <button
              // onClick={() => setSelectedPetId(pet.id)} // V282
              onClick={() => handleChangeSelectedPetId(pet.id)}
              //className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition" //V283
              className={cn(
                "flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition",
                { "bg-[#EFF1F2]": selectedPetId === pet.id }
              )} //V283
            >
              <Image
                src={pet.imageUrl}
                alt="Pet image"
                width={45}
                height={45}
                className="w-[45px] h-[45px] rounded-full object-cover"
              />
              <p className="font-semibold">{pet.name}</p>
            </button>
          </li>
        )
      )}
      {/* <li>
        <button className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
          <Image
            src="https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png"
            alt="Pet image"
            width={45}
            height={45}
            className="rounded-full object-cover"
          />
          <p>Benjamin</p>
        </button>
      </li> */}
    </ul>
  );
}
