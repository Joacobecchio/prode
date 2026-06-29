import { RoundNavigator } from "@/components/dashboard/round-navigator";
import { StandingsTable } from "@/components/dashboard/standings-table";
import type { Round } from "@/lib/domain";
import { currentStar, participants } from "@/lib/mock-data";

export function Dashboard({
  rounds,
}: {
  rounds: Round[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.75fr)]">
      <StandingsTable participants={participants} star={currentStar} />
      <RoundNavigator rounds={rounds} />
    </div>
  );
}
