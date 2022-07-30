import { createSignal, Show } from "solid-js";

import Header from "~/components/Header";
import "./styles/index.css";

// import { authenticatedUser } from "~/root";

export default async function Home() {

  return (
    <main>
      <Header />
      {/* <Show when={authenticatedUser}>
        <p>{authenticatedUser.name}</p>
      </Show> */}
    </main>
  );
}
