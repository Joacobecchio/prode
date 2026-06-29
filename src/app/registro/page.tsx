import { redirect } from "next/navigation";
import { AuthFormShell } from "@/components/auth/auth-form-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { getAuthContext } from "@/lib/auth/session";

export const metadata = {
  title: "Registro | Prode",
};

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const auth = await getAuthContext();

  if (auth.user) {
    redirect("/perfil");
  }

  return (
    <AuthFormShell
      title="Crear cuenta"
      footer={{
        text: "Ya tenes cuenta?",
        href: "/login",
        label: "Entrar",
      }}
    >
      <div className="grid gap-4">
        <RegisterForm />
        {!auth.configured ? <SupabaseSetupNotice error={auth.error} /> : null}
      </div>
    </AuthFormShell>
  );
}
