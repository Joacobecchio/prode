import { Star } from "lucide-react";
import Image from "next/image";
import type { Participant, Team } from "@/lib/domain";

type ParticipantCrestProps = {
  participant: Participant;
  size?: "sm" | "md" | "lg";
};

const sizeMap = {
  sm: { box: "h-9 w-9 text-[10px]", star: "h-4 w-4 -right-1.5 -top-1.5 text-[9px]" },
  md: { box: "h-11 w-11 text-xs",   star: "h-5 w-5 -right-1.5 -top-1.5 text-[10px]" },
  lg: { box: "h-16 w-16 text-sm",   star: "h-6 w-6 -right-2 -top-2 text-xs" },
};

export function ParticipantCrest({
  participant,
  size = "md",
}: ParticipantCrestProps) {
  const sz = sizeMap[size];
  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`${sz.box} grid place-items-center rounded-xl font-black shadow-sm`}
        style={{
          background: `linear-gradient(135deg, ${participant.crest.primary}, ${participant.crest.secondary})`,
          color: "#fff",
        }}
        aria-label={`Escudo de ${participant.nickname}`}
      >
        {participant.crest.symbol}
      </div>
      {participant.starsWon > 0 && (
        <span
          className={`absolute ${sz.star} inline-flex items-center justify-center rounded-full border-2 border-background bg-primary font-bold text-primary-foreground`}
        >
          {participant.starsWon}
        </span>
      )}
    </div>
  );
}

export function TeamCrest({ team }: { team: Team }) {
  if (team.logoUrl) {
    return (
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border bg-white p-1 shadow-sm">
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
      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[10px] font-black shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${team.colors[0]} 0 50%, ${team.colors[1]} 50% 100%)`,
        color: team.colors[0] === "#ffffff" || team.colors[0] === "#f6f6f6" ? "#111827" : "#ffffff",
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
      <Star className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
      {count}
    </span>
  );
}
