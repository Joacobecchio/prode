"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import type { Score } from "@/lib/domain";

type PredictionControlsProps = {
  value?: Score;
  disabled?: boolean;
  onChange: (score?: Score) => void;
};

export function PredictionControls({
  value,
  disabled,
  onChange,
}: PredictionControlsProps) {
  function nudge(side: keyof Score, delta: number) {
    const base = value ?? { home: 0, away: 0 };
    onChange({ ...base, [side]: Math.max(0, Math.min(20, base[side] + delta)) });
  }

  return (
    <div className="flex items-center gap-2">
      <Stepper
        label="Local"
        value={value?.home}
        disabled={disabled}
        onMinus={() => nudge("home", -1)}
        onPlus={() => nudge("home", 1)}
      />

      <button
        disabled={disabled || !value}
        aria-label="Limpiar pronóstico"
        onClick={() => onChange(undefined)}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
      >
        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <Stepper
        label="Visitante"
        value={value?.away}
        disabled={disabled}
        onMinus={() => nudge("away", -1)}
        onPlus={() => nudge("away", 1)}
      />
    </div>
  );
}

function Stepper({
  label,
  value,
  disabled,
  onMinus,
  onPlus,
}: {
  label: string;
  value?: number;
  disabled?: boolean;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="flex flex-1 items-center overflow-hidden rounded-xl border bg-card">
      <button
        disabled={disabled}
        aria-label={`Restar gol ${label}`}
        onClick={onMinus}
        className="grid h-10 w-9 shrink-0 place-items-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
      <div className="flex-1 text-center font-mono text-lg font-bold tabular-nums">
        {value ?? <span className="text-muted-foreground">—</span>}
      </div>
      <button
        disabled={disabled}
        aria-label={`Sumar gol ${label}`}
        onClick={onPlus}
        className="grid h-10 w-9 shrink-0 place-items-center text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
