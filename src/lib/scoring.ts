import type { Match, PredictionOutcome, Score } from "@/lib/domain";

export const outcomeLabels: Record<PredictionOutcome, string> = {
  full: "Pleno",
  winner: "Sumo por ganador",
  draw: "Sumo por empate",
  miss: "No sumo",
  empty: "No voto",
  pending: "Votado",
};

export const outcomeClasses: Record<PredictionOutcome, string> = {
  full: "border-transparent bg-[var(--color-prode-pleno)] text-black",
  winner: "border-transparent bg-[var(--color-prode-winner)] text-black",
  draw: "border-transparent bg-[var(--color-prode-draw)] text-black",
  miss: "border-transparent bg-[var(--color-prode-miss)] text-white",
  empty: "border-border bg-secondary text-muted-foreground",
  pending: "border-border bg-card text-foreground",
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
