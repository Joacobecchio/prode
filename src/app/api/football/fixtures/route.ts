import { NextResponse, type NextRequest } from "next/server";
import { getFootballRounds } from "@/lib/api-football";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const leagueId = searchParams.get("league");
  const season = searchParams.get("season");

  const data = await getFootballRounds({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    leagueId: leagueId ? Number(leagueId) : undefined,
    season: season ? Number(season) : undefined,
  });

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=180, stale-while-revalidate=600",
    },
  });
}
