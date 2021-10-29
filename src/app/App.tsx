import React from "react";
import { GeistProvider, CssBaseline } from "@geist-ui/react";
import { Pages } from "pages";
import { appMounted } from "shared/config/system-events";
import { reflect } from "@effector/reflect";
import { Layout, Content, Header, Footer } from "widgets/templates/page-grid";

import "./App.css";

const App = reflect({
  view: () => {
    return (
      <GeistProvider>
        <CssBaseline />
        <Layout>
          <Header>This is header</Header>
          <Content>
            <Pages />
          </Content>
          <Footer>this is footer</Footer>
        </Layout>
      </GeistProvider>
    );
  },
  bind: {},
  hooks: { mounted: appMounted },
});

export default App;
