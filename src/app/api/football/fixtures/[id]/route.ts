import { NextResponse, type NextRequest } from "next/server";
import { getFootballMatchInsight } from "@/lib/api-football";

type FixtureRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: FixtureRouteProps) {
  const { id } = await params;
  const data = await getFootballMatchInsight(id);

  if (!data) {
    return NextResponse.json(
      { error: "Partido no encontrado." },
      { status: 404 },
    );
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=120, stale-while-revalidate=600",
    },
  });
}
