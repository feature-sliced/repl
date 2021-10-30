import { createTreeState } from "shared/lib/react-effector-struct-tree";

export const fsTree = createTreeState();
export const addNewItem = fsTree.addItem.prepend(() => ({
  title: "New item" + (Math.random() * 1000).toString().slice(0, 4),
  text: "some text",
}));
