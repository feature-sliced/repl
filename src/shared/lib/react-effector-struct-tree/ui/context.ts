import { createContext, useContext } from "react";
import type { ITreeState } from "../model";

const TreeStateContext = createContext<ITreeState | null>(null);

export const useTreeUnits = () => {
  const units = useContext(TreeStateContext);

  if (!units) {
    throw Error("No `tree` units are provided!");
  }

  return units;
};
export const TreeProvider = TreeStateContext.Provider;
