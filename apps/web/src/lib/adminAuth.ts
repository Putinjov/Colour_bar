const KEY = "admin_token";

export function setAdminToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function getAdminToken() {
  return localStorage.getItem(KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(KEY);
}

export function isAdminAuthed() {
  return Boolean(getAdminToken());
}
