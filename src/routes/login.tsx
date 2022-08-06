import { setLocalStore } from "~/root";
import "~/styles/globals.css";

import { ILoginUserRequest, ILoginUserResponse } from "~/types/ApiTypes";

import { me } from "~/lib/user/me";
import { login  } from "~/lib/user/login"

export default function Login() {
  
  let emailInputRef: HTMLInputElement;
  let passwordInputRef: HTMLInputElement;

  async function handleLogin() {

    const request: ILoginUserRequest = {
      email: emailInputRef.value,
      password: passwordInputRef.value
    };

    const response: ILoginUserResponse = await login(request);

    if(response.error) {
      alert(response.error);
      return;
    }

    setLocalStore('session', response.token);

    const user = await me(response.token);
    setLocalStore('usercache', JSON.stringify(user));

    window.location.assign('/');
  }

  return (
    <main>
      <input ref={emailInputRef} type="text" placeholder="email" />
      <input ref={passwordInputRef} type="text" placeholder="password" />
      <button onClick={handleLogin}>Login</button>
    </main>
  );
}
