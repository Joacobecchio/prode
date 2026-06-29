import type { Match, MatchStatus, Round, Score, Team } from "@/lib/domain";
import { findMatchById, lastMeetings, rounds as mockRounds, teamForm } from "@/lib/mock-data";

export type ApiFootballConfig = {
  baseUrl: string;
  apiKey: string;
  leagueId: number;
  season: number;
  timezone: string;
  cache: {
    fixtures: number;
    detail: number;
    static: number;
  };
};

export type TheSportsDbConfig = {
  baseUrl: string;
  apiKey: string;
  leagueId: number;
  season: string;
  timezone: string;
  roundFrom: number;
  roundTo: number;
  cache: {
    fixtures: number;
    detail: number;
    static: number;
  };
};

export type FootballProvider = "api-football" | "thesportsdb";

export type FootballDataSource = FootballProvider | "mock";

export type FootballRoundsData = {
  rounds: Round[];
  source: FootballDataSource;
  leagueId: number;
  season: number | string;
  warning?: string;
};

export type FootballMatchInsight = {
  match: Match;
  source: FootballDataSource;
  lastMeetings: string[];
  homeForm: string[];
  awayForm: string[];
  positions: {
    home?: string;
    away?: string;
  };
  news: string[];
  warning?: string;
};

type ApiFootballEnvelope<T> = {
  response: T[];
  results?: number;
  errors?: unknown;
};

type ApiFootballFixture = {
  fixture: {
    id: number;
    date: string;
    status: {
      long?: string;
      short?: string;
      elapsed?: number | null;
    };
    venue?: {
      name?: string | null;
    };
  };
  league: {
    id: number;
    name: string;
    round?: string;
  };
  teams: {
    home: ApiFootballTeam;
    away: ApiFootballTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
};

type ApiFootballTeam = {
  id: number;
  name: string;
  logo?: string;
};

type ApiFootballStandingRow = {
  rank: number;
  team: ApiFootballTeam;
  points: number;
};

type ApiFootballStandingGroup = {
  league: {
    standings?: ApiFootballStandingRow[][];
  };
};

type TheSportsDbEnvelope = {
  events?: TheSportsDbEvent[] | null;
  results?: TheSportsDbEvent[] | null;
  table?: TheSportsDbStandingRow[] | null;
};

type TheSportsDbEvent = {
  idEvent: string;
  idAPIfootball?: string | null;
  strTimestamp?: string | null;
  strEvent?: string | null;
  strSport?: string | null;
  idLeague?: string | null;
  strLeague?: string | null;
  strSeason?: string | null;
  strHomeTeam?: string | null;
  strAwayTeam?: string | null;
  intHomeScore?: string | number | null;
  intAwayScore?: string | number | null;
  intRound?: string | number | null;
  dateEvent?: string | null;
  dateEventLocal?: string | null;
  strTime?: string | null;
  strTimeLocal?: string | null;
  idHomeTeam?: string | null;
  idAwayTeam?: string | null;
  strHomeTeamBadge?: string | null;
  strAwayTeamBadge?: string | null;
  strVenue?: string | null;
  strStatus?: string | null;
  strPostponed?: string | null;
  strVideo?: string | null;
};

type TheSportsDbStandingRow = {
  intRank?: string | number | null;
  idTeam?: string | null;
  strTeam?: string | null;
  strGroup?: string | null;
  intPoints?: string | number | null;
  strForm?: string | null;
};

type FootballRoundsOptions = {
  from?: string;
  to?: string;
  leagueId?: number;
  season?: number;
};

type ApiCacheEntry = {
  expiresAt: number;
  response: unknown;
};

const DEFAULT_BASE_URL = "https://v3.football.api-sports.io";
const DEFAULT_LEAGUE_ID = 128;
const DEFAULT_TIMEZONE = "America/Argentina/Cordoba";
const DEFAULT_FIXTURES_TTL_SECONDS = 1800;
const DEFAULT_DETAIL_TTL_SECONDS = 1800;
const DEFAULT_STATIC_TTL_SECONDS = 21600;
const DEFAULT_THESPORTSDB_BASE_URL = "https://www.thesportsdb.com/api/v1/json";
const DEFAULT_THESPORTSDB_API_KEY = "123";
const DEFAULT_THESPORTSDB_LEAGUE_ID = 4406;
const DEFAULT_THESPORTSDB_ROUND_FROM = 1;
const DEFAULT_THESPORTSDB_ROUND_TO = 5;

const apiCache = new Map<string, ApiCacheEntry>();

function getFootballProvider(): FootballProvider {
  return process.env.FOOTBALL_PROVIDER === "thesportsdb"
    ? "thesportsdb"
    : "api-football";
}

export function getApiFootballConfig(): ApiFootballConfig | null {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return null;
  }

  return {
    baseUrl: process.env.API_FOOTBALL_BASE_URL ?? DEFAULT_BASE_URL,
    apiKey,
    leagueId: Number(process.env.API_FOOTBALL_LEAGUE_ID ?? DEFAULT_LEAGUE_ID),
    season: Number(process.env.API_FOOTBALL_SEASON ?? new Date().getFullYear()),
    timezone: process.env.API_FOOTBALL_TIMEZONE ?? DEFAULT_TIMEZONE,
    cache: {
      fixtures: Number(
        process.env.API_FOOTBALL_FIXTURES_TTL_SECONDS ??
          DEFAULT_FIXTURES_TTL_SECONDS,
      ),
      detail: Number(
        process.env.API_FOOTBALL_DETAIL_TTL_SECONDS ?? DEFAULT_DETAIL_TTL_SECONDS,
      ),
      static: Number(
        process.env.API_FOOTBALL_STATIC_TTL_SECONDS ?? DEFAULT_STATIC_TTL_SECONDS,
      ),
    },
  };
}

export function getTheSportsDbConfig(): TheSportsDbConfig {
  return {
    baseUrl: process.env.THESPORTSDB_BASE_URL ?? DEFAULT_THESPORTSDB_BASE_URL,
    apiKey: process.env.THESPORTSDB_API_KEY ?? DEFAULT_THESPORTSDB_API_KEY,
    leagueId: Number(
      process.env.THESPORTSDB_LEAGUE_ID ?? DEFAULT_THESPORTSDB_LEAGUE_ID,
    ),
    season: process.env.THESPORTSDB_SEASON ?? String(new Date().getFullYear()),
    timezone: process.env.THESPORTSDB_TIMEZONE ?? DEFAULT_TIMEZONE,
    roundFrom: Number(
      process.env.THESPORTSDB_ROUND_FROM ?? DEFAULT_THESPORTSDB_ROUND_FROM,
    ),
    roundTo: Number(
      process.env.THESPORTSDB_ROUND_TO ?? DEFAULT_THESPORTSDB_ROUND_TO,
    ),
    cache: {
      fixtures: Number(
        process.env.THESPORTSDB_FIXTURES_TTL_SECONDS ??
          DEFAULT_FIXTURES_TTL_SECONDS,
      ),
      detail: Number(
        process.env.THESPORTSDB_DETAIL_TTL_SECONDS ?? DEFAULT_DETAIL_TTL_SECONDS,
      ),
      static: Number(
        process.env.THESPORTSDB_STATIC_TTL_SECONDS ?? DEFAULT_STATIC_TTL_SECONDS,
      ),
    },
  };
}

export async function getFootballRounds(
  options: FootballRoundsOptions = {},
): Promise<FootballRoundsData> {
  if (getFootballProvider() === "thesportsdb") {
    return getTheSportsDbRounds(options);
  }

  const config = getApiFootballConfig();
  const leagueId = options.leagueId ?? config?.leagueId ?? DEFAULT_LEAGUE_ID;
  const season = options.season ?? config?.season ?? new Date().getFullYear();

  if (!config) {
    return {
      rounds: mockRounds,
      source: "mock",
      leagueId,
      season,
      warning: "Falta API_FOOTBALL_KEY. Se muestran datos demo.",
    };
  }

  try {
    const window = getDefaultDateWindow();
    const fixtures = await apiFootballFetch<ApiFootballFixture[]>(
      config,
      "/fixtures",
      {
        league: String(leagueId),
        season: String(season),
        from: options.from ?? process.env.API_FOOTBALL_FROM ?? window.from,
        to: options.to ?? process.env.API_FOOTBALL_TO ?? window.to,
        timezone: config.timezone,
      },
      config.cache.fixtures,
    );

    if (fixtures.length === 0) {
      return {
        rounds: mockRounds,
        source: "mock",
        leagueId,
        season,
        warning: "API Football no devolvio partidos para el rango elegido. Se muestran datos demo.",
      };
    }

    return {
      rounds: mapFixturesToRounds(fixtures),
      source: "api-football",
      leagueId,
      season,
    };
  } catch (error) {
    return {
      rounds: mockRounds,
      source: "mock",
      leagueId,
      season,
      warning: getErrorMessage(error),
    };
  }
}

export async function getFootballMatchInsight(
  id: string,
): Promise<FootballMatchInsight | null> {
  if (id.startsWith("tsdb-") || getFootballProvider() === "thesportsdb") {
    return getTheSportsDbMatchInsight(id);
  }

  const mockMatch = findMatchById(id);
  const config = getApiFootballConfig();

  if (!id.startsWith("api-") || !config) {
    if (!mockMatch) {
      return null;
    }

    return {
      match: mockMatch,
      source: "mock",
      lastMeetings,
      homeForm: teamForm.home,
      awayForm: teamForm.away,
      positions: {
        home: "3ro, 22 pts",
        away: "7mo, 17 pts",
      },
      news: [
        "El local mantiene una racha positiva jugando en casa.",
        "El visitante recupera dos titulares para esta fecha.",
        "El historial reciente muestra partidos de bajo margen.",
      ],
      warning: config ? undefined : "Falta API_FOOTBALL_KEY. Se muestran datos demo.",
    };
  }

  try {
    const fixtureId = Number(id.replace("api-", ""));
    const [fixture] = await apiFootballFetch<ApiFootballFixture[]>(
      config,
      "/fixtures",
      { id: String(fixtureId), timezone: config.timezone },
      config.cache.detail,
    );

    if (!fixture) {
      return null;
    }

    const match = mapFixtureToMatch(fixture);
    const [meetings, homeLast, awayLast, standings] = await Promise.all([
      getHeadToHead(config, fixture.teams.home.id, fixture.teams.away.id),
      getTeamLastMatches(config, fixture.teams.home.id),
      getTeamLastMatches(config, fixture.teams.away.id),
      getStandings(config, fixture.league.id),
    ]);

    return {
      match,
      source: "api-football",
      lastMeetings: meetings,
      homeForm: homeLast.map(getResultLetterForTeam(fixture.teams.home.id)),
      awayForm: awayLast.map(getResultLetterForTeam(fixture.teams.away.id)),
      positions: {
        home: formatTeamStanding(standings, fixture.teams.home.id),
        away: formatTeamStanding(standings, fixture.teams.away.id),
      },
      news: [
        "API Football no incluye noticias editoriales en esta integracion.",
        "Se muestran forma reciente, enfrentamientos directos y posicion.",
      ],
    };
  } catch (error) {
    if (!mockMatch) {
      throw error;
    }

    return {
      match: mockMatch,
      source: "mock",
      lastMeetings,
      homeForm: teamForm.home,
      awayForm: teamForm.away,
      positions: {
        home: "3ro, 22 pts",
        away: "7mo, 17 pts",
      },
      news: [
        "No se pudo leer API Football para este partido.",
        "Se muestran datos demo mientras se revisa la integracion.",
      ],
      warning: getErrorMessage(error),
    };
  }
}

async function getTheSportsDbRounds(
  options: FootballRoundsOptions = {},
): Promise<FootballRoundsData> {
  const config = getTheSportsDbConfig();
  const leagueId = options.leagueId ?? config.leagueId;
  const season = options.season ? String(options.season) : config.season;

  try {
    const window = getDefaultDateWindow();
    const from = options.from ?? process.env.THESPORTSDB_FROM ?? window.from;
    const to = options.to ?? process.env.THESPORTSDB_TO ?? window.to;
    const events = await getTheSportsDbEvents(config, {
      leagueId,
      season,
      from,
      to,
    });

    if (events.length === 0) {
      return {
        rounds: mockRounds,
        source: "mock",
        leagueId,
        season,
        warning:
          "TheSportsDB no devolvio partidos para el rango elegido. Se muestran datos demo.",
      };
    }

    return {
      rounds: mapTheSportsDbEventsToRounds(events, config.timezone),
      source: "thesportsdb",
      leagueId,
      season,
    };
  } catch (error) {
    return {
      rounds: mockRounds,
      source: "mock",
      leagueId,
      season,
      warning: getErrorMessage(error),
    };
  }
}

async function getTheSportsDbMatchInsight(
  id: string,
): Promise<FootballMatchInsight | null> {
  const mockMatch = findMatchById(id);
  const config = getTheSportsDbConfig();

  if (!id.startsWith("tsdb-")) {
    if (!mockMatch) {
      return null;
    }

    return {
      match: mockMatch,
      source: "mock",
      lastMeetings,
      homeForm: teamForm.home,
      awayForm: teamForm.away,
      positions: {
        home: "3ro, 22 pts",
        away: "7mo, 17 pts",
      },
      news: [
        "TheSportsDB esta activo, pero este partido pertenece a los datos demo.",
        "Abri un partido real desde la seccion Partidos para ver datos reales.",
      ],
    };
  }

  try {
    const eventId = id.replace("tsdb-", "");
    const payload = await theSportsDbFetch(
      config,
      "lookupevent.php",
      { id: eventId },
      config.cache.detail,
    );
    const event = payload.events?.[0];

    if (!event) {
      return null;
    }

    const match = mapTheSportsDbEventToMatch(event, config.timezone);
    const [homeLast, awayLast, standings] = await Promise.all([
      getTheSportsDbTeamLastMatches(config, event.idHomeTeam),
      getTheSportsDbTeamLastMatches(config, event.idAwayTeam),
      getTheSportsDbStandings(config),
    ]);

    return {
      match,
      source: "thesportsdb",
      lastMeetings: [
        "TheSportsDB free no expone enfrentamientos directos para esta liga.",
      ],
      homeForm: homeLast.map(getTheSportsDbResultLetterForTeam(event.idHomeTeam)),
      awayForm: awayLast.map(getTheSportsDbResultLetterForTeam(event.idAwayTeam)),
      positions: {
        home: formatTheSportsDbStanding(standings, event.idHomeTeam),
        away: formatTheSportsDbStanding(standings, event.idAwayTeam),
      },
      news: [
        "TheSportsDB free no incluye noticias editoriales.",
        event.strVideo
          ? "La fuente trae un video/resumen asociado a este partido."
          : "Se muestran fixture, escudos, estadio, tabla y forma reciente cuando estan disponibles.",
      ],
    };
  } catch (error) {
    if (!mockMatch) {
      throw error;
    }

    return {
      match: mockMatch,
      source: "mock",
      lastMeetings,
      homeForm: teamForm.home,
      awayForm: teamForm.away,
      positions: {
        home: "3ro, 22 pts",
        away: "7mo, 17 pts",
      },
      news: [
        "No se pudo leer TheSportsDB para este partido.",
        "Se muestran datos demo mientras se revisa la integracion.",
      ],
      warning: getErrorMessage(error),
    };
  }
}

async function getTheSportsDbEvents(
  config: TheSportsDbConfig,
  options: {
    leagueId: number;
    season: string;
    from: string;
    to: string;
  },
) {
  const roundFrom = Math.min(config.roundFrom, config.roundTo);
  const roundTo = Math.max(config.roundFrom, config.roundTo);
  const roundRequests = Array.from(
    { length: roundTo - roundFrom + 1 },
    (_, index) => roundFrom + index,
  ).map((round) =>
    theSportsDbFetch(
      config,
      "eventsround.php",
      {
        id: String(options.leagueId),
        r: String(round),
        s: options.season,
      },
      config.cache.fixtures,
    ),
  );

  const payloads = await Promise.all([
    ...roundRequests,
    theSportsDbFetch(
      config,
      "eventsnextleague.php",
      { id: String(options.leagueId) },
      config.cache.fixtures,
    ),
    theSportsDbFetch(
      config,
      "eventspastleague.php",
      { id: String(options.leagueId) },
      config.cache.fixtures,
    ),
  ]);

  const uniqueEvents = new Map<string, TheSportsDbEvent>();

  payloads.flatMap(getTheSportsDbEventList).forEach((event) => {
    if (event.idEvent) {
      uniqueEvents.set(event.idEvent, event);
    }
  });

  return Array.from(uniqueEvents.values()).filter((event) =>
    isTheSportsDbEventInsideWindow(event, options.from, options.to, config.timezone),
  );
}

async function getTheSportsDbTeamLastMatches(
  config: TheSportsDbConfig,
  teamId?: string | null,
) {
  if (!teamId) {
    return [];
  }

  const payload = await theSportsDbFetch(
    config,
    "eventslast.php",
    { id: teamId },
    config.cache.static,
  );

  return getTheSportsDbEventList(payload).slice(0, 5);
}

async function getTheSportsDbStandings(config: TheSportsDbConfig) {
  const payload = await theSportsDbFetch(
    config,
    "lookuptable.php",
    {
      l: String(config.leagueId),
      s: config.season,
    },
    config.cache.static,
  );

  return payload.table ?? [];
}

async function theSportsDbFetch(
  config: TheSportsDbConfig,
  path: string,
  params: Record<string, string>,
  revalidate: number,
): Promise<TheSportsDbEnvelope> {
  const url = new URL(
    `${config.baseUrl.replace(/\/$/, "")}/${config.apiKey}/${path.replace(/^\//, "")}`,
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const cacheKey = `thesportsdb:${url.toString()}`;
  const cached = apiCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.response as TheSportsDbEnvelope;
  }

  const response = await fetch(url, {
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`TheSportsDB respondio ${response.status}.`);
  }

  const payload = (await response.json()) as TheSportsDbEnvelope;

  apiCache.set(cacheKey, {
    expiresAt: Date.now() + revalidate * 1000,
    response: payload,
  });

  return payload;
}

function getTheSportsDbEventList(payload: TheSportsDbEnvelope) {
  return [...(payload.events ?? []), ...(payload.results ?? [])];
}

function mapTheSportsDbEventsToRounds(
  events: TheSportsDbEvent[],
  timezone: string,
): Round[] {
  const sortedEvents = [...events].sort(
    (a, b) =>
      new Date(mapTheSportsDbKickoffAt(a, timezone)).getTime() -
      new Date(mapTheSportsDbKickoffAt(b, timezone)).getTime(),
  );
  const grouped = new Map<string, TheSportsDbEvent[]>();

  sortedEvents.forEach((event) => {
    const key = getTheSportsDbRoundKey(event, timezone);
    grouped.set(key, [...(grouped.get(key) ?? []), event]);
  });

  const now = new Date();
  const rounds = Array.from(grouped.entries()).map(([key, roundEvents], index) => {
    const startsAt = mapTheSportsDbKickoffAt(roundEvents[0], timezone);
    const closesAt = mapTheSportsDbKickoffAt(
      roundEvents[roundEvents.length - 1],
      timezone,
    );
    const roundNumber = parseNullableNumber(roundEvents[0]?.intRound) ?? index + 1;
    const hasLive = roundEvents.some(
      (event) => mapTheSportsDbStatus(event) === "live",
    );
    const starts = new Date(startsAt);
    const ends = new Date(closesAt);
    const isCurrent = hasLive || (starts <= now && now <= ends);

    return {
      id: `tsdb-round-${key}`,
      number: roundNumber,
      label: formatTheSportsDbRoundLabel(roundNumber, startsAt),
      competition: roundEvents[0]?.strLeague ?? "Argentinian Primera Division",
      startsAt,
      closesAt,
      isCurrent,
      isNext: false,
      matches: roundEvents.map((event) =>
        mapTheSportsDbEventToMatch(event, timezone),
      ),
    };
  });

  const nextRoundIndex = rounds.findIndex(
    (round) => !round.isCurrent && new Date(round.startsAt) > now,
  );

  return rounds.map((round, index) => ({
    ...round,
    isNext: index === nextRoundIndex,
  }));
}

function mapTheSportsDbEventToMatch(
  event: TheSportsDbEvent,
  timezone: string,
): Match {
  const apiFootballId = parseNullableNumber(event.idAPIfootball);

  return {
    id: `tsdb-${event.idEvent}`,
    roundNumber: parseNullableNumber(event.intRound) ?? 0,
    competition: event.strLeague ?? "Argentinian Primera Division",
    kickoffAt: mapTheSportsDbKickoffAt(event, timezone),
    venue: event.strVenue || "Estadio a confirmar",
    status: mapTheSportsDbStatus(event),
    homeTeam: mapTheSportsDbTeam({
      id: event.idHomeTeam,
      name: event.strHomeTeam,
      badge: event.strHomeTeamBadge,
    }),
    awayTeam: mapTheSportsDbTeam({
      id: event.idAwayTeam,
      name: event.strAwayTeam,
      badge: event.strAwayTeamBadge,
    }),
    officialScore: mapTheSportsDbScore(event),
    apiFootballId,
  };
}

function mapTheSportsDbTeam(team: {
  id?: string | null;
  name?: string | null;
  badge?: string | null;
}): Team {
  const name = team.name ?? "Equipo a confirmar";

  return {
    id: `tsdb-team-${team.id ?? abbreviateTeamName(name)}`,
    name,
    shortName: abbreviateTeamName(name),
    colors: ["#ffffff", "#123c8c"],
    logoUrl: team.badge ?? undefined,
  };
}

function mapTheSportsDbScore(event: TheSportsDbEvent): Score | undefined {
  const home = parseNullableNumber(event.intHomeScore);
  const away = parseNullableNumber(event.intAwayScore);

  if (home === undefined || away === undefined) {
    return undefined;
  }

  return { home, away };
}

function mapTheSportsDbStatus(event: TheSportsDbEvent): MatchStatus {
  if (event.strPostponed === "yes") {
    return "postponed";
  }

  const status = event.strStatus ?? "";

  if (["FT", "AET", "PEN"].includes(status)) {
    return "finished";
  }

  if (["NS", "TBD"].includes(status)) {
    return "scheduled";
  }

  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(status)) {
    return "postponed";
  }

  return "live";
}

function mapTheSportsDbKickoffAt(event: TheSportsDbEvent, timezone: string) {
  if (event.dateEventLocal && event.strTimeLocal) {
    return `${event.dateEventLocal}T${normalizeTime(event.strTimeLocal)}`;
  }

  if (event.strTimestamp) {
    const utcDate = new Date(
      event.strTimestamp.endsWith("Z")
        ? event.strTimestamp
        : `${event.strTimestamp}Z`,
    );

    if (!Number.isNaN(utcDate.getTime())) {
      return formatDateInTimezone(utcDate, timezone);
    }
  }

  return `${event.dateEvent ?? toDateParam(new Date())}T${normalizeTime(
    event.strTime ?? "00:00:00",
  )}`;
}

function formatDateInTimezone(date: Date, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";

  return `${getPart("year")}-${getPart("month")}-${getPart("day")}T${getPart(
    "hour",
  )}:${getPart("minute")}:${getPart("second")}`;
}

function getTheSportsDbRoundKey(event: TheSportsDbEvent, timezone: string) {
  const round = parseNullableNumber(event.intRound) ?? 0;
  const kickoffAt = mapTheSportsDbKickoffAt(event, timezone);
  const phase = getTheSportsDbPhase(kickoffAt);

  return `${phase}-${round}`;
}

function formatTheSportsDbRoundLabel(roundNumber: number, startsAt: string) {
  const phase = getTheSportsDbPhase(startsAt);
  const phaseLabel = phase === "clausura" ? "Clausura" : "Apertura";

  return `Fecha ${roundNumber} - ${phaseLabel}`;
}

function getTheSportsDbPhase(isoDate: string) {
  const month = Number(isoDate.slice(5, 7));

  return month >= 7 ? "clausura" : "apertura";
}

function isTheSportsDbEventInsideWindow(
  event: TheSportsDbEvent,
  from: string,
  to: string,
  timezone: string,
) {
  const date = mapTheSportsDbKickoffAt(event, timezone).slice(0, 10);

  return date >= from && date <= to;
}

function getTheSportsDbResultLetterForTeam(teamId?: string | null) {
  return (event: TheSportsDbEvent) => {
    const score = mapTheSportsDbScore(event);

    if (!teamId || !score) {
      return "-";
    }

    const isHome = event.idHomeTeam === teamId;
    const ownGoals = isHome ? score.home : score.away;
    const rivalGoals = isHome ? score.away : score.home;

    if (ownGoals > rivalGoals) return "G";
    if (ownGoals < rivalGoals) return "P";
    return "E";
  };
}

function formatTheSportsDbStanding(
  rows: TheSportsDbStandingRow[],
  teamId?: string | null,
) {
  const row = rows.find((item) => item.idTeam === teamId);

  if (!row) {
    return undefined;
  }

  const rank = row.intRank ?? "-";
  const points = row.intPoints ?? "-";
  const group = row.strGroup ? `${row.strGroup}: ` : "";

  return `${group}Puesto ${rank}, ${points} pts`;
}

async function getHeadToHead(
  config: ApiFootballConfig,
  homeTeamId: number,
  awayTeamId: number,
) {
  const fixtures = await apiFootballFetch<ApiFootballFixture[]>(
    config,
    "/fixtures/headtohead",
    {
      h2h: `${homeTeamId}-${awayTeamId}`,
      last: "5",
      timezone: config.timezone,
    },
    config.cache.static,
  );

  return fixtures.map(
    (fixture) =>
      `${fixture.teams.home.name} ${fixture.goals.home ?? "-"}-${fixture.goals.away ?? "-"} ${fixture.teams.away.name}`,
  );
}

async function getTeamLastMatches(config: ApiFootballConfig, teamId: number) {
  return apiFootballFetch<ApiFootballFixture[]>(
    config,
    "/fixtures",
    {
      team: String(teamId),
      last: "5",
      timezone: config.timezone,
    },
    config.cache.static,
  );
}

async function getStandings(config: ApiFootballConfig, leagueId: number) {
  const groups = await apiFootballFetch<ApiFootballStandingGroup[]>(
    config,
    "/standings",
    {
      league: String(leagueId),
      season: String(config.season),
    },
    config.cache.static,
  );

  return groups.flatMap((group) => group.league.standings ?? []).flat();
}

async function apiFootballFetch<T>(
  config: ApiFootballConfig,
  path: string,
  params: Record<string, string>,
  revalidate: number,
): Promise<T> {
  const url = new URL(path, config.baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const cacheKey = url.toString();
  const cached = apiCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.response as T;
  }

  const response = await fetch(url, {
    headers: getApiFootballHeaders(config),
    next: { revalidate },
  });

  if (!response.ok) {
    throw new Error(`API Football respondio ${response.status}.`);
  }

  const payload = (await response.json()) as ApiFootballEnvelope<unknown>;

  if (hasApiErrors(payload.errors)) {
    throw new Error(`API Football devolvio errores: ${JSON.stringify(payload.errors)}`);
  }

  apiCache.set(cacheKey, {
    expiresAt: Date.now() + revalidate * 1000,
    response: payload.response,
  });

  return payload.response as T;
}

function getApiFootballHeaders(config: ApiFootballConfig): Record<string, string> {
  if (config.baseUrl.includes("rapidapi.com")) {
    return {
      "x-rapidapi-host": new URL(config.baseUrl).hostname,
      "x-rapidapi-key": config.apiKey,
    };
  }

  return {
    "x-apisports-key": config.apiKey,
  };
}

function mapFixturesToRounds(fixtures: ApiFootballFixture[]): Round[] {
  const sortedFixtures = [...fixtures].sort(
    (a, b) =>
      new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime(),
  );
  const grouped = new Map<string, ApiFootballFixture[]>();

  sortedFixtures.forEach((fixture) => {
    const key = fixture.league.round ?? "Fixture";
    grouped.set(key, [...(grouped.get(key) ?? []), fixture]);
  });

  const roundEntries = Array.from(grouped.entries());
  const now = new Date();

  return roundEntries.map(([label, roundFixtures], index) => {
    const startsAt = roundFixtures[0]?.fixture.date ?? now.toISOString();
    const closesAt = startsAt;
    const number = parseRoundNumber(label) ?? index + 1;
    const hasLive = roundFixtures.some((fixture) =>
      mapFixtureStatus(fixture.fixture.status.short) === "live"
    );
    const starts = new Date(startsAt);
    const ends = new Date(roundFixtures[roundFixtures.length - 1]?.fixture.date ?? startsAt);
    const isCurrent = hasLive || (starts <= now && now <= ends);

    return {
      id: `api-round-${number}-${index}`,
      number,
      label,
      competition: roundFixtures[0]?.league.name ?? "Primera Division",
      startsAt,
      closesAt,
      isCurrent,
      isNext: !isCurrent && starts > now,
      matches: roundFixtures.map(mapFixtureToMatch),
    };
  });
}

function mapFixtureToMatch(fixture: ApiFootballFixture): Match {
  return {
    id: `api-${fixture.fixture.id}`,
    roundNumber: parseRoundNumber(fixture.league.round) ?? 0,
    competition: fixture.league.name,
    kickoffAt: fixture.fixture.date,
    venue: fixture.fixture.venue?.name ?? "Estadio a confirmar",
    status: mapFixtureStatus(fixture.fixture.status.short),
    homeTeam: mapApiTeam(fixture.teams.home),
    awayTeam: mapApiTeam(fixture.teams.away),
    officialScore: mapGoalsToScore(fixture.goals),
    apiFootballId: fixture.fixture.id,
  };
}

function mapApiTeam(team: ApiFootballTeam): Team {
  return {
    id: `api-team-${team.id}`,
    name: team.name,
    shortName: abbreviateTeamName(team.name),
    colors: ["#ffffff", "#123c8c"],
    logoUrl: team.logo,
    apiFootballId: team.id,
  };
}

function mapGoalsToScore(goals: ApiFootballFixture["goals"]): Score | undefined {
  if (goals.home === null || goals.away === null) {
    return undefined;
  }

  return {
    home: goals.home,
    away: goals.away,
  };
}

function mapFixtureStatus(status?: string): MatchStatus {
  if (["FT", "AET", "PEN"].includes(status ?? "")) {
    return "finished";
  }

  if (["NS", "TBD"].includes(status ?? "")) {
    return "scheduled";
  }

  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(status ?? "")) {
    return "postponed";
  }

  return "live";
}

function getResultLetterForTeam(teamId: number) {
  return (fixture: ApiFootballFixture) => {
    if (fixture.goals.home === null || fixture.goals.away === null) {
      return "P";
    }

    const isHome = fixture.teams.home.id === teamId;
    const ownGoals = isHome ? fixture.goals.home : fixture.goals.away;
    const rivalGoals = isHome ? fixture.goals.away : fixture.goals.home;

    if (ownGoals > rivalGoals) return "G";
    if (ownGoals < rivalGoals) return "P";
    return "E";
  };
}

function formatTeamStanding(rows: ApiFootballStandingRow[], teamId: number) {
  const row = rows.find((item) => item.team.id === teamId);

  if (!row) {
    return undefined;
  }

  return `Puesto ${row.rank}, ${row.points} pts`;
}

function parseNullableNumber(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseRoundNumber(label?: string) {
  const match = label?.match(/(\d+)(?!.*\d)/);

  return match ? Number(match[1]) : undefined;
}

function abbreviateTeamName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getDefaultDateWindow() {
  const now = new Date();
  const from = new Date(now);
  const to = new Date(now);

  from.setDate(now.getDate() - 30);
  to.setDate(now.getDate() + 45);

  return {
    from: toDateParam(from),
    to: toDateParam(to),
  };
}

function toDateParam(date: Date) {
  return date.toISOString().slice(0, 10);
}

function normalizeTime(time: string) {
  const [hour = "00", minute = "00", second = "00"] = time.split(":");

  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(2, "0")}`;
}

function hasApiErrors(errors: unknown) {
  if (!errors) {
    return false;
  }

  if (Array.isArray(errors)) {
    return errors.length > 0;
  }

  if (typeof errors === "object") {
    return Object.keys(errors).length > 0;
  }

  return Boolean(errors);
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "No se pudo leer el proveedor de futbol.";
}
