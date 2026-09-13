import { apiRequest } from "../api/client";

/**
 * Authenticates a user with their email and password.
 *
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns The authenticated user data from the API.
 */
export async function login(email: string, password: string) {
  return apiRequest("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

/**
 * Registers a new user account.
 *
 * @param name - The user's profile name.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns The registered user data from the API.
 */
export async function register(name: string, email: string, password: string) {
  return apiRequest("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
}
