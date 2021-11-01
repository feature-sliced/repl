import React from "react";
import type { CSSProperties } from "react";
import { Move, ChevronDown, ChevronRight, Trash2 } from "@geist-ui/react-icons";
import { styled } from "@linaria/react";
import { Button } from "@geist-ui/react";
import { useTreeUnits } from "./context";
import { useStoreMap } from "effector-react";
import { Id } from "../model/types";
import { useEvent } from "effector-react/scope";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { fsTheme, palette } from "shared/config/theme";

const animateLayoutChanges: AnimateLayoutChanges = ({
  isSorting,
  wasDragging,
}) => (isSorting || wasDragging ? false : true);

type ItemProps = {
  id: Id;
  depth: number;
  collapsed: boolean;
};

export const Item: React.FC<ItemProps> = (props) => {
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
    <div
      ref={setDroppableNodeRef}
      style={{ ...style, maxWidth: `${100 - props.depth * 2}%` }}
    >
      <div ref={setDraggableNodeRef}>
        <ItemBase {...props} attributes={attributes} listeners={listeners} />
      </div>
    </div>
  );
};

export const ItemBase: React.FC<
  ItemProps & {
    attributes?: ReturnType<typeof useSortable>["attributes"];
    listeners?: ReturnType<typeof useSortable>["listeners"];
  }
> = (props) => {
  const units = useTreeUnits();
  const item = useStoreMap({
    store: units.$itemsKv,
    keys: [props.id],
    fn: (kv, [id]) =>
      kv[id] ?? { title: "Something went wrong", text: "Item not found" },
  });
  const toggleCollapse = useEvent(units.toggleCollapsed);
  const remove = useEvent(units.removeItem);

  return (
    <Box>
      <span>
        <DragHandle {...props.attributes} {...props.listeners} />{" "}
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
      </span>
      <Details>
        <h4>{item.title}</h4>
        {item.text && <p>{item.text}</p>}
      </Details>
    </Box>
  );
};

const Box = styled.div`
  display: flex;
  align-items: center;
  background-color: ${palette.alternative};
  border-radius: ${fsTheme.layout.radius};
  margin-bottom: ${fsTheme.layout.gapHalf};
  padding: ${fsTheme.layout.gapHalf};

  & > *:not(:last-child) {
    margin-right: ${fsTheme.layout.gapHalf};
  }
`;

const Details = styled.div`
  display: flex;

  & > *:not(:last-child) {
    margin-right: ${fsTheme.layout.gapHalf};
  }

  & > h4 {
    font-size: ${fsTheme.layout.gap};
    margin-bottom: 0;
  }

  & > p {
    margin: ${fsTheme.layout.gapQuarter} 0;
  }
`;

const DragHandle = styled((props) => (
  <Button iconRight={<Move />} auto scale={1 / 3} {...props} />
))`
  cursor: move;
  cursor: grab;
`;
