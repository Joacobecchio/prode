"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCrestSymbol } from "@/lib/auth/session";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { loginSchema, profileSchema, registerSchema } from "@/lib/validations";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

type ReminderChannel = "email" | "sms";

const initialError: AuthActionState = {
  status: "error",
  message: "Falta conectar Supabase para usar cuentas reales.",
};

export async function signInAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    contactMethod: formData.get("contactMethod"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: getFirstFieldError(fieldErrors) ?? "Revisa los datos ingresados.",
      fieldErrors,
    };
  }

  const supabase = await getActionClient();

  if (!supabase) {
    return initialError;
  }

  const { contactMethod, email, password, phone } = parsed.data;
  const { error } =
    contactMethod === "email"
      ? await supabase.auth.signInWithPassword({
          email: email ?? "",
          password,
        })
      : await supabase.auth.signInWithPassword({
          phone: phone ?? "",
          password,
        });

  if (error) {
    return {
      status: "error",
      message: "No pudimos iniciar sesion con esos datos.",
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUpAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    contactMethod: formData.get("contactMethod"),
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: getFirstFieldError(fieldErrors) ?? "Revisa los datos ingresados.",
      fieldErrors,
    };
  }

  const supabase = await getActionClient();

  if (!supabase) {
    return initialError;
  }

  const { contactMethod, fullName, nickname, password } = parsed.data;
  const reminderChannel: ReminderChannel = contactMethod;
  const email = contactMethod === "email" ? parsed.data.email?.trim() ?? null : null;
  const cleanPhone =
    contactMethod === "sms" ? parsed.data.phone?.trim() ?? null : null;
  const userMetadata = {
    full_name: fullName,
    nickname,
    email,
    phone: cleanPhone,
    reminder_channel: reminderChannel,
  };
  const { data, error } =
    contactMethod === "email"
      ? await supabase.auth.signUp({
          email: email ?? "",
          password,
          options: {
            emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/perfil`,
            data: userMetadata,
          },
        })
      : await supabase.auth.signUp({
          phone: cleanPhone ?? "",
          password,
          options: {
            data: userMetadata,
          },
        });

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  if (data.user && data.session) {
    await upsertProfile({
      userId: data.user.id,
      email,
      fullName,
      nickname,
      phone: cleanPhone,
      reminderChannel,
    });

    revalidatePath("/", "layout");
    redirect("/");
  }

  return {
    status: "success",
    message:
      contactMethod === "email"
        ? "Cuenta creada. Revisa tu email para confirmar el acceso."
        : "Cuenta creada. Si Supabase pide SMS, revisa tu celular para confirmar el acceso.",
  };
}

export async function updateProfileAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    nickname: formData.get("nickname"),
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    return {
      status: "error",
      message: getFirstFieldError(fieldErrors) ?? "Revisa los datos del perfil.",
      fieldErrors,
    };
  }

  const supabase = await getActionClient();

  if (!supabase) {
    return initialError;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/perfil");
  }

  const { fullName, nickname } = parsed.data;
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("email,phone,reminder_channel")
    .eq("id", user.id)
    .maybeSingle<{
      email: string | null;
      phone: string | null;
      reminder_channel: ReminderChannel;
    }>();
  const email = existingProfile?.email ?? user.email ?? null;
  const phone =
    existingProfile?.phone ??
    getUserPhone(user) ??
    getUserMetadataValue(user, "phone");
  const reminderChannel =
    existingProfile?.reminder_channel ?? (phone && !email ? "sms" : "email");
  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email,
      full_name: fullName,
      nickname,
      phone,
      reminder_channel: reminderChannel,
      crest_symbol: getCrestSymbol(nickname, fullName),
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      nickname,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/perfil");

  return {
    status: "success",
    message: "Perfil actualizado.",
  };
}

export async function signOutAction() {
  const supabase = await getActionClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

async function upsertProfile({
  userId,
  email,
  fullName,
  nickname,
  phone,
  reminderChannel,
}: {
  userId: string;
  email: string | null;
  fullName: string;
  nickname: string;
  phone: string | null;
  reminderChannel: ReminderChannel;
}) {
  const supabase = await getActionClient();

  if (!supabase) {
    return;
  }

  await supabase.from("profiles").upsert(
    {
      id: userId,
      email,
      full_name: fullName,
      nickname,
      phone,
      reminder_channel: reminderChannel,
      crest_symbol: getCrestSymbol(nickname, fullName),
    },
    {
      onConflict: "id",
    },
  );
}

async function getActionClient() {
  try {
    return await getSupabaseServerClient();
  } catch {
    return null;
  }
}

function getSiteUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL;

  if (siteUrl) {
    return siteUrl;
  }

  if (vercelUrl) {
    return vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

function getUserPhone(user: { phone?: string | null }) {
  return typeof user.phone === "string" && user.phone.trim()
    ? user.phone.trim()
    : null;
}

function getUserMetadataValue(
  user: { user_metadata?: Record<string, unknown> },
  key: string,
) {
  const value = user.user_metadata?.[key];

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getFirstFieldError(fieldErrors: Record<string, string[] | undefined>) {
  return Object.values(fieldErrors).flat().find(Boolean);
}
