import { createAuthClient } from "better-auth/react";
import type { InferSessionFromClient } from "better-auth/react";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
});

export type AdminSession = InferSessionFromClient<typeof authClient> & {
  user: {
    role?: string;
    isActive?: boolean;
  };
};
