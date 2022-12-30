import { it, expect } from "vitest";
import { createUser } from "./create";

it("creates a user", async () => {
  const result = await createUser({
    email: "squillyg@gmail.com",
    password: "password",
    name: "Squilly",
  });

  expect(result?.body.success).toBe(true);
});
