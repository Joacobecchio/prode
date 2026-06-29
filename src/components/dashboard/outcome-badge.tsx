import type { PredictionOutcome } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { outcomeClasses, outcomeLabels } from "@/lib/scoring";

export function OutcomeBadge({ outcome }: { outcome: PredictionOutcome }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
        outcomeClasses[outcome],
      )}
    >
      {outcomeLabels[outcome]}
    </span>
  );
}
