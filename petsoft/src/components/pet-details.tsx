"use client";

import { usePetContext } from "@/lib/hooks";
//import { Pet } from "@/lib/types"; //V321
import { Pet } from "@prisma/client"; //V321
import Image from "next/image";
import PetButton from "./pet-button";
import { deletePet } from "@/actions/actions";
//import { useTransition } from "react"; //V321

export default function PetDetails() {
  const { selectedPet } = usePetContext();
  return (
    <section className="flex flex-col h-full w-full">
      {!selectedPet ? (
        <div className="h-full flex justify-center items-center">
          <EmptyView />
        </div>
      ) : (
        <>
          <TopBar pet={selectedPet} />

          <OtherInfo pet={selectedPet} />

          <Notes pet={selectedPet} />
        </>
      )}
    </section>
  );
}

type TPetProps = {
  pet: Pet;
};

function TopBar({ pet }: TPetProps) {
  const { handleCheckoutPet } = usePetContext();
  ///const [isPending, startTransition] = useTransition(); //V321
  return (
    // <div className="flex items-center bg-white px-8 py-5 border-b border-black/[0.08]"> // V286
    <div className="flex items-center bg-white px-8 py-5 border-b border-light">
      {" "}
      {/* // V286 */}
      <Image
        //src={selectedPet?.imageUrl}
        // src={pet?.imageUrl} //V316
        src={pet.imageUrl} // V316
        alt="Selected pet image"
        height={75}
        width={75}
        className="h-[75px] w-[75px] rounded-full object-cover"
      />
      <h2 className="text-3xl font-semibold leading-7 ml-5">
        {/* {selectedPet?.name} */}
        {/* {pet?.name} //V316 */}
        {pet.name}
      </h2>
      <div className="ml-auto space-x-2">
        <PetButton actionType="edit">Edit</PetButton>
        <PetButton
          actionType="checkout"
          // onClick={() => handleCheckoutPet(pet.id)} //V313
          //disabled={isPending} //V321
          onClick={
            async () =>
              //{ // V316
              //startTransition(async () => { // V316
              //  await deletePet(pet.id); // V316
              // }); // V316
              //} // V316
              //  await handleCheckoutPet(pet?.id) // V316
              await handleCheckoutPet(pet.id) // V316
          }
        >
          Checkout
        </PetButton>{" "}
        {/* delete */}
      </div>
    </div>
  );
}

function OtherInfo({ pet }: TPetProps) {
  return (
    <div className="flex justify-around py-10 px-5 text-center">
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">
          Owner name
        </h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.ownerName}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-medium uppercase text-zinc-700">Age</h3>
        <p className="mt-1 text-lg text-zinc-800">{pet?.age}</p>
      </div>
    </div>
  );
}

function Notes({ pet }: TPetProps) {
  return (
    // <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-black/[0.08]"> // V286
    <section className="flex-1 bg-white px-7 py-5 rounded-md mb-9 mx-8 border border-light">
      {" "}
      {/* // V286 */}
      {pet?.notes}
    </section>
  );
}

function EmptyView() {
  return <p className="text-2xl font-medium">No pet selected</p>;
}
