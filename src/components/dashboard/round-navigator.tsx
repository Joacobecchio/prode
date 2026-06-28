"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
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
    setPredictions((current) => ({
      ...current,
      [matchId]: score,
    }));
  }

  return (
    <section className="space-y-4">
      <PendingAlert matches={pendingNextMatches} />

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-accent">
            Fecha actual
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-normal">
            Fecha {activeRound.number} - {activeRound.competition}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Fecha anterior"
            disabled={activeIndex === 0}
            onClick={() => setActiveIndex((value) => Math.max(0, value - 1))}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Fecha siguiente"
            disabled={activeIndex === hydratedRounds.length - 1}
            onClick={() =>
              setActiveIndex((value) =>
                Math.min(hydratedRounds.length - 1, value + 1),
              )
            }
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {hydratedRounds.map((round, index) => (
          <button
            key={round.id}
            className={cn(
              "h-9 shrink-0 rounded-md border px-3 text-sm text-muted-foreground",
              activeIndex === index && "bg-primary text-primary-foreground",
            )}
            onClick={() => setActiveIndex(index)}
          >
            Fecha {round.number}
          </button>
        ))}
      </div>

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
