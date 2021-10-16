import React from "react";
import { Card, Button } from "@geist-ui/react";
import { reflect } from "@effector/reflect";
import { $count, up } from "features/count-clicks";
import { css } from "@linaria/core";

const buttonClass = css`
  color: red;
  background-color: blue;
`;

const Counter = reflect({
  view: Button,
  bind: {
    onClick: up.prepend((e) => {
      e.target;
    }),
    children: $count,
    className: buttonClass,
  },
});

export const Root: React.FC = () => {
  return (
    <Card>
      <h1>Hi there!</h1>
      <p>This is Feature-Sliced REPL prototype, nothing to see here yet</p>
      <Counter color="red" />
    </Card>
  );
};
