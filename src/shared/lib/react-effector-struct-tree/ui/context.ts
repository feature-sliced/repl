import React, { createContext, useContext } from "react";
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


type TreeTheme = {
  depthPadding: number;
  style: Record<string, React.CSSProperties>
  hoveredNodeClassName?: string;
}

const TreeThemeContext = createContext<TreeTheme | null>(null);

export const useTreeTheme = () => {
  const theme = useContext(TreeThemeContext);

  if (!theme) {
    throw Error("No any 'theme' are provided!");
  }

  return theme;
};

export const TreeThemeProvider = TreeThemeContext.Provider;