import { setStore } from "~/root";
import { IResponse } from "~/types/ApiTypes";

export default function Signup() {
  let name: HTMLInputElement;
  let email: HTMLInputElement;
  let password: HTMLInputElement;
  let confirmPassword: HTMLInputElement;

  async function handleSubmit() {
    // Send the request to the server
    const response = await fetch("/api/user/create", {
      method: "POST",
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        confirmPassword: confirmPassword.value,
      })
    });

    // Consume the JSON response data
    const data: IResponse = await response.json();

    // Error handling
    if (data.error) {
      alert(data.error);
      return;
    }

    // Set session and redirect to the main page
    setStore('session', data.token);
    window.location.href = "/";
  }

  return (
    <main>
      <h1>Sign up</h1>
      <div>
        <label for="name">Your name</label>
        <input ref={name} type="text" name="name" required />
        <label for="email">Email</label>
        <input ref={email} type="text" name="email" required />
        <label for="password">Password</label>
        <input ref={password} type="password" name="password" required />
        <label for="confirmPassword">Confirm Password</label>
        <input ref={confirmPassword} type="password" name="confirmPassword" required />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </main>
  );
}
