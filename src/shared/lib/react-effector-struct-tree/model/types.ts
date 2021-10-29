export type Id = string & { __brand__: "id" };

export type Tree = {
  id: Id;
  children: Tree[];
  depth: number;
  parent: Id | null;
};

export type ItemDetails = {
  title: string;
  text?: string;
};

export type ItemKV = Record<Id, ItemDetails>;

export type FlatTree = { id: Id; depth: number }[];
