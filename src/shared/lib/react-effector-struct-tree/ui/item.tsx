import React from "react";
import type { CSSProperties } from "react";
import { Move, ChevronDown, ChevronRight, Trash2 } from "@geist-ui/react-icons";
import { styled } from "@linaria/react";
import { Card, Button } from "@geist-ui/react";
import { useTreeUnits } from "./context";
import { useStoreMap } from "effector-react";
import { Id } from "../model/types";
import { useEvent } from "effector-react/scope";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const DragHandle = styled((props) => (
  <Button iconRight={<Move />} auto scale={1 / 3} {...props} />
))`
  cursor: move;
  cursor: grab;
`;

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

export const Item: React.FC<{ id: Id; depth: number; collapsed: boolean }> = (
  props
) => {
  const units = useTreeUnits();
  const item = useStoreMap({
    store: units.$itemsKv,
    keys: [props.id],
    fn: (kv, [id]) =>
      kv[id] ?? { title: "Something went wrong", text: "Item not found" },
  });
  const toggleCollapse = useEvent(units.toggleCollapsed);
  const remove = useEvent(units.removeItem);

  // sortable stuff
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id: props.id,
    animateLayoutChanges,
  });
  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setDroppableNodeRef} style={style}>
      <div ref={setDraggableNodeRef}>
        <Card>
          <h4>
            <DragHandle {...attributes} {...listeners} />{" "}
            <Button
              iconRight={props.collapsed ? <ChevronRight /> : <ChevronDown />}
              auto
              scale={1 / 3}
              onClick={() => toggleCollapse(props.id)}
            />{" "}
            <Button
              iconRight={<Trash2 />}
              auto
              scale={1 / 3}
              type="error"
              ghost
              onClick={() => remove(props.id)}
            />{" "}
            {item.title}
          </h4>
          {item.text && <p>{item.text}</p>}
        </Card>
      </div>
    </div>
  );
};
