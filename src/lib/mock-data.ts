import type { HistoricalStar, Match, Participant, Round, Star, Team } from "@/lib/domain";

export const currentStar: Star = {
  id: "star-1",
  number: 1,
  name: "Estrella 1",
  roundFrom: 1,
  roundTo: 5,
  status: "active",
};

export const teams: Team[] = [
  { id: "boca", name: "Boca Juniors", shortName: "BOC", colors: ["#123c8c", "#f6ce2f"] },
  { id: "river", name: "River Plate", shortName: "RIV", colors: ["#f6f6f6", "#d71920"] },
  { id: "racing", name: "Racing Club", shortName: "RAC", colors: ["#8bd6ff", "#ffffff"] },
  { id: "independiente", name: "Independiente", shortName: "IND", colors: ["#d71920", "#ffffff"] },
  { id: "san-lorenzo", name: "San Lorenzo", shortName: "SL", colors: ["#102b6d", "#d71920"] },
  { id: "estudiantes", name: "Estudiantes", shortName: "EST", colors: ["#d71920", "#ffffff"] },
  { id: "velez", name: "Velez", shortName: "VEL", colors: ["#ffffff", "#1556c7"] },
  { id: "talleres", name: "Talleres", shortName: "TAL", colors: ["#193f8f", "#ffffff"] },
  { id: "newells", name: "Newell's", shortName: "NOB", colors: ["#d71920", "#111111"] },
  { id: "central", name: "Rosario Central", shortName: "CEN", colors: ["#164c9c", "#f6ce2f"] },
  { id: "argentinos", name: "Argentinos Juniors", shortName: "ARG", colors: ["#d71920", "#ffffff"] },
  { id: "lanus", name: "Lanus", shortName: "LAN", colors: ["#6b1e2d", "#ffffff"] },
];

const teamById = Object.fromEntries(teams.map((team) => [team.id, team]));

function match(
  id: string,
  roundNumber: number,
  homeTeamId: string,
  awayTeamId: string,
  kickoffAt: string,
  venue: string,
  status: Match["status"],
  officialScore?: Match["officialScore"],
  userPrediction?: Match["userPrediction"],
): Match {
  return {
    id,
    roundNumber,
    competition: "Primera Division",
    kickoffAt,
    venue,
    status,
    homeTeam: teamById[homeTeamId],
    awayTeam: teamById[awayTeamId],
    officialScore,
    userPrediction,
    apiFootballId: Number(id.replace("m", "")) + 15000,
  };
}

export const participants: Participant[] = [
  {
    id: "p1",
    name: "Joaquin Becchio",
    nickname: "Joaco",
    points: 42,
    fullHits: 8,
    bestFullHitsInRound: 3,
    starsWon: 2,
    crest: { primary: "#79d45e", secondary: "#10251b", symbol: "JB" },
  },
  {
    id: "p2",
    name: "Martin Perez",
    nickname: "Tincho",
    points: 39,
    fullHits: 7,
    bestFullHitsInRound: 2,
    starsWon: 1,
    crest: { primary: "#5bb6ff", secondary: "#111827", symbol: "MP" },
  },
  {
    id: "p3",
    name: "Pablo Santos",
    nickname: "Pablin",
    points: 37,
    fullHits: 6,
    bestFullHitsInRound: 2,
    starsWon: 0,
    crest: { primary: "#f5c451", secondary: "#40240b", symbol: "PS" },
  },
  {
    id: "p4",
    name: "Federico Ruiz",
    nickname: "Fede",
    points: 35,
    fullHits: 6,
    bestFullHitsInRound: 4,
    starsWon: 3,
    crest: { primary: "#ef6a6a", secondary: "#2b1212", symbol: "FR" },
  },
  {
    id: "p5",
    name: "Gustavo Lima",
    nickname: "Gus",
    points: 31,
    fullHits: 5,
    bestFullHitsInRound: 2,
    starsWon: 0,
    crest: { primary: "#c084fc", secondary: "#201230", symbol: "GL" },
  },
  {
    id: "p6",
    name: "Diego Alvarez",
    nickname: "Diego",
    points: 29,
    fullHits: 4,
    bestFullHitsInRound: 1,
    starsWon: 1,
    crest: { primary: "#fb923c", secondary: "#2b160a", symbol: "DA" },
  },
];

export const rounds: Round[] = [
  {
    id: "round-4",
    number: 4,
    competition: "Primera Division",
    startsAt: "2026-06-20T18:00:00-03:00",
    closesAt: "2026-06-20T17:45:00-03:00",
    matches: [
      match("m401", 4, "racing", "velez", "2026-06-20T18:00:00-03:00", "Cilindro de Avellaneda", "finished", { home: 2, away: 1 }, { home: 2, away: 1 }),
      match("m402", 4, "lanus", "newells", "2026-06-20T20:15:00-03:00", "La Fortaleza", "finished", { home: 0, away: 0 }, { home: 1, away: 1 }),
      match("m403", 4, "river", "argentinos", "2026-06-21T19:30:00-03:00", "Mas Monumental", "finished", { home: 3, away: 0 }, { home: 2, away: 0 }),
    ],
  },
  {
    id: "round-5",
    number: 5,
    competition: "Primera Division",
    startsAt: "2026-06-27T17:00:00-03:00",
    closesAt: "2026-06-27T16:45:00-03:00",
    isCurrent: true,
    matches: [
      match("m501", 5, "boca", "estudiantes", "2026-06-27T17:00:00-03:00", "La Bombonera", "finished", { home: 1, away: 1 }, { home: 1, away: 1 }),
      match("m502", 5, "independiente", "san-lorenzo", "2026-06-27T19:15:00-03:00", "Libertadores de America", "finished", { home: 2, away: 0 }, { home: 1, away: 0 }),
      match("m503", 5, "talleres", "central", "2026-06-28T16:00:00-03:00", "Mario Alberto Kempes", "live", undefined, { home: 2, away: 2 }),
      match("m504", 5, "velez", "river", "2026-06-28T20:00:00-03:00", "Jose Amalfitani", "scheduled", undefined, { home: 1, away: 2 }),
    ],
  },
  {
    id: "round-6",
    number: 6,
    competition: "Primera Division",
    startsAt: "2026-07-04T18:00:00-03:00",
    closesAt: "2026-07-04T17:45:00-03:00",
    isNext: true,
    matches: [
      match("m601", 6, "river", "boca", "2026-07-04T18:00:00-03:00", "Mas Monumental", "scheduled", undefined, undefined),
      match("m602", 6, "racing", "independiente", "2026-07-04T20:30:00-03:00", "Cilindro de Avellaneda", "scheduled", undefined, { home: 1, away: 0 }),
      match("m603", 6, "san-lorenzo", "talleres", "2026-07-05T17:00:00-03:00", "Pedro Bidegain", "scheduled", undefined, undefined),
      match("m604", 6, "estudiantes", "lanus", "2026-07-05T19:15:00-03:00", "UNO", "scheduled", undefined, { home: 2, away: 1 }),
    ],
  },
];

export const historicalStars: HistoricalStar[] = [
  {
    number: 7,
    champion: participants[3],
    runnerUp: participants[0],
    fullHits: 28,
    bestRound: "Fecha 11",
    worstRound: "Fecha 3",
    relegations: ["Sin descensos"],
  },
  {
    number: 6,
    champion: participants[0],
    runnerUp: participants[1],
    fullHits: 31,
    bestRound: "Fecha 8",
    worstRound: "Fecha 14",
  },
  {
    number: 5,
    champion: participants[1],
    runnerUp: participants[2],
    fullHits: 24,
    bestRound: "Fecha 6",
    worstRound: "Fecha 2",
  },
];

export const lastMeetings = [
  "River 2-1 Boca",
  "Boca 1-0 River",
  "River 0-0 Boca",
  "Boca 2-2 River",
  "River 1-0 Boca",
];

export const teamForm = {
  home: ["G", "E", "G", "P", "G"],
  away: ["G", "G", "E", "P", "E"],
};

export function findMatchById(id: string) {
  return rounds.flatMap((round) => round.matches).find((item) => item.id === id);
}
