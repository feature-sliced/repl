import React from "react";
import { Move } from "@geist-ui/react-icons";
import { Card } from "@geist-ui/react";
import type { Tree } from "../model";
import { useTree } from "./context";
import { useStoreMap } from "effector-react";
import { Id } from "../model/types";

export const Item: React.FC<{ id: Id; depth: number }> = (props) => {
  const units = useTree();
  const item = useStoreMap({
    store: units.$itemsKv,
    keys: [props.id],
    fn: (kv, [id]) => kv[id] ?? null,
  });

  if (!item) {
    return (
      <Card type="alert">
        <h1>Something went wrong!</h1>
        <p>Item details not found</p>
      </Card>
    );
  }

  return (
    <Card shadow>
      <h1>
        <Move /> {item.title}
      </h1>
      {item.text && <p>{item.text}</p>}
    </Card>
  );
};
