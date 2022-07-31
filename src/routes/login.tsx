import { setLocalStore } from "~/root";
import "~/styles/globals.css";
import { IValidateUserRequest, IValidateUserResponse } from "~/types/ApiTypes";

import { validate } from "~/lib/user/login";
import { me } from "~/lib/user/me";

export default function Login() {
  
  let emailInputRef: HTMLInputElement;
  let passwordInputRef: HTMLInputElement;

  async function handleLogin() {

    const request: IValidateUserRequest = {
      email: emailInputRef.value,
      password: passwordInputRef.value
    };

    const response = await validate(request);

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
