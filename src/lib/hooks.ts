import { PetContext } from "@/contexts/pet-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext } from "react";

export function usePetContext() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePetContext must be used with in a PetContextProvider");
  }
  return context;
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error(
      "useSearchContext must be used with in a PetContextProvider"
    );
  }
  return context;
}
