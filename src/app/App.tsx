import React from "react";
import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { Pages } from "pages";
import { appMounted } from "shared/config/system-events";
import { reflect } from "@effector/reflect";

import "./App.css";

const App = reflect({
  view: () => {
    return (
      <GeistProvider>
        <CssBaseline />
        <Pages />
      </GeistProvider>
    );
  },
  bind: {},
  hooks: { mounted: appMounted },
});

export default App;
