import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SupabaseSetupNotice({ error }: { error?: string }) {
  return (
    <Card className="border-yellow-400/40 bg-yellow-400/10">
      <CardContent className="flex gap-3 p-4 text-sm text-yellow-50">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
        <div>
          <p className="font-medium">Falta conectar Supabase Auth.</p>
          <p className="mt-1 text-yellow-100/80">
            Agrega `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
            en `.env.local` para habilitar login, registro y perfil.
          </p>
          {error ? (
            <p className="mt-2 font-mono text-xs text-yellow-100/70">{error}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
