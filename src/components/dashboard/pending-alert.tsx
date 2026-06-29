"use client";

import { Bell } from "lucide-react";
import type { Match } from "@/lib/domain";
import { formatKickoffNumeric } from "@/lib/date-format";
import { TeamCrest } from "./participant-crest";

export function PendingAlert({ matches }: { matches: Match[] }) {
  if (matches.length === 0) return null;

  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/8 p-4">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-500 text-amber-950">
        <Bell className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-amber-500">
            ¡Te falta votar!
          </p>
          <p className="text-xs text-amber-500/70">
            La próxima fecha cierra pronto
          </p>
        </div>
        <div className="space-y-1.5">
          {matches.map((match) => (
            <div
              key={match.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-xl bg-amber-500/8 px-3 py-2"
            >
              <TeamCrest team={match.homeTeam} />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-amber-100">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </p>
                <p className="text-[11px] text-amber-500/60">
                  {formatKickoffNumeric(match.kickoffAt)}
                </p>
              </div>
              <TeamCrest team={match.awayTeam} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
