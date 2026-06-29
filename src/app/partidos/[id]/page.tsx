import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TeamCrest } from "@/components/dashboard/participant-crest";
import { OutcomeBadge } from "@/components/dashboard/outcome-badge";
import { getFootballMatchInsight } from "@/lib/api-football";
import { requireAuth } from "@/lib/auth/guards";
import { formatKickoffDetail } from "@/lib/date-format";
import { findMatchById, rounds } from "@/lib/mock-data";
import { formatScore, getPredictionOutcome } from "@/lib/scoring";

type MatchPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return rounds
    .flatMap((round) => round.matches)
    .map((match) => ({
      id: match.id,
    }));
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = findMatchById(id);

  if (!match) {
    return {};
  }

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} | Prode`,
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { id } = await params;
  await requireAuth(`/partidos/${id}`);

  const insight = await getFootballMatchInsight(id);

  if (!insight) {
    notFound();
  }

  const { match } = insight;
  const kickoff = formatKickoffDetail(match.kickoffAt);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Fecha {match.roundNumber}</Badge>
          <Badge variant="outline">{match.status}</Badge>
          <Badge variant={insight.source === "mock" ? "secondary" : "default"}>
            {insight.source === "mock" ? "Datos demo" : "Datos reales"}
          </Badge>
          <OutcomeBadge outcome={getPredictionOutcome(match)} />
        </div>

        {insight.warning ? (
          <Card className="border-yellow-400/40 bg-yellow-400/10">
            <CardContent className="p-4 text-sm text-yellow-100">
              {insight.warning}
            </CardContent>
          </Card>
        ) : null}

        <div className="rounded-md border bg-card p-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <TeamHero name={match.homeTeam.name} crest={<TeamCrest team={match.homeTeam} />} />
            <div className="rounded-md border bg-background px-4 py-3 text-center font-mono text-2xl font-semibold">
              {match.officialScore ? formatScore(match.officialScore) : "vs"}
            </div>
            <TeamHero
              name={match.awayTeam.name}
              crest={<TeamCrest team={match.awayTeam} />}
              align="right"
            />
          </div>
          <Separator className="my-5" />
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <InfoItem label="Horario" value={kickoff} />
            <InfoItem label="Estadio" value={match.venue} />
            <InfoItem label="Pronostico" value={formatScore(match.userPrediction)} />
            <InfoItem label="Resultado" value={formatScore(match.officialScore)} />
          </dl>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ultimos cinco enfrentamientos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {insight.lastMeetings.map((meeting) => (
                <div
                  key={meeting}
                  className="rounded-md border bg-background px-3 py-2 font-mono text-sm"
                >
                  {meeting}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ultimos cinco partidos</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <FormRow label={match.homeTeam.name} form={insight.homeForm} />
              <FormRow label={match.awayTeam.name} form={insight.awayForm} />
            </CardContent>
          </Card>
        </div>
      </section>

      <aside className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Posicion actual</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <InfoItem
              label={match.homeTeam.name}
              value={insight.positions.home ?? "Sin posicion disponible"}
            />
            <InfoItem
              label={match.awayTeam.name}
              value={insight.positions.away ?? "Sin posicion disponible"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Noticias relacionadas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            {insight.news.map((item) => (
              <p key={item}>{item}</p>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function TeamHero({
  name,
  crest,
  align = "left",
}: {
  name: string;
  crest: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 items-center gap-3 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      {crest}
      <h1 className="min-w-0 truncate text-lg font-semibold sm:text-2xl">
        {name}
      </h1>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium">{value}</dd>
    </div>
  );
}

function FormRow({ label, form }: { label: string; form: string[] }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">{label}</div>
      <div className="flex gap-2">
        {form.map((item, index) => (
          <span
            key={`${label}-${index}`}
            className="grid h-8 w-8 place-items-center rounded-md border bg-background text-xs font-semibold"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
