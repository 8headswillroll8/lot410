const baseURL = import.meta.env.BASE_URL;

/**
 * Logs out the user by removing the access token
 * and redirecting to the home page.
 */
export function logout() {
  localStorage.removeItem("accessToken");

  window.location.href = baseURL;
}
