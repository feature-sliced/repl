import { createStore, createEvent, sample, attach, guard } from "effector";
import { persist } from "effector-storage/local";
import type { Tree, ItemKV, ItemDetails, Id, ItemState, ItemDynamicState } from "./types";
import {
  getId,
  addSubTree,
  removeSubTree,
  moveSubTree,
  createRootTree,
  flatTreeToList, ROOT_ID, isOutOfBounds,
} from "./lib";
import type { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";

export const defaultItemState = {
  collapsed: false,
  editMode: false,
};

export const defaultDynamicItemState = {
  editTitle: "",
  editText: "",
};

export const createTreeState = (config: { limitX?: number; limitY?: number } = {}) => {
  const { limitX = -200, limitY = -30 } = config;
  // tree
  const $tree = createStore<Tree>(createRootTree());

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

  // items meta
  const $itemsKv = createStore<ItemKV>({});

  $itemsKv.on(addItemFx.doneData, (reg, { item, id }) => ({ ...reg, [id]: item }))
    .on(removeItemFx.done, (reg, { params: id }) => {
      const next = { ...reg };

      delete next[id];

      return next;
    });

  // save draft tree and meta to localStorage
  persist({
    store: $tree,
    key: "draft-tree"
  });

  persist({
    store: $itemsKv,
    key: "draft-tree-meta"
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
  const toggleEditMode = createEvent<Id>();

  const $itemsState = createStore<Record<Id, ItemState>>({});

  $itemsState.on(
    toggleCollapsed,
    (reg, id) => {
      const state = reg[id] ?? defaultItemState;

      return {
        ...reg,
        [id]: { ...state, collapsed: !state.collapsed },
      };
    }
  );

  $itemsState.on(
    toggleEditMode,
    (reg, id) => {
      const state = reg[id] ?? defaultItemState;

      return {
        ...reg,
        [id]: { ...state, editMode: !state.editMode },
      };
    }
  );

  // not saved states
  const editItemTitle = createEvent<{ id: Id, text: string }>();
  const editItemText = createEvent<{ id: Id, text: string }>();
  const saveEditData = createEvent<Id>();

  const $itemsDynamicState = createStore<Record<Id, ItemDynamicState>>({});

  sample({
    source: $itemsDynamicState,
    clock: sample({
      source: $itemsKv,
      clock: toggleEditMode,
      fn: (source, id) => ({ id: id, title: source[id].title, text: source[id].text }),
    }),
    fn: (source, clock) => ({ ...source, [clock.id]: { editTitle: clock.title, editText: clock.text } }),
    target: $itemsDynamicState
  });

  $itemsDynamicState.on(
    editItemTitle,
    (reg, payload) => {
      const state = reg[payload.id] ?? defaultDynamicItemState;

      return {
        ...reg,
        [payload.id]: { ...state, editTitle: payload.text },
      };
    }
  );

  $itemsDynamicState.on(
    editItemText,
    (reg, payload) => {
      const state = reg[payload.id] ?? defaultDynamicItemState;

      return {
        ...reg,
        [payload.id]: { ...state, editText: payload.text },
      };
    }
  );

  // prevent race condition
  const editDataSaved = createEvent();

  // save edit data to kv
  sample({
    source: $itemsKv,
    clock: sample({
      clock: saveEditData,
      source: $itemsDynamicState,
      fn: (state, id) => ({ id: id, data: state[id] }),
    }),
    fn: (reg, payload) => ({
      ...reg,
      [payload.id]: { ...reg[payload.id], text: payload.data.editText, title: payload.data.editTitle }
    }),
    target: [$itemsKv, editDataSaved]
  });

  // toggle edit mode on dataSaved
  sample({
    clock: editDataSaved,
    source: saveEditData,
    target: toggleEditMode,
  })

  // used for drag with children's
  const setCollapse = createEvent<[Id, boolean]>();
  $itemsState.on(setCollapse, (reg, [id, state]) => {
    return {
      ...reg,
      [id]: { collapsed: state },
    };
  });

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

  // collapse on dragging
  sample({
    source: $tree,
    clock: [dragStarted, dragEnded],
    fn: (tree, dragEvent) => {
      const isDrop = "over" in dragEvent;
      return [dragEvent.active.id, !isDrop] as [Id, boolean];
    },
    target: setCollapse
  });

  sample({
    clock: dragOver,
    fn: ({ active }) => active.id as Id,
    target: $dragTarget,
  });

  // when move to out of bounds => move to ROOT
  sample({
    clock: guard({
      clock: dragEnded,
      filter: (event) => !event.over || event.over.id === event.active.id && isOutOfBounds(event.delta, limitX, limitY)
    }),
    fn: (event) => ({
      id: event.active.id as Id,
      nextParentId: ROOT_ID,
      index: 0,
    }),
    target: moveItem,
  });

  // move current item to target when we over the target
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
  });

  return {
    $tree,
    $itemsKv,
    addItem,
    removeItem,
    moveItem,
    updateItem,
    $itemsState,
    toggleCollapsed,
    toggleEditMode,
    $flatList,
    dragStarted,
    dragEnded,
    $dragTarget,
    dragOver,
    $hoveredNodeId,
    // dynamic
    $itemsDynamicState,
    editItemText,
    editItemTitle,
    saveEditData
  };
};

export type ITreeState = ReturnType<typeof createTreeState>;
