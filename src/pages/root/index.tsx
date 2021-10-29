import React from "react";
import { FsTree } from "widgets/fs-editor/ui";

export const Root: React.FC = () => {
  return (
    <>
      <h1>Hi there!</h1>
      <p>This is Feature-Sliced REPL prototype, nothing to see here yet</p>
      <FsTree />
    </>
  );
};
