export const API_BASE_URL = "https://v2.api.noroff.dev";

export async function apiRequest(endpoint: string, options: RequestInit) {
  const url = API_BASE_URL + endpoint;

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return data;
}

// JS object → JSON text
// JSON.stringify()

// JSON response → JS data
// response.json()

// Register → Login → Store authentication → Authenticated requests → Logout
