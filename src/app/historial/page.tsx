import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ParticipantCrest } from "@/components/dashboard/participant-crest";
import { requireAuth } from "@/lib/auth/guards";
import { historicalStars, participants } from "@/lib/mock-data";

export const metadata = {
  title: "Historial | Prode",
};

export default async function HistoryPage() {
  await requireAuth("/historial");

  const historicalRanking = [...participants].sort(
    (a, b) => b.starsWon - a.starsWon || b.points - a.points,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            Archivo
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">
            Historial de Estrellas
          </h1>
        </div>

        <div className="grid gap-4">
          {historicalStars.map((star) => (
            <Card key={star.number}>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>Estrella {star.number}</CardTitle>
                  <Badge variant="secondary">{star.fullHits} plenos</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <PodiumRow label="Campeon" participant={star.champion} />
                <PodiumRow label="Subcampeon" participant={star.runnerUp} />
                <Metric label="Mejor fecha" value={star.bestRound} />
                <Metric label="Peor fecha" value={star.worstRound} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Ranking historico</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {historicalRanking.map((participant, index) => (
              <div
                key={participant.id}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border bg-background p-3"
              >
                <span className="font-mono text-sm text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex min-w-0 items-center gap-3">
                  <ParticipantCrest participant={participant} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {participant.nickname}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {participant.points} pts actuales
                    </div>
                  </div>
                </div>
                <span className="font-mono text-lg font-semibold text-primary">
                  {participant.starsWon}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function PodiumRow({
  label,
  participant,
}: {
  label: string;
  participant: (typeof participants)[number];
}) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-background p-3">
      <ParticipantCrest participant={participant} size="md" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{participant.name}</div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
