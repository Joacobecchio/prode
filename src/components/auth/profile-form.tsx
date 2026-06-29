"use client";

import { useActionState } from "react";
import { Mail, Save, Smartphone, Star } from "lucide-react";
import { AuthMessage, FieldError } from "@/components/auth/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfileAction, type AuthActionState } from "@/lib/auth/actions";
import type { UserProfile } from "@/lib/auth/session";

const initialState: AuthActionState = {
  status: "idle",
};

export function ProfileForm({ profile }: { profile: UserProfile }) {
  const [state, action, pending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const reminderLabel =
    profile.reminder_channel === "sms" ? "Celular" : "Email";
  const reminderValue =
    profile.reminder_channel === "sms"
      ? profile.phone ?? "Sin celular"
      : profile.email ?? "Sin email";

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="rounded-md border bg-card p-5">
        <div className="flex items-center gap-4">
          <div
            className="grid h-20 w-20 place-items-center rounded-md border text-2xl font-black"
            style={{
              background: `linear-gradient(135deg, ${profile.crest_primary}, ${profile.crest_secondary})`,
              color: "#fff",
            }}
            aria-label={`Escudo de ${profile.nickname}`}
          >
            {profile.crest_symbol}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Escudo</p>
            <h2 className="text-xl font-semibold tracking-normal">
              {profile.nickname}
            </h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <div className="rounded-md border bg-background px-3 py-3">
            <div className="flex items-center gap-1 font-mono text-2xl font-semibold text-primary">
              {profile.stars_won}
              <Star className="h-4 w-4 fill-primary" aria-hidden="true" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Estrellas</p>
          </div>
          <div className="rounded-md border bg-background px-3 py-3">
            <div className="font-mono text-2xl font-semibold text-primary">
              {profile.role === "super_admin" ? "ADM" : "USR"}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Rol</p>
          </div>
        </div>
      </aside>

      <form action={action} className="rounded-md border bg-card p-5">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            Perfil
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">
            Tus datos
          </h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nombre</Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              defaultValue={profile.full_name}
              required
            />
            <FieldError errors={state.fieldErrors?.fullName} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nickname">Apodo</Label>
            <Input
              id="nickname"
              name="nickname"
              autoComplete="nickname"
              defaultValue={profile.nickname}
              required
            />
            <FieldError errors={state.fieldErrors?.nickname} />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="contact">Metodo de recordatorio</Label>
            <div className="grid gap-2 rounded-md border bg-background p-3 sm:grid-cols-[180px_minmax(0,1fr)]">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                {profile.reminder_channel === "sms" ? (
                  <Smartphone className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Mail className="h-4 w-4" aria-hidden="true" />
                )}
                {reminderLabel}
              </div>
              <Input id="contact" value={reminderValue} readOnly />
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:flex sm:items-center sm:justify-between">
          <AuthMessage status={state.status} message={state.message} />
          <Button type="submit" className="sm:ml-auto" disabled={pending}>
            <Save className="h-4 w-4" aria-hidden="true" />
            {pending ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </form>
    </div>
  );
}
