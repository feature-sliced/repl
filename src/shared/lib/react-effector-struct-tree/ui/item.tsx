import React from "react";
import { Move, ChevronDown, ChevronRight } from "@geist-ui/react-icons";
import { styled } from "@linaria/react";
import { Card, Button } from "@geist-ui/react";
import { useTree } from "./context";
import { useStoreMap } from "effector-react";
import { Id } from "../model/types";
import { useEvent } from "effector-react/scope";

const DragHandle = styled((props) => (
  <Button iconRight={<Move />} auto scale={1 / 3} {...props} />
))`
  cursor: move;
  cursor: grab;
`;

export const Item: React.FC<{ id: Id; depth: number; collapsed: boolean }> = (
  props
) => {
  const units = useTree();
  const item = useStoreMap({
    store: units.$itemsKv,
    keys: [props.id],
    fn: (kv, [id]) => kv[id] ?? null,
  });
  const toggleCollapse = useEvent(units.toggleCollapsed);

  if (!item) {
    return (
      <Card type="alert">
        <h4>Something went wrong!</h4>
        <p>Item details not found</p>
      </Card>
    );
  }

  return (
    <Card shadow>
      <h4>
        <DragHandle />{" "}
        <Button
          iconRight={props.collapsed ? <ChevronRight /> : <ChevronDown />}
          auto
          scale={1 / 3}
          onClick={() => toggleCollapse(props.id)}
        />{" "}
        {item.title}
      </h4>
      {item.text && <p>{item.text}</p>}
    </Card>
  );
};
