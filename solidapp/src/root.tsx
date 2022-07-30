// @refresh reload
import { Links, Meta, Routes, Scripts } from "solid-start/root";
import { ErrorBoundary } from "solid-start/error-boundary";
import { createSignal, Suspense } from "solid-js";

import { createLocalStorage } from "@solid-primitives/storage";
import { ILocalStorage } from "./types/AppTypes";
import { IResponse } from "./types/ApiTypes";

// export const [store, setStore] = createLocalStorage({ prefix: 'freespeech' });
// export const [authenticatedUser, setAuthenticatedUser] = createSignal(null);

export default async function Root() {

  // // If there is a session refresh the authenticated user
  // if((store as ILocalStorage).session) {
  //   // Request the user from /me
  //   const response = await fetch("/api/user/me", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       token: (store as ILocalStorage).session,
  //     })
  //   });

  //   // Consume the json from the response
  //   const data: IResponse = await response.json();

  //   // If there is an error
  //   if(data.error) {
  //     alert(data.error);
  //     setStore('session', null);
  //     return;
  //   }

  //   // Set authenticated user to data
  //   setAuthenticatedUser(data.data);
  // } else {
  //   console.log("Session not found");
  // }

  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ErrorBoundary>
          <Suspense>
            <Routes />
          </Suspense>
        </ErrorBoundary>
        <Scripts />
      </body>
    </html>
  );
}
