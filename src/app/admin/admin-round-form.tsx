"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminRoundSchema,
  type AdminRoundFormValues,
} from "@/lib/validations";

export function AdminRoundForm() {
  const [createdRound, setCreatedRound] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRoundFormValues>({
    resolver: zodResolver(adminRoundSchema),
    defaultValues: {
      starId: "star-8",
      number: 7,
      competition: "Primera Division",
      startsAt: "2026-07-11T18:00",
      closesAt: "2026-07-11T17:45",
    },
  });

  function onSubmit(values: AdminRoundFormValues) {
    setCreatedRound(`Fecha ${values.number} lista para ${values.competition}`);
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <Label htmlFor="starId">Estrella</Label>
        <Input id="starId" {...register("starId")} />
        {errors.starId ? <FieldError message={errors.starId.message} /> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="number">Fecha</Label>
          <Input id="number" type="number" {...register("number")} />
          {errors.number ? <FieldError message={errors.number.message} /> : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="competition">Competencia</Label>
          <Input id="competition" {...register("competition")} />
          {errors.competition ? (
            <FieldError message={errors.competition.message} />
          ) : null}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startsAt">Primer partido</Label>
          <Input id="startsAt" type="datetime-local" {...register("startsAt")} />
          {errors.startsAt ? (
            <FieldError message={errors.startsAt.message} />
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="closesAt">Cierre</Label>
          <Input id="closesAt" type="datetime-local" {...register("closesAt")} />
          {errors.closesAt ? (
            <FieldError message={errors.closesAt.message} />
          ) : null}
        </div>
      </div>
      <Button type="submit">
        <CalendarPlus className="h-4 w-4" aria-hidden="true" />
        Crear fecha
      </Button>
      {createdRound ? (
        <div className="rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm text-primary">
          {createdRound}
        </div>
      ) : null}
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  return <p className="text-xs text-destructive">{message}</p>;
}
