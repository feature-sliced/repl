import { v4 as uuid } from "uuid";
import { klona } from "klona/json";
import type { Id, Tree } from "./types";
import { Coordinates } from "@dnd-kit/utilities";

export const ROOT_ID = "root" as Id;

export const getId = (customId?: string) => {
  if (customId) return customId as Id;

  const id = uuid();

  return id as Id;
};

export function createRootTree(): Tree {
  return {
    id: ROOT_ID,
    children: [],
    depth: 0,
    parent: null,
  };
}

function childrenToItems(tree: Tree) {
  return tree.children.map((subtree, i) => ({
    item: subtree,
    index: i,
    parent: tree,
  }));
}

function findItemById(
  tree: Tree,
  id: Id
):
  | { item: Tree; index: null; parent: null }
  | { item: Tree; index: number; parent: Tree } {
  if (tree.id === id) {
    return { item: tree, index: null, parent: null };
  }

  if (tree.children) {
    const queue = childrenToItems(tree);

    while (queue.length > 0) {
      const current = queue.shift();

      if (!current) break;

      if (current.item.id === id) {
        return current;
      }

      if (current.item.children.length) {
        queue.push(...childrenToItems(current.item));
      }
    }
  }

  throw Error(`${id} is not found in provided tree`);
}

function patchTree(t: Tree, cb: (t: Tree) => Tree) {
  const next = klona(t);

  return cb(next);
}

export function removeSubTree(tree: Tree, id: Id): Tree {
  return patchTree(tree, (t) => {
    const target = findItemById(t, id);

    if (target && target.parent) {
      const parent = target.parent;

      parent.children.splice(target.index, 1);

      return t;
    }

    // return old ref is nothing is changed
    return tree;
  });
}

export function addSubTree(tree: Tree, item: { id: Id }): Tree {
  const subtree = {
    id: item.id,
    children: [],
    depth: tree.depth + 1,
    parent: tree.id,
  };

  return patchTree(tree, (t) => {
    if (t.children) {
      t.children.unshift(subtree);
    } else {
      t.children = [subtree];
    }

    return t;
  });
}

function modNodeDepth(treeNode: Tree, fn: (_: number) => number): void {
  treeNode.children.forEach((childrenNode) => {
    childrenNode.depth = fn(childrenNode.depth);
    if (childrenNode.children.length)
      modNodeDepth(childrenNode, fn);
  })
}

export function moveSubTree(
  tree: Tree,
  move: {
    subtreeId: Id;
    nextParentId: Id;
    index: number;
  }
): Tree {
  return patchTree(tree, (t) => {
    const target = findItemById(t, move.subtreeId);
    const currentParent = target.parent;

    if (!currentParent) return tree;

    // move inside the same parent
    if (currentParent.id === move.nextParentId) {
      if (target.index === move.index) {
        // return old reference if nothing is changed
        return tree;
      }

      currentParent.children.splice(target.index, 1);
      currentParent.children.splice(move.index, 0, target.item);

      return t;
    }

    const nextParent = findItemById(t, move.nextParentId);

    currentParent.children.splice(target.index, 1);
    nextParent.item.children.splice(move.index, 0, target.item);
    const depthModifier = nextParent.item.depth + 1 - target.item.depth;
    target.item.depth = nextParent.item.depth + 1;

    if (target.item.children.length && nextParent.item.id !== ROOT_ID)
      modNodeDepth(target.item, (depth) => depth + depthModifier);
    else
      modNodeDepth(target.item, (depth) => depth - depthModifier);

    target.item.parent = nextParent.item.id;

    return t;
  });
}

export function flatTreeToList(tree: Tree) {
  const result: Id[] = [];
  const queue = tree.children.slice();

  while (queue.length > 0) {
    const t = queue.shift();

    if (!t) return result;

    result.push(t.id);
    queue.push(...t.children);
  }

  return result;
}

export function isOutOfBounds(delta: Coordinates, limitX = -200, limitY = -30) {
  return delta.x < limitX || delta.y < limitY;
}
