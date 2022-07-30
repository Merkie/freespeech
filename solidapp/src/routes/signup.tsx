export default function Login() {
    return (
        <main>
        <form>
            <label for="name">Your name</label>
            <input type="text" name="name" required />
            <label for="email">Email</label>
            <input type="text" name="email" required />
            <label for="password">Password</label>
            <input type="password" name="password" required />
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" required />
            <button type="submit">Submit</button>
        </form>
        </main>
    );
}