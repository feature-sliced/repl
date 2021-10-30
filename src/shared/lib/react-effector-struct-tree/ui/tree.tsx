import React from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  PointerSensor,
  Modifier,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useStore, useStoreMap } from "effector-react";
import { useTreeUnits } from "./context";
import { Item } from "./item";
import { Tree } from "../model";
import { useEvent } from "effector-react/scope";
import { Id } from "../model/types";

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

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};

export const StructTreeBase: React.FC = () => {
  const units = useTreeUnits();
  const tree = useStore(units.$tree);
  const sortedIds = useStore(units.$flatList);
  const dragStartedEv = useEvent(units.dragStarted);
  const dragEndedEv = useEvent(units.dragEnded);

  // dnd-stuff
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <>
      <DndContext
        onDragStart={(event) => {
          dragStartedEv(event.active.id as Id);
        }}
        onDragEnd={() => {
          dragEndedEv();
        }}
        sensors={sensors}
        modifiers={[adjustTranslate]}
      >
        <SortableContext
          items={sortedIds}
          strategy={verticalListSortingStrategy}
        >
          {tree.children.map((subtree) => (
            <SubTree key={subtree.id} tree={subtree} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
};
