"use server";

import { signIn } from "@/lib/auth";
import prisma from "@/lib/db";
import { petFormSchema, petIdSchema } from "@/lib/validations";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";

export async function logIn(formData: FormData) {
  const authData = Object.fromEntries(formData.entries());

  await signIn("credentials", authData);
}

export default async function addPet(pet: unknown) {
  const validatedPet = petFormSchema.safeParse(pet);
  if (!validatedPet.success) {
    return {
      message: "Invalid pet data",
    };
  }
  try {
    await prisma.pet.create({
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not add pet.",
    };
  }
  revalidatePath("/app", "layout");
}
export async function editPet(petId: unknown, newPetData: unknown) {
  const validatedPet = petFormSchema.safeParse(newPetData);
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPet.success || !validatedPetId.success) {
    return {
      message: "Invalid pet data",
    };
  }
  try {
    await prisma.pet.update({
      where: {
        id: validatedPetId.data,
      },
      data: validatedPet.data,
    });
  } catch (error) {
    return {
      message: "Could not edit pet.",
    };
  }

  revalidatePath("/app", "layout");
}

export async function deletePet(petId: unknown) {
  const validatedPetId = petIdSchema.safeParse(petId);
  if (!validatedPetId.success) {
    return {
      message: "Invalid pet id",
    };
  }
  try {
    await prisma.pet.delete({
      where: {
        id: validatedPetId.data,
      },
    });
  } catch (error) {
    return {
      message: "Could not delete pet.",
    };
  }

  revalidatePath("/app", "layout");
}
