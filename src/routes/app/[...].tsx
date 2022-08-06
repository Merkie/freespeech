import { Icon } from "solid-heroicons";
import "~/styles/globals.css";

import {
  cog,
  pencil,
  arrowRight,
  arrowLeft,
  volumeUp,
  trash,
} from "solid-heroicons/solid";
// import { pencil } from "solid-heroicons/solid";

import "~/styles/app.css";

export default function App() {
  return (
    <div class="app">
      <div class="app-actions">
        <Icon path={cog} />
        <Icon path={pencil} />
        <div class="page-controls">
          <Icon path={arrowLeft} />
          <p>Home</p>
          <Icon path={arrowRight} />
        </div>
        <div class="spacer"></div>
        <Icon path={volumeUp} />
      </div>
      <div class="sentence-builder">
        <div class="sentence-tiles">
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
          <div class="tile"></div>
        </div>
        <Icon path={trash} />
      </div>
      <div class="tiles">
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
      </div>
    </div>
  );
}
