import React from "react";
import { TreeProvider, TreeTheme, TreeThemeProvider } from "./context";
import type { ITreeState } from "../model";
import { StructTreeBase } from "./tree";

type StructTreeProps = {
  tree: ITreeState;
  style?: React.CSSProperties;
} & Partial<TreeTheme>;

const hoveredNodeDefaultStyle = {
  border: "2px solid #f81ce5",
}

export const StructTree: React.FC<StructTreeProps> = ({
  tree,
  hoveredNodeStyle = hoveredNodeDefaultStyle,
  hoveredNodeClassName = '',
  depthPadding = 30,
  style = {}
}) => (
  <TreeProvider value={tree}>
    <TreeThemeProvider
      value={{
        depthPadding,
        hoveredNodeStyle,
        hoveredNodeClassName,
      }}
    >
      <StructTreeBase style={style}/>
    </TreeThemeProvider>
  </TreeProvider>
);
