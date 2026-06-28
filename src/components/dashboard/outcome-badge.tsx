import { Badge } from "@/components/ui/badge";
import type { PredictionOutcome } from "@/lib/domain";
import { cn } from "@/lib/utils";
import { outcomeClasses, outcomeLabels } from "@/lib/scoring";

export function OutcomeBadge({ outcome }: { outcome: PredictionOutcome }) {
  return (
    <Badge variant="outline" className={cn("justify-center", outcomeClasses[outcome])}>
      {outcomeLabels[outcome]}
    </Badge>
  );
}
