import React from "react";
import { TreeProvider, TreeThemeProvider } from "./context";
import type { ITreeState } from "../model";
import { StructTreeBase } from "./tree";

type StructTreeProps = {
  tree: ITreeState;
  depthPadding?: number;
  style?: Record<string, React.CSSProperties>;
  hoveredNodeClassName?: string;
};

const treeDefaultStyle = {
  hoveredNode: {
    border: "2px solid #f81ce5"
  },
}


export const StructTree: React.FC<StructTreeProps> = ({
  tree,
  style = treeDefaultStyle,
  depthPadding = 30,
  hoveredNodeClassName,
}) => (
  <TreeProvider value={tree}>
    <TreeThemeProvider
      value={{
        style,
        depthPadding,
        hoveredNodeClassName,
      }}
    >
      <StructTreeBase />
    </TreeThemeProvider>
  </TreeProvider>
);
