import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouterContext } from "react-router";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { Provider } from "effector-react/scope";
import { fork, serialize, allSettled } from "effector";
import { attachHistory, clocks } from "pages";
import { SCOPE_DATA_KEY } from "shared/config/constants";

import App from "./app/App";

let assets: any;

const syncLoadAssets = () => {
  assets = require(process.env.RAZZLE_ASSETS_MANIFEST!);
};
syncLoadAssets();

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map((asset) => `<link rel="stylesheet" href="${asset}">`)
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (assets, entrypoint, extra = "") => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map((asset) => `<script src="${asset}"${extra}></script>`)
          .join("")
      : ""
    : "";
};

export const renderApp = async (
  req: express.Request,
  res: express.Response
) => {
  const context: StaticRouterContext = {};

  const scope = fork();
  const history = createMemoryHistory();

  await allSettled(attachHistory, { scope, params: history });
  await allSettled(clocks.push, {
    scope,
    params: {
      to: req.url,
    },
  });

  const markup = renderToString(
    <Provider value={scope}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  );

  if (context.url) {
    return { redirect: context.url };
  } else {
    const html =
      // prettier-ignore
      `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet='utf-8' />
        <title>Feature-sliced REPL</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${cssLinksFromAssets(assets, 'client')}
    </head>
    <body>
        <div id="root">${markup}</div>
        ${jsScriptTagsFromAssets(assets, 'client', ' defer crossorigin')}
        <script>
         window.${SCOPE_DATA_KEY} = ${JSON.stringify(serialize(scope))}
        </script>
    </body>
  </html>`;

    return { html };
  }
};

const server = express()
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR!))
  .get("/*", async (req: express.Request, res: express.Response) => {
    const { html = "", redirect = false } = await renderApp(req, res);
    if (redirect) {
      res.redirect(redirect);
    } else {
      res.send(html);
    }
  });

export default server;
