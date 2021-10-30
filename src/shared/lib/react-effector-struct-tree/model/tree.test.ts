import {
  addSubTree,
  createRootTree,
  getId,
  moveSubTree,
  removeSubTree,
  flatTreeToList,
} from "./lib";

test("can build a tree and modify it and flat it", () => {
  let tree = createRootTree();
  tree = addSubTree(tree, { id: getId("bla1") });
  tree = addSubTree(tree, { id: getId("bla2") });
  tree = addSubTree(tree, { id: getId("bla3") });
  tree = addSubTree(tree, { id: getId("bla4") });
  tree = addSubTree(tree, { id: getId("bla5") });
  tree = addSubTree(tree, { id: getId("bla6") });
  tree = moveSubTree(tree, {
    subtreeId: getId("bla4"),
    nextParentId: getId("bla3"),
    index: 0,
  });
  tree = moveSubTree(tree, {
    subtreeId: getId("bla2"),
    nextParentId: getId("bla4"),
    index: 0,
  });
  tree = moveSubTree(tree, {
    subtreeId: getId("bla5"),
    nextParentId: getId("bla4"),
    index: 0,
  });
  tree = moveSubTree(tree, {
    subtreeId: getId("bla6"),
    nextParentId: getId("bla4"),
    index: 0,
  });
  tree = removeSubTree(tree, getId("bla1"));

  expect(tree).toMatchInlineSnapshot(`
    Object {
      "children": Array [
        Object {
          "children": Array [
            Object {
              "children": Array [
                Object {
                  "children": Array [],
                  "depth": 3,
                  "id": "bla6",
                  "parent": "bla4",
                },
                Object {
                  "children": Array [],
                  "depth": 3,
                  "id": "bla5",
                  "parent": "bla4",
                },
                Object {
                  "children": Array [],
                  "depth": 3,
                  "id": "bla2",
                  "parent": "bla4",
                },
              ],
              "depth": 2,
              "id": "bla4",
              "parent": "bla3",
            },
          ],
          "depth": 1,
          "id": "bla3",
          "parent": "root",
        },
      ],
      "depth": 0,
      "id": "root",
      "parent": null,
    }
  `);

  const sortedIds = flatTreeToList(tree);

  expect(sortedIds).toMatchInlineSnapshot(`
    Array [
      "bla3",
      "bla4",
      "bla6",
      "bla5",
      "bla2",
    ]
  `);
});
