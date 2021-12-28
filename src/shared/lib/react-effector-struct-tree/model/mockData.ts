import { ItemKV, Tree } from "./types";
import { createRootTree, getId, ROOT_ID } from "./lib";

export const mockTree: Tree = {
  ...createRootTree(),
  children: [
    {
      id: getId("id-node-app:001"),
      children: [
        {
          id: getId("id-node-app:001-001"),
          children: [],
          depth: 2,
          parent: getId("id-node-app:001")
        }
      ],
      depth: 1,
      parent: ROOT_ID,
    },
    {
      id: getId("id-node-features:001"),
      children: [
        {
          id: getId("id-node-features:001-001"),
          children: [],
          depth: 2,
          parent: getId("id-node-features:001"),
        },
        {
          id: getId("id-node-features:001-002"),
          children: [
            {
              id: getId("id-node-features:001-002-001"),
              children: [],
              depth: 3,
              parent: getId("id-node-features:001-002"),
            }
          ],
          depth: 2,
          parent: getId("id-node-features:001"),
        }
      ],
      depth: 1,
      parent: ROOT_ID,
    },
    {
      id: getId("id-node-entities:001"),
      children: [],
      depth: 1,
      parent: ROOT_ID,
    },
  ]
}


export const mockNodesMetaData: ItemKV = {
  [getId("id-node-app:001")]: {
    title: "app",
    text: "App layer"
  },
  [getId("id-node-app:001-001")]: {
    title: "ui",
  },
  [getId("id-node-features:001")]: {
    title: "features",
    text: "Features layer"
  },
  [getId("id-node-features:001-001")]: {
    title: "cart",
    text: "Cart"
  },
  [getId("id-node-features:001-002")]: {
    title: "order",
    text: "Order"
  },
  [getId("id-node-features:001-002-001")]: {
    title: "model",
  },
  [getId("id-node-entities:001")]: {
    title: "entities",
    text: "Entities layer",
  },
}