import { createTreeState } from "shared/lib/react-effector-struct-tree";

export const fsTree = createTreeState();
export const addNewItem = fsTree.addItem.prepend(() => ({
  title: "New item",
  text: "some text",
}));
