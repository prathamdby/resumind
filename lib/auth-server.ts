import { cache } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getServerSession = cache(async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return session;
  } catch {
    return null;
  }
});
