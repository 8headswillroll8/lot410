const baseURL = import.meta.env.BASE_URL;

export function logout() {
  localStorage.removeItem("accessToken");

  window.location.href = baseURL;
}
