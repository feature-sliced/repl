import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useStore, useEvent, useList } from "effector-react";
import { useTree } from "./context";
import { Item } from "./item";

export const StructTreeBase: React.FC = () => {
  const units = useTree();

  return useList(units.$flatTree, {
    fn: (item) => <Item {...item} />,
  });
};
