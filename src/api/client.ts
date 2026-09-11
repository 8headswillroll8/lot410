export const API_BASE_URL = "https://v2.api.noroff.dev";

export async function apiRequest(
  endpoint: string,
  options: RequestInit,
  auth = false,
) {
  if (auth) {
    const token = localStorage.getItem("accessToken");
    const key = import.meta.env.VITE_API_KEY;

    const headers = new Headers(options.headers);

    headers.set("Authorization", `Bearer ${token}`);
    headers.set("X-Noroff-API-Key", key);

    options.headers = headers;
  }

  const url = API_BASE_URL + endpoint;

  const response = await fetch(url, options);

  if (response.status === 204) {
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return data;
}
