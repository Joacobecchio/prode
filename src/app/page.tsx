import { Dashboard } from "@/components/dashboard/dashboard";
import { getFootballRounds } from "@/lib/api-football";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getFootballRounds();

  return <Dashboard rounds={data.rounds} />;
}
