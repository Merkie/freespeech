import { createSignal, Show } from "solid-js";
import { Link } from "solid-app-router";
// import { authenticatedUser } from "~/root";
import "./styles/Header.css";

export default function Header() {
  // const [count, setCount] = createSignal(0);
  return (
    <div>
      <h1>Header</h1>
      <div style={{display: 'flex'}}>
        {/* <Show when={!authenticatedUser()}>
          <Link href="/login">Login</Link>
          <Link href="/signup">Signup</Link>
        </Show> */}
      </div>
    </div>
  );
}
