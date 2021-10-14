import React from "react";
import { Route, Switch } from "react-router-dom";

import { Root } from "./root";

export const paths = {
  root: () => "/",
};

export const Pages: React.FC = () => {
  return (
    <Switch>
      <Route path={paths.root()} component={Root} />
    </Switch>
  );
};
