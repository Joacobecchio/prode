import { Star, TrendingUp } from "lucide-react";
import type { Participant, Star as StarTournament } from "@/lib/domain";
import { ParticipantCrest, StarCount } from "./participant-crest";
import { cn } from "@/lib/utils";

const positionConfig = [
  { color: "text-amber-400",   bg: "bg-amber-500/8 dark:bg-amber-500/10",  border: "border-l-amber-400"  },
  { color: "text-slate-400",   bg: "bg-slate-500/6 dark:bg-slate-500/8",   border: "border-l-slate-400"  },
  { color: "text-orange-500",  bg: "bg-orange-500/6 dark:bg-orange-500/8", border: "border-l-orange-500" },
];

export function StandingsTable({
  participants,
  star,
}: {
  participants: Participant[];
  star: StarTournament;
}) {
  return (
    <section className="space-y-5">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            {star.name} · Fechas {star.roundFrom} a {star.roundTo}
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight">
            Tabla General
          </h1>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          En vivo
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left">
              <th className="w-12 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">#</th>
              <th className="w-12 px-2 py-3" />
              <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nombre</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pts</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Plenos</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Max</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => {
              const pos = positionConfig[index];
              return (
                <tr
                  key={participant.id}
                  className={cn(
                    "border-b border-border/40 transition-colors last:border-0 hover:bg-secondary/50",
                    pos && pos.bg,
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "font-mono text-sm font-bold",
                        pos ? pos.color : "text-muted-foreground",
                      )}
                    >
                      {index + 1}
                    </span>
                  </td>
                  <td className={cn("py-3 pl-2", pos && `border-l-2 ${pos.border}`)}>
                    <ParticipantCrest participant={participant} size="sm" />
                  </td>
                  <td className="px-2 py-3">
                    <div className="font-semibold">{participant.name}</div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {participant.nickname}
                      <StarCount count={participant.starsWon} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-lg font-black text-primary">
                    {participant.points}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-muted-foreground">
                    {participant.fullHits}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold text-muted-foreground">
                    {participant.bestFullHitsInRound}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-2 md:hidden">
        {participants.map((participant, index) => {
          const pos = positionConfig[index];
          return (
            <div
              key={participant.id}
              className={cn(
                "grid grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden rounded-2xl border bg-card p-3",
                pos && pos.bg,
              )}
            >
              {/* Position */}
              <span
                className={cn(
                  "w-7 text-center font-mono text-sm font-black",
                  pos ? pos.color : "text-muted-foreground",
                )}
              >
                {index + 1}
              </span>

              {/* Player */}
              <div className={cn("flex min-w-0 items-center gap-2.5", pos && `border-l-2 pl-2 ${pos.border}`)}>
                <ParticipantCrest participant={participant} size="sm" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold">{participant.name}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    {participant.nickname}
                    {participant.starsWon > 0 && (
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 fill-primary text-primary" aria-hidden="true" />
                        {participant.starsWon}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="text-right">
                <div className="font-mono text-2xl font-black text-primary leading-none">
                  {participant.points}
                </div>
                <div className="text-[10px] font-medium text-muted-foreground mt-0.5">
                  {participant.fullHits} plenos
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
