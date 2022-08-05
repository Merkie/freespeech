// SolidJS
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { createLocalStorage } from "@solid-primitives/storage";
import { Icon } from "solid-heroicons";
import { chatAlt_2, arrowRight, menu, externalLink } from "solid-heroicons/solid";

// CSS
import "~/styles/globals.css";
import "~/styles/index.css";

// Components
import SiteHeader from "~/components/SiteHeader";

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
      if (!userResource.loading) {
        console.log("User id: " + userResource().id);
        setUserObject(userResource());
      }
    } catch (e) {}
  });

  return (
    <main>
      <SiteHeader />
      <div class="hero-container">
        <img class="hero-bg-image" src="/index-background.png" alt="" />
        <div class="left-hero-bg"></div>
        <div class="right-hero-bg"></div>
        <div class="corner-piece">
          <div class="inner-piece"></div>
        </div>

        <div class="hero-content">
          <div class="hero-new">
            <span>NEW</span> Apply for the FreeSpeech beta{" "}
            <Icon path={arrowRight} />
          </div>
          <div class="hero-text">
            <p>
              AAC is just <br class="hero-text-break" />{" "}
              <span>a tap away.</span>
            </p>
            <p class="hero-desc">
              Forget the cost- we've got you covered.
            </p>
            <img class="blob-img" src="/blob.svg" />
            <img
              class="bubbly-img"
              src="/handy-line-running-silver-speechbubble.svg"
            />
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="info-section">
          <h1>We do things differently.</h1>
          <p>
            Our developers are committed to not only providing a free
            alternative and augmentative communication application, but a
            cutting-edge one as well. Now, "cutting-edge" doesn't always imply a
            greater difficulty to use or a steeper learning curve, we've
            actually found that our more advanced software provides an easier
            user experience for our end users. <a href="">Learn more <Icon path={externalLink} /></a></p>
            <h1 style="text-align: right;">We do things differently.</h1>
            <p style="text-align: right; float: right;">
            Our developers are committed to not only providing a free
            alternative and augmentative communication application, but a
            cutting-edge one as well. Now, "cutting-edge" doesn't always imply a
            greater difficulty to use or a steeper learning curve, we've
            actually found that our more advanced software provides an easier
            user experience for our end users. <a href="">Learn more <Icon path={externalLink} /></a></p>
          </div>
      </div>

      {/* <Show when={!userObject()}>
        <Link href="/login">login</Link>
        <Link href="/signup">signup</Link>
      </Show>
      <Show when={userObject()}>
        <p>{JSON.stringify(userObject())}</p>
        <button onClick={async () => {await logout(userObject().id); window.location.assign('/')}}>Logout</button>
      </Show> */}
    </main>
  );
}
