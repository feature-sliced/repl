import React from "react";
import { hydrate } from "react-dom";
import { Router } from "react-router-dom";
import { fork, allSettled } from "effector";
import { attachHistory } from "pages";
import { createBrowserHistory } from "history";
import { Provider } from "effector-react/scope";
import { SCOPE_DATA_KEY } from "shared/config/constants";
import { appStarted } from "shared/config/system-events";

import App from "./app/App";

declare global {
  interface Window {
    [SCOPE_DATA_KEY]: Record<string, any>;
  }
}

const values = window[SCOPE_DATA_KEY];
const scope = fork({ values });
const history = createBrowserHistory();
allSettled(attachHistory, { scope, params: history });
allSettled(appStarted, { scope });

hydrate(
  <Provider value={scope}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
