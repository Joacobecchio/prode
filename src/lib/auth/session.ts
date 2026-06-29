import type { User } from "@supabase/supabase-js";
import { resolveAppRole, type AppRole } from "@/lib/auth/roles";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type UserProfile = {
  id: string;
  full_name: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  reminder_channel: "email" | "sms";
  crest_primary: string;
  crest_secondary: string;
  crest_symbol: string;
  stars_won: number;
  role: AppRole;
};

export type AuthContext = {
  configured: boolean;
  user: User | null;
  profile: UserProfile | null;
  error?: string;
};

const profileColumns = [
  "id",
  "full_name",
  "nickname",
  "email",
  "phone",
  "reminder_channel",
  "crest_primary",
  "crest_secondary",
  "crest_symbol",
  "stars_won",
  "role",
].join(",");

export async function getAuthContext(): Promise<AuthContext> {
  let supabase: Awaited<ReturnType<typeof getSupabaseServerClient>>;

  try {
    supabase = await getSupabaseServerClient();
  } catch (error) {
    return {
      configured: false,
      user: null,
      profile: null,
      error: getAuthErrorMessage(error),
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      configured: true,
      user: null,
      profile: null,
      error: userError?.message,
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .maybeSingle<Omit<UserProfile, "role"> & { role: string | null }>();
  const normalizedProfile = profile
    ? {
        ...profile,
        role: resolveAppRole({
          role: profile.role,
          email: profile.email ?? user.email,
        }),
      }
    : null;

  return {
    configured: true,
    user,
    profile: normalizedProfile ?? getFallbackProfile(user),
    error: profileError?.message,
  };
}

export function getFallbackProfile(user: User): UserProfile {
  const fullName =
    getMetadataValue(user, "full_name") ??
    getMetadataValue(user, "name") ??
    "Participante";
  const nickname =
    getMetadataValue(user, "nickname") ??
    user.email?.split("@")[0] ??
    getUserPhone(user) ??
    "jugador";
  const phone = getMetadataValue(user, "phone") ?? getUserPhone(user);
  const reminderChannel = phone && !user.email ? "sms" : "email";

  return {
    id: user.id,
    full_name: fullName,
    nickname,
    email: user.email ?? null,
    phone,
    reminder_channel: reminderChannel,
    crest_primary: "#7ad45e",
    crest_secondary: "#10251b",
    crest_symbol: getCrestSymbol(nickname, fullName),
    stars_won: 0,
    role: resolveAppRole({ email: user.email }),
  };
}

export function getCrestSymbol(nickname: string, fullName: string) {
  const source = nickname.trim() || fullName.trim() || "PE";
  const words = source.split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return words
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function getMetadataValue(user: User, key: string) {
  const value = user.user_metadata?.[key];

  return typeof value === "string" && value.trim() ? value : null;
}

function getUserPhone(user: User) {
  return typeof user.phone === "string" && user.phone.trim()
    ? user.phone.trim()
    : null;
}

function getAuthErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo leer la sesion de Supabase.";
}
