import { createAuthClient } from "better-auth/react";

const AUTH_BASE_URL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL: AUTH_BASE_URL,
});

export const { useSession } = authClient;

export const signIn = () => {
  if (typeof window === "undefined") return;
  window.location.href = `${AUTH_BASE_URL}/login`;
};

export const signOut = async () => {
  if (typeof window === "undefined") return;

  try {
    await fetch(`${AUTH_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Failed to sign out:", error);
  } finally {
    window.location.href = "/auth";
  }
};
