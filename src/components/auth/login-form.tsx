"use client";

import { type ReactNode, useActionState, useState } from "react";
import { LogIn, Mail, Smartphone } from "lucide-react";
import { AuthMessage, FieldError } from "@/components/auth/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction, type AuthActionState } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {
  status: "idle",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAction, initialState);
  const [contactMethod, setContactMethod] = useState<"email" | "sms">("email");

  return (
    <form action={action} className="grid gap-4">
      <AuthMessage status={state.status} message={state.message} />
      <input type="hidden" name="contactMethod" value={contactMethod} />

      <div className="grid gap-2">
        <Label>Entrar con</Label>
        <div className="grid grid-cols-2 gap-2" role="group" aria-label="Metodo de acceso">
          <ContactMethodButton
            active={contactMethod === "email"}
            icon={<Mail className="h-4 w-4" aria-hidden="true" />}
            label="Email"
            onClick={() => setContactMethod("email")}
          />
          <ContactMethodButton
            active={contactMethod === "sms"}
            icon={<Smartphone className="h-4 w-4" aria-hidden="true" />}
            label="Celular"
            onClick={() => setContactMethod("sms")}
          />
        </div>
      </div>

      {contactMethod === "email" ? (
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            required
          />
          <FieldError errors={state.fieldErrors?.email} />
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="phone">Celular</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+5493511234567"
            required
          />
          <FieldError errors={state.fieldErrors?.phone} />
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="password">Contrasena</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="********"
          required
        />
        <FieldError errors={state.fieldErrors?.password} />
      </div>

      <Button type="submit" className="mt-1 w-full" disabled={pending}>
        <LogIn className="h-4 w-4" aria-hidden="true" />
        {pending ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}

function ContactMethodButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors",
        active && "border-primary bg-primary/10 text-primary",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
