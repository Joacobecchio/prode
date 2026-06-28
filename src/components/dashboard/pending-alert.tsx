"use client";

import { AlertTriangle } from "lucide-react";
import type { Match } from "@/lib/domain";
import { Card } from "@/components/ui/card";
import { formatKickoffNumeric } from "@/lib/date-format";
import { TeamCrest } from "./participant-crest";

export function PendingAlert({ matches }: { matches: Match[] }) {
  if (matches.length === 0) {
    return null;
  }

  return (
    <Card className="border-yellow-400/40 bg-yellow-400/12 text-yellow-50">
      <div className="grid gap-3 p-4">
        <div className="flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-5 w-5 text-yellow-300" aria-hidden="true" />
          Te falta votar la proxima fecha
        </div>
        <div className="grid gap-2">
          {matches.map((match) => (
            <div
              key={match.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md bg-black/18 p-2"
            >
              <TeamCrest team={match.homeTeam} />
              <div className="min-w-0 text-sm">
                <div className="truncate">
                  {match.homeTeam.name} vs {match.awayTeam.name}
                </div>
                <div className="text-xs text-yellow-100/70">
                  {formatKickoffNumeric(match.kickoffAt)}
                </div>
              </div>
              <TeamCrest team={match.awayTeam} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
