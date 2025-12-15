import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export const petFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, { message: "" })
      .max(170, { message: "" }),
    ownerName: z
      .string()
      .trim()
      .min(3, { message: "" })
      .max(170),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url({ message: "" }),
    ]),
    age: z.coerce.number().int().positive().max(999),
    notes: z.union([z.literal(""), z.string().trim().max(1000)]),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export type TPetForm = z.infer<typeof petFormSchema>; // V325

export const petIdSchema = z.string().cuid();

export const authFormSchema = z.object({
  email: z.string().email().max(170),
  password: z.string().max(170),
  subscription: z.union([z.literal("free"), z.literal("propremium")]),
}); //V367


export type EuthForm = z.infer<typeof authFormSchema>; // V368