import { redirect } from "next/navigation";
import { resolveAppRole } from "@/lib/auth/roles";
import { getAuthContext } from "@/lib/auth/session";

export async function requireAuth(next = "/") {
  const auth = await getAuthContext();

  if (!auth.user) {
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  return auth;
}

export async function requireSuperAdmin(next = "/admin") {
  const auth = await requireAuth(next);
  const role = resolveAppRole({
    role: auth.profile?.role,
    email: auth.profile?.email ?? auth.user?.email,
  });

  if (role !== "super_admin") {
    redirect("/");
  }

  return auth;
}
