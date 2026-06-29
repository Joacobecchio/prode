export type AppRole = "user" | "super_admin";

const bootstrapSuperAdminEmails = ["joaquin.becchio99@gmail.com"];

export function normalizeRole(role?: string | null): AppRole {
  return role === "super_admin" || role === "admin" ? "super_admin" : "user";
}

export function resolveAppRole({
  role,
  email,
}: {
  role?: string | null;
  email?: string | null;
}): AppRole {
  if (isBootstrapSuperAdminEmail(email)) {
    return "super_admin";
  }

  return normalizeRole(role);
}

export function isSuperAdminRole(role?: string | null) {
  return normalizeRole(role) === "super_admin";
}

export function isBootstrapSuperAdminEmail(email?: string | null) {
  return Boolean(
    email &&
      bootstrapSuperAdminEmails.includes(email.trim().toLowerCase()),
  );
}
