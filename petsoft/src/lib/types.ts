// V321
// export type Pet = {
//   id: string;
//   name: string;
//   ownerName: string;
//   imageUrl: string;
//   age: number;
//   notes: string;
// };
// V321

import { Pet } from "@prisma/client";

export type PetEssentials = Omit<Pet, "id" | "createdAt" | "updatedAt"| "userId">; //V370
