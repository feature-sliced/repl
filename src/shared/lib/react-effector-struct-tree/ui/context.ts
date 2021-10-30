import { createContext, useContext } from "react";
import type { ITreeState } from "../model";

const TreeStateContext = createContext<ITreeState | null>(null);

export const useTreeUnits = () => useContext(TreeStateContext);
export const TreeProvider = TreeStateContext.Provider;
