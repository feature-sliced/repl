import React from "react";
import { styled } from "@linaria/react";
import { Button } from "@geist-ui/react";
import { FsTree } from "widgets/fs-editor/ui";
import { useEvent } from "effector-react";
import { addNewItem } from "features/fs-edit";
import { fsTheme } from "shared/config/theme";

export const Root: React.FC = () => {
  return (
    <Layout>
      <Button auto shadow type="success" onClick={useEvent(addNewItem)}>
        Add new item
      </Button>
      <FsTree />
    </Layout>
  );
};

const Layout = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${fsTheme.layout.gapHalf};
`;
