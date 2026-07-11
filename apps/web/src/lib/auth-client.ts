import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  fetchOptions: {
    credentials: "include",
  },
});

export type AdminSession = Awaited<ReturnType<typeof authClient.getSession>>["data"] & {
  user: {
    role?: string;
    isActive?: boolean;
  };
};
