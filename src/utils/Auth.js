import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserRoles = () => {
  const token = getToken();
  if (!token) return [];

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded); // Add this for debugging
    const rawRoles = decoded.roles || decoded.authorities || [];
    return rawRoles.map((role) =>
      typeof role === "string" ? role : role.authority
    );
  } catch (error) {
    console.error("Failed to decode token", error);
    return [];
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("token");
};
