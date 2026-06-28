export type Score = {
  home: number;
  away: number;
};

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export type PredictionOutcome =
  | "full"
  | "winner"
  | "draw"
  | "miss"
  | "empty"
  | "pending";

export type Team = {
  id: string;
  name: string;
  shortName: string;
  colors: [string, string];
  logoUrl?: string;
  apiFootballId?: number;
};

export type Participant = {
  id: string;
  name: string;
  nickname: string;
  points: number;
  fullHits: number;
  bestFullHitsInRound: number;
  starsWon: number;
  crest: {
    primary: string;
    secondary: string;
    symbol: string;
  };
};

export type Star = {
  id: string;
  number: number;
  name: string;
  status: "draft" | "active" | "finished";
};

export type Match = {
  id: string;
  roundNumber: number;
  competition: string;
  kickoffAt: string;
  venue: string;
  status: MatchStatus;
  homeTeam: Team;
  awayTeam: Team;
  officialScore?: Score;
  userPrediction?: Score;
  apiFootballId?: number;
};

export type Round = {
  id: string;
  number: number;
  label?: string;
  competition: string;
  startsAt: string;
  closesAt: string;
  isCurrent?: boolean;
  isNext?: boolean;
  matches: Match[];
};

export type HistoricalStar = {
  number: number;
  champion: Participant;
  runnerUp: Participant;
  fullHits: number;
  bestRound: string;
  worstRound: string;
  relegations?: string[];
};
