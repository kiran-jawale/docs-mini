export const DB_NAME = "docsmini";

// Cookie Options for JWT
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // True in production
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

// Roles
export const ROLES = {
  USER: "user",
  MOD: "mod",
  ADMIN: "admin",
};