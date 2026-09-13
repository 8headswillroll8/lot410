export const API_BASE_URL = "https://v2.api.noroff.dev";

/**
 * Sends a request to the Noroff API.
 *
 * Adds the access token and API key when authentication is required.
 * Returns parsed JSON data, or nothing for 204 responses.
 *
 * @param endpoint - API endpoint appended to the base URL.
 * @param options - Fetch configuration such as method, headers, and body.
 * @param auth - Whether authentication headers should be added.
 * @returns The parsed response data, or undefined for a 204 response.
 * @throws Error when the API response is not successful.
 */

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
    throw new Error("API request failed");
  }

  return data;
}
