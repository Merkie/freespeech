export async function me(token: string) {
  // Send request
  const response = await fetch("/api/user/me", {
    method: "POST",
    body: JSON.stringify({ token: token }),
  });

  // Consume the JSON object
  const data = await response.json();

  // If error, return
  if (data.error) {
    console.log('There was an error with the session, resetting...', data.error, token);
    // setLocalStore("session", "");
    // setUser(null);
    return null;
  }

  return data.user;
}