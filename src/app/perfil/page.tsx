import { ProfileForm } from "@/components/auth/profile-form";
import { Card, CardContent } from "@/components/ui/card";
import { requireAuth } from "@/lib/auth/guards";

export const metadata = {
  title: "Perfil | Prode",
};

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const auth = await requireAuth("/perfil");

  if (!auth.profile) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          No pudimos cargar tu perfil.
        </CardContent>
      </Card>
    );
  }

  return <ProfileForm profile={auth.profile} />;
}
