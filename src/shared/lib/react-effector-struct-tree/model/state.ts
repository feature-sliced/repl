import { createStore, createEvent, sample, attach } from "effector";
import type { Tree, ItemKV, ItemState, Id } from "./types";
import {
  getId,
  addSubTree,
  removeSubTree,
  moveSubTree,
  createRootTree,
  flatTree,
} from "./lib";

export const createTreeState = () => {
  // tree
  const $tree = createStore<Tree>(createRootTree());

  // effects on tree
  const addItemFx = attach({
    source: $tree,
    effect(tree, item: ItemState) {
      const id = getId();

      return {
        item,
        id,
        tree: addSubTree(tree, { id }),
      };
    },
  });
  const removeItemFx = attach({
    source: $tree,
    effect(tree, id: Id) {
      return removeSubTree(tree, id);
    },
  });
  const moveSubTreeFx = attach({
    source: $tree,
    effect(
      tree,
      move: {
        id: Id;
        nextParentId: Id;
        index: number;
      }
    ) {
      const { id, nextParentId, index } = move;

      return moveSubTree(tree, {
        subtreeId: id,
        nextParentId,
        index,
      });
    },
  });

  sample({
    clock: [
      moveSubTreeFx.doneData,
      removeItemFx.doneData,
      addItemFx.doneData.map(({ tree }) => tree),
    ],
    target: $tree,
  });

  // items meta
  const $itemsKv = createStore<ItemKV>({})
    .on(addItemFx.doneData, (reg, { item, id }) => ({ ...reg, [id]: item }))
    .on(removeItemFx.done, (reg, { params: id }) => {
      const next = { ...reg };

      delete next[id];

      return next;
    });

  // public part
  const addItem = createEvent<ItemState>();
  const removeItem = createEvent<Id>();
  const moveItem = createEvent<{
    id: Id;
    nextParentId: Id;
    index: number;
  }>();
  const updateItem = createEvent<{ upd: Partial<ItemState>; id: Id }>();

  $itemsKv.on(updateItem, (reg, { upd, id }) => ({
    ...reg,
    [id]: { ...reg[id], ...upd },
  }));

  sample({
    greedy: true,
    clock: addItem,
    target: addItemFx,
  });

  sample({
    greedy: true,
    clock: removeItem,
    target: removeItemFx,
  });

  sample({
    greedy: true,
    clock: moveItem,
    target: moveSubTreeFx,
  });

  const $flatTree = sample({
    source: $tree,
    fn: (tree) => flatTree(tree),
  });

  return {
    $tree,
    $flatTree,
    $itemsKv,
    addItem,
    removeItem,
    moveItem,
    updateItem,
  };
};

export type ITreeState = ReturnType<typeof createTreeState>;
