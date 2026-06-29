import { cn } from "@/lib/utils";

export function AuthMessage({
  status,
  message,
}: {
  status?: "idle" | "error" | "success";
  message?: string;
}) {
  if (!message || status === "idle") {
    return null;
  }

  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        status === "success"
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-destructive/40 bg-destructive/10 text-destructive",
      )}
    >
      {message}
    </div>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}
