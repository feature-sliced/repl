import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useStore, useEvent, useList, useStoreMap } from "effector-react";
import { useTreeUnits } from "./context";
import { Item } from "./item";
import { Tree } from "../model";

const SubTree: React.FC<{ tree: Tree }> = (props) => {
  const { tree } = props;
  const units = useTreeUnits();
  const state = useStoreMap({
    store: units.$itemsState,
    keys: [tree.id],
    fn: (reg, [id]) => reg[id] ?? { collapsed: false },
  });

  return (
    <>
      <Item id={tree.id} depth={tree.depth} collapsed={state.collapsed} />
      {!state.collapsed &&
        tree.children.map((subtree) => (
          <SubTree key={subtree.id} tree={subtree} />
        ))}
    </>
  );
};

export const StructTreeBase: React.FC = () => {
  const units = useTreeUnits();
  const tree = useStore(units.$tree);
  const sortedIds = useStore(units.$flatList);

  return (
    <>
      <DndContext>
        <SortableContext items={sortedIds}>
          {tree.children.map((subtree) => (
            <SubTree key={subtree.id} tree={subtree} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
