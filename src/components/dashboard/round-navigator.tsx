"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Round, Score } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { MatchCard } from "./match-card";
import { PendingAlert } from "./pending-alert";

export function RoundNavigator({ rounds }: { rounds: Round[] }) {
  const currentIndex = Math.max(
    0,
    rounds.findIndex((round) => round.isCurrent),
  );
  const [activeIndex, setActiveIndex] = useState(currentIndex);
  const [predictions, setPredictions] = useState<Record<string, Score | undefined>>(
    () =>
      Object.fromEntries(
        rounds
          .flatMap((round) => round.matches)
          .map((match) => [match.id, match.userPrediction]),
      ),
  );

  const hydratedRounds = useMemo(
    () =>
      rounds.map((round) => ({
        ...round,
        matches: round.matches.map((match) => ({
          ...match,
          userPrediction: predictions[match.id],
        })),
      })),
    [predictions, rounds],
  );

  const activeRound = hydratedRounds[activeIndex];
  const nextRound = hydratedRounds.find((round) => round.isNext);
  const pendingNextMatches =
    nextRound?.matches.filter((match) => !match.userPrediction) ?? [];

  function updatePrediction(matchId: string, score?: Score) {
    setPredictions((current) => ({ ...current, [matchId]: score }));
  }

  return (
    <section className="space-y-5">
      {/* Alert */}
      <PendingAlert matches={pendingNextMatches} />

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Fecha actual
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight">
            Fecha {activeRound.number}
            <span className="ml-2 text-sm font-semibold text-muted-foreground">
              · {activeRound.competition}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Fecha anterior"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((v) => Math.max(0, v - 1))}
            className="grid h-8 w-8 place-items-center rounded-xl border bg-card text-muted-foreground transition-colors hover:border-border hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            aria-label="Fecha siguiente"
            disabled={activeIndex === hydratedRounds.length - 1}
            onClick={() =>
              setActiveIndex((v) => Math.min(hydratedRounds.length - 1, v + 1))
            }
            className="grid h-8 w-8 place-items-center rounded-xl border bg-card text-muted-foreground transition-colors hover:border-border hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Fecha tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
        {hydratedRounds.map((round, index) => (
          <button
            key={round.id}
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-8 shrink-0 rounded-lg border px-3 text-xs font-semibold transition-colors",
              activeIndex === index
                ? "border-primary/40 bg-primary/12 text-primary"
                : "border-transparent bg-secondary text-muted-foreground hover:text-foreground",
            )}
          >
            Fecha {round.number}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        {[
          { color: "bg-amber-500", label: "Pleno" },
          { color: "bg-emerald-500", label: "Ganador / Empate" },
          { color: "bg-red-500", label: "No sumaste" },
          { color: "bg-muted-foreground/30", label: "Sin votar" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span className={`h-1.5 w-1.5 rounded-full ${color}`} aria-hidden="true" />
            {label}
          </div>
        ))}
      </div>

      {/* Match cards */}
      <div className="grid gap-3">
        {activeRound.matches.map((match) => (
          <MatchCard
            key={match.id}
            match={match}
            onPredictionChange={updatePrediction}
          />
        ))}
      </div>
    </section>
  );
}
