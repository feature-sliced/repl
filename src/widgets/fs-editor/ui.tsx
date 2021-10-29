import React from "react";
import { styled } from "@linaria/react";
import { Button } from "@geist-ui/react";
import { StructTree } from "shared/lib/react-effector-struct-tree";
import { fsTree, addNewItem } from "features/fs-edit";
import { useEvent } from "effector-react";

const Layout = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

export const FsTree: React.FC = () => {
  return (
    <Layout>
      <Button shadow type="success-light" onClick={useEvent(addNewItem)}>
        Add new item
      </Button>
      <StructTree tree={fsTree} />
    </Layout>
  );
};
