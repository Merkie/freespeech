
// SolidJS
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { createLocalStorage } from "@solid-primitives/storage";

// CSS
import "~/styles/globals.css";

// Components
import Header from "~/components/Header";

// API
import { me } from "~/lib/user/me";
import { logout } from "~/lib/user/logout";

import { localStore } from "~/root";
import { Link } from "solid-app-router";


export default function Home() {

  const [sessionToken, setSessionToken] = createSignal(null); // Session Token
  const [userResource] = createResource(sessionToken, me); // The user resource

  const [userObject, setUserObject] = createSignal(null); // User object

  // Check if theres an active session
  if (localStore.session) {
    setSessionToken(localStore.session);
  }

  createEffect(() => {
    try {
      if(!userResource.loading) {
        console.log('User id: '+userResource().id);
        setUserObject(userResource());
      };
    } catch(e) {
      ;
    }
  });

  return (
    <main>
      <Header />
      <Show when={!userObject()}>
        <Link href="/login">login</Link>
        <Link href="/signup">signup</Link>
      </Show>
      <Show when={userObject()}>
        <p>{JSON.stringify(userObject())}</p>
        <button onClick={async () => {await logout(userObject().id); window.location.assign('/')}}>Logout</button>
      </Show>
    </main>
  );
}
