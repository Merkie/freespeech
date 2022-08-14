import { Component, createResource, For } from "solid-js";
import { css } from "solid-styled";
import { Tile, ITileProps } from "../components/Tile";
import { AppLayout } from "../layouts/AppLayout";
import { fetchDefaultLayout } from "../lib/fetchDefaultLayout";

const Home: Component = () => {
  const [layoutResource] = createResource(fetchDefaultLayout);

  css`
    main {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
      gap: 10px;
      width: min(calc(100% - 20px), 1400px);
      margin-left: auto;
      margin-right: auto;
    }
  `

  return (
    <AppLayout>
      {/* When the resource loads, run a for loop to render out the list of tiles in the home page */}
      {!layoutResource.loading && (
        <main>
          <For each={layoutResource().pages.home}>
            {(tile: ITileProps, index) => {
              return <Tile {...tile} />;
            }}
          </For>
        </main>
      )}
    </AppLayout>
  );
};

export default Home;
