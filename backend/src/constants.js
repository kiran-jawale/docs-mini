export const DB_NAME = process.env.DB_NAME;

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};

export const ROLES = {
  USER: "user",
  MOD: "mod",
  ADMIN: "admin",
  HR: "hr"
};