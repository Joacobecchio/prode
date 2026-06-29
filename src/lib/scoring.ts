import type { Match, PredictionOutcome, Score } from "@/lib/domain";

export const outcomeLabels: Record<PredictionOutcome, string> = {
  full: "⭐ Pleno",
  winner: "✓ Ganador",
  draw: "✓ Empate",
  miss: "✕ No sumaste",
  empty: "Sin votar",
  pending: "Votado",
};

export const outcomeClasses: Record<PredictionOutcome, string> = {
  full:    "border-amber-500/25 bg-amber-500/12 text-amber-500 dark:text-amber-400",
  winner:  "border-blue-500/25 bg-blue-500/12 text-blue-600 dark:text-blue-400",
  draw:    "border-emerald-500/25 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  miss:    "border-red-500/25 bg-red-500/12 text-red-600 dark:text-red-400",
  empty:   "border-border bg-secondary text-muted-foreground",
  pending: "border-border bg-secondary text-foreground",
};

export function formatScore(score?: Score) {
  if (!score) {
    return "-";
  }

  return `${score.home}-${score.away}`;
}

export function getWinner(score: Score) {
  if (score.home > score.away) return "home";
  if (score.home < score.away) return "away";
  return "draw";
}

export function getPredictionOutcome(match: Match): PredictionOutcome {
  if (!match.userPrediction) {
    return "empty";
  }

  if (!match.officialScore || match.status !== "finished") {
    return "pending";
  }

  if (
    match.userPrediction.home === match.officialScore.home &&
    match.userPrediction.away === match.officialScore.away
  ) {
    return "full";
  }

  const predictedWinner = getWinner(match.userPrediction);
  const officialWinner = getWinner(match.officialScore);

  if (predictedWinner === "draw" && officialWinner === "draw") {
    return "draw";
  }

  if (predictedWinner === officialWinner) {
    return "winner";
  }

  return "miss";
}

export function getOutcomePoints(outcome: PredictionOutcome) {
  if (outcome === "full") return 3;
  if (outcome === "winner" || outcome === "draw") return 1;
  return 0;
}
