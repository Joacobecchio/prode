import {
  CalendarCheck,
  DatabaseZap,
  LockKeyhole,
  RotateCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminRoundForm } from "@/app/admin/admin-round-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { requireSuperAdmin } from "@/lib/auth/guards";

export const metadata = {
  title: "Admin | Prode",
};

const adminActions = [
  {
    title: "Sincronizar partidos",
    description: "API Football",
    icon: DatabaseZap,
  },
  {
    title: "Cargar resultados",
    description: "Manual",
    icon: CalendarCheck,
  },
  {
    title: "Recalcular puntajes",
    description: "Torneo actual",
    icon: RotateCw,
  },
  {
    title: "Cerrar fecha",
    description: "Bloquear votos",
    icon: LockKeyhole,
  },
  {
    title: "Usuarios",
    description: "Participantes",
    icon: Users,
  },
  {
    title: "Crear Estrella",
    description: "Nuevo torneo",
    icon: ShieldCheck,
  },
];

export default async function AdminPage() {
  await requireSuperAdmin("/admin");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            Administracion
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">
            Panel de control
          </h1>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {adminActions.map((action) => {
            const Icon = action.icon;

            return (
              <Card key={action.title}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle>{action.title}</CardTitle>
                    <span className="grid h-10 w-10 place-items-center rounded-md border bg-background text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                  <Button variant="outline" className="w-full">
                    Ejecutar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <aside>
        <Card>
          <CardHeader>
            <CardTitle>Crear fecha</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminRoundForm />
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
