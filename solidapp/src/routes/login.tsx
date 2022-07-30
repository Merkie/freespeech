import { IResponse } from "~/types/ApiTypes";

export default function Login() {

    let email: HTMLInputElement;
    let password: HTMLInputElement;

    async function handleSubmit() {
        const response = await fetch("/api/user/validate", {
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            })
        });

        const data: IResponse = await response.json();
        
        if (data.error)
            alert(data.error);
        
        window.location.href = "/";
    }

    return (
        <main>
        <h1>Login</h1>
        <div>
            <label for="email">Email</label>
            <input ref={email} type="text" name="email" required />
            <label for="password">Password</label>
            <input ref={password} type="password" name="password" required />
            <button onClick={handleSubmit} >Submit</button>
        </div>
        </main>
    );
}