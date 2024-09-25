"use client";

//import { Pet } from "@/lib/types"; // V280
import { usePetContext } from "@/lib/hooks";
import Image from "next/image";

// V280 removed
// type PetListProps = {
//   pets: Pet[];
// };

//export default function PetList({ pets }: PetListProps) { // V280 prop 'data' accepted as `pets` removed for usage of Context API Provider component pet-context-provider.tsx
export default function PetList() {
  const { pets } = usePetContext(); //V280 Consuming the Context with custom hook
  return (
    <ul className="bg-white border-b border-black/[0.08]">
      {pets.map((pet) => (
        <li key={pet.id}>
          <button className="flex items-center h-[70px] w-full cursor-pointer px-5 text-base gap-3 hover:bg-[#EFF1F2] focus:bg-[#EFF1F2] transition">
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
      ))}
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
