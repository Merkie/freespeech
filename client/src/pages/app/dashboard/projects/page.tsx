import { user } from "@/state";

export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        Welcome to the dashboard! Here you can manage your projects and
        settings.
      </p>
      <p>Use the navigation menu to explore different sections.</p>
      <pre>{JSON.stringify({ user: user() }, null, 2)}</pre>
    </div>
  );
}
