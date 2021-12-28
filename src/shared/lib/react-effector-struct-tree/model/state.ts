import { createStore, createEvent, sample, attach, guard } from "effector";
import type { Tree, ItemKV, ItemDetails, Id } from "./types";
import {
  getId,
  addSubTree,
  removeSubTree,
  moveSubTree,
  createRootTree,
  flatTreeToList, ROOT_ID, isOutOfBounds,
} from "./lib";
import type { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { mockNodesMetaData, mockTree } from "./mockData";
import { debug } from "patronum";

export const createTreeState = () => {
  // tree
  // FIXME: DEV ONLY
  let $tree;
  if (process.env.NODE_ENV === "production")
    $tree = createStore<Tree>(createRootTree());
  else
    $tree = createStore<Tree>(mockTree);

  // effects on tree
  const addItemFx = attach({
    source: $tree,
    effect(tree, item: ItemDetails) {
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

  // FIXME: DEV ONLY
  // items meta
  let $itemsKv;

  if (process.env.NODE_ENV === "production")
    $itemsKv = createStore<ItemKV>({});
  else
    $itemsKv = createStore<ItemKV>(mockNodesMetaData);

  $itemsKv.on(addItemFx.doneData, (reg, { item, id }) => ({ ...reg, [id]: item }))
    .on(removeItemFx.done, (reg, { params: id }) => {
      const next = { ...reg };

      delete next[id];

      return next;
    });

  // public part
  const addItem = createEvent<ItemDetails>();
  const removeItem = createEvent<Id>();
  const moveItem = createEvent<{
    id: Id;
    nextParentId: Id;
    index: number;
  }>();
  const updateItem = createEvent<{ upd: Partial<ItemDetails>; id: Id }>();

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

  // items states
  const toggleCollapsed = createEvent<Id>();
  const $itemsState = createStore<Record<Id, { collapsed: boolean }>>({}).on(
    toggleCollapsed,
    (reg, id) => {
      const state = reg[id] ?? { collapsed: false };

      return {
        ...reg,
        [id]: { collapsed: !state.collapsed },
      };
    }
  );

  // used for drag with children's
  const setCollapse = createEvent<[Id, boolean]>();
  $itemsState.on(setCollapse, (reg, [id, state]) => {
    return {
      ...reg,
      [id]: { collapsed: state },
    }
  })

  // needed for @dnd-kit/sortable
  const $flatList = sample({
    source: $tree,
    fn: flatTreeToList,
  });

  // current target
  const dragStarted = createEvent<DragStartEvent>();
  const dragEnded = createEvent<DragEndEvent>();
  const dragOver = createEvent<DragOverEvent>();
  const $dragTarget = createStore<Id | null>(null).reset(dragEnded);

  sample({
    clock: dragOver,
    fn: ({ active }) => active.id as Id,
    target: $dragTarget,
  });

  // out of bounds => move to ROOT
  sample({
    clock: guard({
      clock: dragEnded,
      filter: (event) => {
        if (!event.over ||
          event.over.id === event.active.id && isOutOfBounds(event.delta)) {
          console.log(event.delta)
          return true;
        }
        return false
      }
    }),
    fn: (event) => ({
      id: event.active.id as Id,
      nextParentId: ROOT_ID,
      index: 0,
    }),
    target: moveItem,
  })


  sample({
    clock: guard({
      clock: dragEnded,
      filter: event => !!event.over && event.over.id !== event.active.id
    }),
    fn: (event) => ({
      id: event.active.id as Id,
      nextParentId: event.over?.id as Id,
      index: 0,
    }),
    target: moveItem,
  });

  // Hover
  const $hoveredNodeId = createStore<Id | null>(null).reset(dragStarted).reset(dragEnded);

  sample({
    clock: dragOver,
    fn: (event) => {
      if (!event.over)
        return null;

      if (event.active.id === event.over.id)
        return null;

      return event.over.id as Id;
    },
    target: $hoveredNodeId
  })


  return {
    $tree,
    $itemsKv,
    addItem,
    removeItem,
    moveItem,
    updateItem,
    $itemsState,
    toggleCollapsed,
    $flatList,
    dragStarted,
    dragEnded,
    $dragTarget,
    dragOver,
    $hoveredNodeId,
  };
};

export type ITreeState = ReturnType<typeof createTreeState>;
