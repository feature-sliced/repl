import React from "react";
import { TreeProvider } from "./context";
import type { ITreeState } from "../model";
import { StructTreeBase } from "./tree";

type StructTreeProps = {
  tree: ITreeState;
};

export const StructTree: React.FC<StructTreeProps> = (props) => {
  return (
    <TreeProvider value={props.tree}>
      <StructTreeBase />
    </TreeProvider>
  );
};
