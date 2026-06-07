import { ORPCError, os } from "@orpc/server";
import { eq } from "drizzle-orm";
import { adminMenuSettings } from "@momkiddis/db/schema";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

// ─── Admin procedures ──────────────────────────────────────────────

const requireAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const role = (context.session.user as { role?: string }).role;
  if (role !== "admin" && role !== "superadmin") {
    throw new ORPCError("FORBIDDEN", { message: "Hanya admin yang bisa mengakses" });
  }
  const isActive = (context.session.user as { isActive?: boolean }).isActive;
  if (isActive === false) {
    throw new ORPCError("FORBIDDEN", { message: "Akun tidak aktif" });
  }
  return next({
    context: {
      ...context,
      session: context.session,
      role: role as "admin" | "superadmin",
      isSuperAdmin: role === "superadmin",
    },
  });
});

export const adminProcedure = publicProcedure.use(requireAdmin);

const requireSuperAdmin = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const role = (context.session.user as { role?: string }).role;
  if (role !== "superadmin") {
    throw new ORPCError("FORBIDDEN", { message: "Hanya superadmin yang bisa mengakses" });
  }
  return next({
    context: {
      ...context,
      session: context.session,
      role: "superadmin" as const,
      isSuperAdmin: true,
    },
  });
});

export const superAdminProcedure = publicProcedure.use(requireSuperAdmin);

export function createMenuGuard(menuKey: string) {
  return adminProcedure.use(async ({ context, next }) => {
    const ctx = context as typeof context & { isSuperAdmin: boolean };
    if (ctx.isSuperAdmin) return next({ context });

    const setting = await context.db
      .select()
      .from(adminMenuSettings)
      .where(eq(adminMenuSettings.menuKey, menuKey))
      .get();

    if (!setting || !setting.isEnabled) {
      throw new ORPCError("FORBIDDEN", {
        message: `Menu "${menuKey}" tidak diaktifkan`,
      });
    }
    return next({ context });
  });
}
