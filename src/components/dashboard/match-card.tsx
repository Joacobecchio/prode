"use client";

import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import type { Match, Score } from "@/lib/domain";
import { formatKickoffShort } from "@/lib/date-format";
import { formatScore, getPredictionOutcome } from "@/lib/scoring";
import { cn } from "@/lib/utils";
import { OutcomeBadge } from "./outcome-badge";
import { PredictionControls } from "./prediction-controls";
import { TeamCrest } from "./participant-crest";

type MatchCardProps = {
  match: Match;
  onPredictionChange: (matchId: string, score?: Score) => void;
};

const statusConfig = {
  scheduled: { label: "Próximo",    className: "border-blue-500/20 bg-blue-500/10 text-blue-500 dark:text-blue-400" },
  live:      { label: "En Juego",   className: "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-400" },
  finished:  { label: "Finalizado", className: "border-border bg-secondary text-muted-foreground" },
  postponed: { label: "Postergado", className: "border-border bg-secondary text-muted-foreground" },
} as const;

export function MatchCard({ match, onPredictionChange }: MatchCardProps) {
  const kickoff = formatKickoffShort(match.kickoffAt);
  const outcome = getPredictionOutcome(match);
  const canEdit = match.status === "scheduled";
  const status = statusConfig[match.status];

  const cardBorderClass =
    outcome === "full"
      ? "border-amber-500/30"
      : outcome === "winner" || outcome === "draw"
        ? "border-emerald-500/20"
        : "";

  return (
    <div className={cn("overflow-hidden rounded-2xl border bg-card transition-colors", cardBorderClass)}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 px-4 pt-3.5">
        <span
          className={cn(
            "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            status.className,
          )}
        >
          {match.status === "live" && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          )}
          {status.label}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="h-3 w-3" aria-hidden="true" />
          {kickoff}
        </div>
      </div>

      {/* Teams + score */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4">
        {/* Home team */}
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={match.homeTeam} />
          <span className="text-center text-[11px] font-semibold leading-tight text-muted-foreground">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center gap-1">
          {match.officialScore ? (
            <span className="font-mono text-2xl font-black tabular-nums tracking-tight">
              {match.officialScore.home}
              <span className="mx-1 text-muted-foreground/40">—</span>
              {match.officialScore.away}
            </span>
          ) : (
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/50">
              vs
            </span>
          )}
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center gap-2">
          <TeamCrest team={match.awayTeam} />
          <span className="text-center text-[11px] font-semibold leading-tight text-muted-foreground">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Venue */}
      <div className="flex items-center gap-1.5 px-4 pb-3 text-[11px] text-muted-foreground/60">
        <MapPin className="h-3 w-3" aria-hidden="true" />
        <span className="truncate">{match.venue}</span>
      </div>

      {/* Divider */}
      <div className="h-px bg-border/60" />

      {/* Prediction footer */}
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Tu pronóstico
            </p>
            <p className="mt-0.5 font-mono text-sm font-bold">
              {match.userPrediction ? (
                formatScore(match.userPrediction)
              ) : (
                <span className="text-muted-foreground/40">—</span>
              )}
            </p>
          </div>
          <OutcomeBadge outcome={outcome} />
        </div>

        {canEdit && (
          <PredictionControls
            value={match.userPrediction}
            disabled={!canEdit}
            onChange={(score) => onPredictionChange(match.id, score)}
          />
        )}

        <Link
          href={`/partidos/${match.id}`}
          className="block text-center text-[11px] font-medium text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          Ver detalle del partido →
        </Link>
      </div>
    </div>
  );
}
