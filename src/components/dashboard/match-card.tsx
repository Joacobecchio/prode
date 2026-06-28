"use client";

import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Match, Score } from "@/lib/domain";
import { formatKickoffShort } from "@/lib/date-format";
import { formatScore, getPredictionOutcome } from "@/lib/scoring";
import { OutcomeBadge } from "./outcome-badge";
import { PredictionControls } from "./prediction-controls";
import { TeamCrest } from "./participant-crest";

type MatchCardProps = {
  match: Match;
  onPredictionChange: (matchId: string, score?: Score) => void;
};

export function MatchCard({ match, onPredictionChange }: MatchCardProps) {
  const kickoff = formatKickoffShort(match.kickoffAt);
  const outcome = getPredictionOutcome(match);
  const canEdit = match.status === "scheduled";

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {kickoff}
          </div>
          <OutcomeBadge outcome={outcome} />
        </div>

        <div className="grid gap-2 md:hidden">
          <MobileTeamLine
            name={match.homeTeam.name}
            crest={<TeamCrest team={match.homeTeam} />}
            score={match.officialScore?.home}
          />
          <MobileTeamLine
            name={match.awayTeam.name}
            crest={<TeamCrest team={match.awayTeam} />}
            score={match.officialScore?.away}
          />
        </div>

        <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-3 md:grid">
          <TeamBlock
            name={match.homeTeam.name}
            crest={<TeamCrest team={match.homeTeam} />}
          />
          <div className="rounded-md border bg-background px-3 py-2 text-center font-mono text-xl font-semibold">
            {match.officialScore ? formatScore(match.officialScore) : "vs"}
          </div>
          <TeamBlock
            name={match.awayTeam.name}
            crest={<TeamCrest team={match.awayTeam} />}
            align="right"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          <span className="truncate">{match.venue}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tu pronostico</span>
            <span className="font-mono">{formatScore(match.userPrediction)}</span>
          </div>
          <PredictionControls
            value={match.userPrediction}
            disabled={!canEdit}
            onChange={(score) => onPredictionChange(match.id, score)}
          />
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href={`/partidos/${match.id}`}>Ver partido</Link>
        </Button>
      </div>
    </Card>
  );
}

function MobileTeamLine({
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

function TeamBlock({
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
      className={`flex min-w-0 items-center gap-2 ${
        align === "right" ? "flex-row-reverse text-right" : ""
      }`}
    >
      {crest}
      <span className="min-w-0 truncate text-sm font-medium">{name}</span>
    </div>
  );
}
