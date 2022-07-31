export async function logout(token: string) {
  // Send request
  const response = await fetch("/api/user/logout", {
    method: "POST",
    body: JSON.stringify({ token: token }),
  });
}