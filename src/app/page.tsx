import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";
import { getAuthContext } from "@/lib/auth/session";
import { getFootballRounds } from "@/lib/api-football";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const auth = await getAuthContext();

  if (!auth.user) {
    redirect("/login");
  }

  const data = await getFootballRounds();

  return <Dashboard rounds={data.rounds} />;
}
