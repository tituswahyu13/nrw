import { SessionOptions } from "iron-session";
import { AuthUser } from "./types";

export interface SessionData {
  user?: AuthUser;
  isLoggedIn: boolean;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
};

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || "complex_password_at_least_32_characters_long",
  cookieName: "simpadu_meter_session",
  cookieOptions: {
    // True only if explicitly set or if served under HTTPS
    secure: process.env.COOKIE_SECURE === "true",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
