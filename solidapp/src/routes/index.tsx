import { createSignal } from "solid-js";

import Header from "~/components/Header";
import "./styles/index.css";

export const [authenticatedUser, setAuthenticatedUser] = createSignal(null);

export default function Home() {

  return (
    <main>
      <Header />
    </main>
  );
}
