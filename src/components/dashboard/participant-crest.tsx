import { Trophy } from "lucide-react";
import Image from "next/image";
import type { Participant, Team } from "@/lib/domain";

type ParticipantCrestProps = {
  participant: Participant;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
};

export function ParticipantCrest({
  participant,
  size = "md",
}: ParticipantCrestProps) {
  return (
    <div className="relative inline-flex">
      <div
        className={`${sizeClasses[size]} grid place-items-center rounded-md border font-bold`}
        style={{
          background: `linear-gradient(135deg, ${participant.crest.primary}, ${participant.crest.secondary})`,
          color: "#fff",
        }}
        aria-label={`Escudo de ${participant.nickname}`}
      >
        {participant.crest.symbol}
      </div>
      {participant.starsWon > 0 ? (
        <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full border bg-card px-1 text-[10px] text-primary">
          {participant.starsWon}
        </span>
      ) : null}
    </div>
  );
}

export function TeamCrest({ team }: { team: Team }) {
  if (team.logoUrl) {
    return (
      <div className="grid h-10 w-10 place-items-center rounded-md border bg-white p-1">
        <Image
          src={team.logoUrl}
          alt={`Escudo de ${team.name}`}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className="grid h-10 w-10 place-items-center rounded-md border text-[11px] font-black"
      style={{
        background: `linear-gradient(135deg, ${team.colors[0]} 0 50%, ${team.colors[1]} 50% 100%)`,
        color: team.colors[0] === "#ffffff" ? "#111827" : "#ffffff",
      }}
      aria-label={`Escudo de ${team.name}`}
    >
      {team.shortName}
    </div>
  );
}

export function StarCount({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
      <Trophy className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      {count}
    </span>
  );
}
