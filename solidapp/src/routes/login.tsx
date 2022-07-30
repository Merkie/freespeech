export default function Login() {
    return (
        <main>
        <h1>Login</h1>
        <form>
            <label for="email">Email</label>
            <input type="text" name="email" required />
            <label for="password">Password</label>
            <input type="text" name="password" required />
            <button type="submit">Submit</button>
        </form>
        </main>
    );
}