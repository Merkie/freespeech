/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import { StyleRegistry } from "solid-styled";

import App from "./App";

render(
  () => (
    <Router>
      <StyleRegistry>
        <App />
      </StyleRegistry>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
