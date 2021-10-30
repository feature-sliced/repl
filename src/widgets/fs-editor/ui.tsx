import React from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { Button } from "@geist-ui/react";
import { StructTree } from "shared/lib/react-effector-struct-tree";
import { fsTree, addNewItem } from "features/fs-edit";
import { useEvent } from "effector-react";

const Layout = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const fsGradient = css`
  background: linear-gradient(
    95deg,
    rgba(218, 231, 145, 1) 0%,
    rgba(135, 182, 167, 1) 57%,
    rgba(83, 149, 182, 1) 100%
  ) !important;
`;

export const FsTree: React.FC = () => {
  return (
    <Layout>
      <Button shadow type="success" onClick={useEvent(addNewItem)}>
        Add new item
      </Button>
      <StructTree tree={fsTree} />
    </Layout>
  );
};
