import { redirect } from "next/navigation";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { getAuthContext } from "@/lib/auth/session";

export const metadata = {
  title: "Login | Prode",
};

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const auth = await getAuthContext();

  if (auth.user) {
    redirect("/");
  }

  return (
    <AuthFormShell
      title="Entrar"
      footer={{
        text: "Todavia no tenes cuenta?",
        href: "/registro",
        label: "Crear cuenta",
      }}
    >
      <div className="grid gap-4">
        <LoginForm />
        {!auth.configured ? <SupabaseSetupNotice error={auth.error} /> : null}
      </div>
    </AuthFormShell>
  );
}
