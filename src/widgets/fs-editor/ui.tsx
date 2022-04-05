import React from "react";
import { StructTree } from "shared/lib/react-effector-struct-tree";
import { fsTree } from "features/fs-edit";

export const FsTree: React.FC = () => {
  return <StructTree tree={fsTree}/>;
};
