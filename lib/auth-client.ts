import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const { useSession, signOut } = authClient;

export class AuthError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export const signInWithGoogle = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("popup")) {
        throw new AuthError(
          "Popup was blocked. Please allow popups for this site.",
          "POPUP_BLOCKED",
          error,
        );
      }

      if (
        error.message.includes("network") ||
        error.message.includes("fetch")
      ) {
        throw new AuthError(
          "Network error. Please check your connection and try again.",
          "NETWORK_ERROR",
          error,
        );
      }

      if (error.message.includes("timeout")) {
        throw new AuthError(
          "Sign-in timed out. Please try again.",
          "TIMEOUT",
          error,
        );
      }

      if (
        error.message.includes("denied") ||
        error.message.includes("cancelled")
      ) {
        throw new AuthError(
          "Sign-in was cancelled. Please try again if this was unintentional.",
          "USER_CANCELLED",
          error,
        );
      }
    }

    throw new AuthError(
      "Failed to sign in with Google. Please try again.",
      "UNKNOWN_ERROR",
      error,
    );
  }
};
