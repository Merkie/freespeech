import { setLocalStore } from "~/root";
import "~/styles/globals.css";
import { ICreateUserRequest, ICreateUserResponse } from "~/types/ApiTypes";

import { create } from "~/lib/user/create";

export default function Signup() {
  
  let nameInputRef: HTMLInputElement;
  let emailInputRef: HTMLInputElement;
  let passwordInputRef: HTMLInputElement;
  let confirmPasswordInputRef: HTMLInputElement;

  async function handleSignup() {
    // Build the request
    const request: ICreateUserRequest = {
      name: nameInputRef.value,
      email: emailInputRef.value,
      password: passwordInputRef.value,
      confirmPassword: confirmPasswordInputRef.value
    };

    const response = await create(request);

    // If error, return
    if(response.error) {
      alert(response.error);
      return;
    }

    // If no error, set the user
    setLocalStore('session', response.token);
    window.location.assign('/');
  };

  
  return (
    <main>
      <input ref={nameInputRef} type="text" placeholder="Name" />
      <input ref={emailInputRef} type="text" placeholder="Email" />
      <input ref={passwordInputRef} type="text" placeholder="Password" />
      <input ref={confirmPasswordInputRef} type="text" placeholder="Confirm Password" />
      <button onClick={handleSignup}>Signup</button>
    </main>
  );
}
