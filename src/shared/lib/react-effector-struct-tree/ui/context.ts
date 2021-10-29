import { createContext, useContext } from "react";
import type { ITreeState } from "../model";

const TreeStateContext = createContext<ITreeState | null>(null);

export const useTree = () => useContext(TreeStateContext);
export const TreeProvider = TreeStateContext.Provider;
