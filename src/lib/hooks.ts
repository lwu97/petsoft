import { PetContext } from "@/contexts/pet-context-provider";
import { useContext } from "react";

export default function usePetContext() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used with in a PetContextProvider");
  }
  return context;
}
