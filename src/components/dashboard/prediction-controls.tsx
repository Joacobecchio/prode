"use client";

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    onChange({
      ...base,
      [side]: Math.max(0, Math.min(20, base[side] + delta)),
    });
  }

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
      <ScoreStepper
        label="Local"
        value={value?.home}
        disabled={disabled}
        onMinus={() => nudge("home", -1)}
        onPlus={() => nudge("home", 1)}
      />
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled || !value}
        aria-label="Limpiar pronostico"
        onClick={() => onChange(undefined)}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      </Button>
      <ScoreStepper
        label="Visitante"
        value={value?.away}
        disabled={disabled}
        onMinus={() => nudge("away", -1)}
        onPlus={() => nudge("away", 1)}
      />
    </div>
  );
}

function ScoreStepper({
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
    <div className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center rounded-md border bg-background">
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        className="h-10 w-9 rounded-r-none"
        aria-label={`Restar gol ${label}`}
        onClick={onMinus}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </Button>
      <div className="text-center font-mono text-lg font-semibold">
        {value ?? "-"}
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={disabled}
        className="h-10 w-9 rounded-l-none"
        aria-label={`Sumar gol ${label}`}
        onClick={onPlus}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
