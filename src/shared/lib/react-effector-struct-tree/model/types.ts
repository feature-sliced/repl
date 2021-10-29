export type Id = string & { __brand__: "id" };

export type Tree = {
  id: Id;
  children: Tree[];
  depth: number;
  parent: Id | null;
};

export type ItemState = {
  title: string;
  text?: string;
};

export type ItemKV = Record<Id, ItemState>;

export type FlatTree = { id: Id; depth: number }[];
