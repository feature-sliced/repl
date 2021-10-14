import React from "react";
import { Route, Switch } from "react-router-dom";

import { Root } from "./root";

export const Pages: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Root} />
    </Switch>
  );
};
