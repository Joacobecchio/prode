import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthFormShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  footer: {
    text: string;
    href: string;
    label: string;
  };
}) {
  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            Prode
          </p>
          <CardTitle className="mt-1 text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {children}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            {footer.text}{" "}
            <Link href={footer.href} className="font-medium text-primary">
              {footer.label}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
