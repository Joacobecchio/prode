import Link from "next/link";
import { CalendarClock, CircleDot, Clock, MapPin, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutcomeBadge } from "@/components/dashboard/outcome-badge";
import { TeamCrest } from "@/components/dashboard/participant-crest";
import { getFootballRounds, type FootballDataSource } from "@/lib/api-football";
import { requireAuth } from "@/lib/auth/guards";
import { formatKickoffNumeric, formatKickoffShort } from "@/lib/date-format";
import type { Match, MatchStatus, Round } from "@/lib/domain";
import { currentStar } from "@/lib/mock-data";
import { formatScore, getPredictionOutcome } from "@/lib/scoring";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Partidos | Prode",
};

export const dynamic = "force-dynamic";

const statusLabels: Record<MatchStatus, string> = {
  scheduled: "Programado",
  live: "En juego",
  finished: "Finalizado",
  postponed: "Postergado",
};

const statusClasses: Record<MatchStatus, string> = {
  scheduled: "border-border bg-secondary text-secondary-foreground",
  live: "border-transparent bg-accent text-accent-foreground",
  finished: "border-transparent bg-primary text-primary-foreground",
  postponed: "border-destructive/40 bg-destructive/10 text-destructive",
};

export default async function MatchesPage() {
  await requireAuth("/partidos");

  const data = await getFootballRounds();
  const { rounds } = data;
  const matches = rounds.flatMap((round) => round.matches);
  const nextRound = rounds.find((round) => round.isNext);
  const pendingNextRound = nextRound?.matches.filter((match) => !match.userPrediction) ?? [];
  const liveMatches = matches.filter((match) => match.status === "live");
  const votedMatches = matches.filter((match) => match.userPrediction);

  return (
    <div className="space-y-6">
      <header className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            {currentStar.name} · Fechas {currentStar.roundFrom} a {currentStar.roundTo}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">
            Partidos
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <DataSourceBadge source={data.source} />
            <Badge variant="outline" className="bg-card">
              Liga {data.leagueId} · {data.season}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SummaryTile label="En juego" value={liveMatches.length} />
          <SummaryTile label="Votados" value={votedMatches.length} />
          <SummaryTile label="Pendientes" value={pendingNextRound.length} />
        </div>
      </header>

      {data.warning ? (
        <Card className="border-yellow-400/40 bg-yellow-400/10">
          <CardContent className="p-4 text-sm text-yellow-100">
            {data.warning}
          </CardContent>
        </Card>
      ) : null}

      {pendingNextRound.length > 0 ? (
        <Card className="border-yellow-400/40 bg-yellow-400/12 text-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-yellow-300" aria-hidden="true" />
              <CardTitle>Faltan votos en la proxima fecha</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {pendingNextRound.map((match) => (
              <PendingMatch key={match.id} match={match} />
            ))}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-5">
        {rounds.map((round) => (
          <RoundSection key={round.id} round={round} />
        ))}
      </section>
    </div>
  );
}

function DataSourceBadge({ source }: { source: FootballDataSource }) {
  if (source === "api-football") {
    return <Badge variant="default">Datos reales · API-Sports</Badge>;
  }

  if (source === "thesportsdb") {
    return <Badge variant="default">Datos reales · TheSportsDB</Badge>;
  }

  return <Badge variant="secondary">Datos demo</Badge>;
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-card px-3 py-3">
      <div className="font-mono text-2xl font-semibold text-primary">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function RoundSection({ round }: { round: Round }) {
  const voted = round.matches.filter((match) => match.userPrediction).length;
  const total = round.matches.length;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold tracking-normal">
              {round.label ?? `Fecha ${round.number}`}
            </h2>
            {round.isCurrent ? <Badge variant="default">Actual</Badge> : null}
            {round.isNext ? <Badge variant="secondary">Proxima</Badge> : null}
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarClock className="h-4 w-4" aria-hidden="true" />
            {round.competition} · {formatKickoffNumeric(round.startsAt)}
          </div>
        </div>

        <Badge variant="outline" className="bg-card">
          {voted}/{total} votados
        </Badge>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {round.matches.map((match) => (
          <MatchListItem key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

function MatchListItem({ match }: { match: Match }) {
  const outcome = getPredictionOutcome(match);

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {formatKickoffShort(match.kickoffAt)}
          </div>
          <Badge
            variant="outline"
            className={cn("justify-center", statusClasses[match.status])}
          >
            {statusLabels[match.status]}
          </Badge>
        </div>

        <div className="grid gap-2">
          <TeamScoreLine
            name={match.homeTeam.name}
            crest={<TeamCrest team={match.homeTeam} />}
            score={match.officialScore?.home}
          />
          <TeamScoreLine
            name={match.awayTeam.name}
            crest={<TeamCrest team={match.awayTeam} />}
            score={match.officialScore?.away}
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span className="min-w-0 truncate">{match.venue}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-md border bg-background px-3 py-2">
          <div>
            <div className="text-xs text-muted-foreground">Tu pronostico</div>
            <div className="mt-1 font-mono text-base font-semibold">
              {formatScore(match.userPrediction)}
            </div>
          </div>
          <OutcomeBadge outcome={outcome} />
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/partidos/${match.id}`}>Ver analisis</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function TeamScoreLine({
  name,
  crest,
  score,
}: {
  name: string;
  crest: React.ReactNode;
  score?: number;
}) {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border bg-background px-3 py-2">
      {crest}
      <span className="min-w-0 text-sm font-medium leading-tight">{name}</span>
      <span className="font-mono text-lg font-semibold">{score ?? "-"}</span>
    </div>
  );
}

function PendingMatch({ match }: { match: Match }) {
  return (
    <Link
      href={`/partidos/${match.id}`}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md bg-black/18 p-2 transition-colors hover:bg-black/28"
    >
      <TeamCrest team={match.homeTeam} />
      <div className="min-w-0 text-sm">
        <div className="truncate">
          {match.homeTeam.name} vs {match.awayTeam.name}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-xs text-yellow-100/70">
          <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
          {formatKickoffNumeric(match.kickoffAt)}
        </div>
      </div>
      <TeamCrest team={match.awayTeam} />
    </Link>
  );
}
