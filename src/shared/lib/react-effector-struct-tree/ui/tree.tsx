import React from "react";
import { createPortal } from "react-dom";
import {
  DndContext,
  useSensor,
  useSensors,
  DragOverlay,
  PointerSensor,
  Modifier,
  DragStartEvent,
} from "@dnd-kit/core";
import { useStore, useStoreMap } from "effector-react";
import { useTreeUnits } from "./context";
import { Item, ItemBase } from "./item";
import { Tree, defaultItemState } from "../model";
import { useEvent } from "effector-react/scope";
import { IS_BROWSER } from "shared/config/constants";

type StructTreeBaseProps = {
  style?: React.CSSProperties
}

export const StructTreeBase: React.FC<StructTreeBaseProps> = (props) => {
  const units = useTreeUnits();
  const tree = useStore(units.$tree);
  const sortedIds = useStore(units.$flatList);
  const dragStartedEv = useEvent(units.dragStarted);
  const dragEndedEv = useEvent(units.dragEnded);
  const dragOverEv = useEvent(units.dragOver);

  // dnd-stuff
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <div style={props.style}>
      <DndContext
        onDragStart={dragStartedEv}
        onDragOver={dragOverEv}
        onDragEnd={dragEndedEv}
        sensors={sensors}
      >
          {tree.children.map((subtree) => (
            <SubTree key={subtree.id} tree={subtree} />
          ))}
          <Overlay />
      </DndContext>
    </div>
  );
};

const SubTree: React.FC<{ tree: Tree }> = (props) => {
  const { tree } = props;
  const units = useTreeUnits();
  const state = useStoreMap({
    store: units.$itemsState,
    keys: [tree.id],
    fn: (reg, [id]) => reg[id] ?? defaultItemState,
  });

  return (
    <>
      <Item depth={tree.depth} id={tree.id} collapsed={state.collapsed} editMode={state.editMode}/>
      {!state.collapsed &&
        tree.children.map((subtree) => (
          <SubTree key={subtree.id} tree={subtree} />
        ))}
    </>
  );
};

const Overlay: React.FC = () => {
  const units = useTreeUnits();
  const targetId = useStore(units.$dragTarget);

  if (!IS_BROWSER) return null;

  return createPortal(
    <DragOverlay>
      {targetId ? <ItemBase depth={0} id={targetId} collapsed editMode={false}/> : null}
    </DragOverlay>,
    document.body
  );
};
