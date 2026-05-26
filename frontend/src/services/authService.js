import http from "./httpService";
import { jwtDecode } from "jwt-decode";
const apiLogin = "/users/login";
const tokenKey = "token";
const roleKey = "orgName";
const username = "username";

export async function login(data) {
  const res = await http.post(apiLogin, data);
  console.log(res.data);

  if (res.data.success) {
    localStorage.setItem(tokenKey, res.data.message.token);
    localStorage.setItem(roleKey, data.orgName);
    localStorage.setItem(username, data.username);
  }

  return res;
}

export async function logout() {
  // await httpService.get(apiLogout);
  console.log("logout called");
  localStorage.clear();
  return true;
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    if (!jwt) return null;
    return jwtDecode(jwt);
  } catch (ex) {
    return null;
  }
}

export function isLoggedIn() {
  const user = getCurrentUser();
  if (!user) return false;
  if (user.exp && user.exp * 1000 < Date.now()) {
    localStorage.clear();
    return false;
  }
  return true;
}

/** UI role: manufacturer | consumer (from JWT, then localStorage). */
export function getAppRole() {
  const user = getCurrentUser();
  if (user?.role === "manufacturer" || user?.role === "consumer") {
    return user.role;
  }
  const stored = getRole();
  if (stored === "manufacturer" || stored === "org1") return "manufacturer";
  if (
    stored === "consumer" ||
    stored === "org2" ||
    stored === "distributor"
  ) {
    return "consumer";
  }
  return stored;
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export function getRole() {
  return localStorage.getItem(roleKey);
}

export function getUserName() {
  return localStorage.getItem(username);
}

const authService = {
  login,
  logout,
  getCurrentUser,
  isLoggedIn,
  getAppRole,
  getRole,
  getJwt,
  getUserName,
};

export default authService;
