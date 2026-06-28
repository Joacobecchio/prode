import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Participant } from "@/lib/domain";
import { ParticipantCrest, StarCount } from "./participant-crest";

export function StandingsTable({
  participants,
}: {
  participants: Participant[];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-primary">
            Estrella 8
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-normal">
            Tabla General
          </h1>
        </div>
        <Badge variant="secondary">Actualiza en vivo</Badge>
      </div>

      <div className="hidden overflow-hidden rounded-md border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Puesto</TableHead>
              <TableHead className="w-16">Escudo</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead className="text-right">Puntos</TableHead>
              <TableHead className="text-right">Plenos</TableHead>
              <TableHead className="text-right">Mayor pleno</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant, index) => (
              <TableRow key={participant.id}>
                <TableCell className="font-mono text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <ParticipantCrest participant={participant} size="sm" />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{participant.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {participant.nickname}
                    <StarCount count={participant.starsWon} />
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-lg font-semibold text-primary">
                  {participant.points}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {participant.fullHits}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {participant.bestFullHitsInRound}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {participants.map((participant, index) => (
          <article
            key={participant.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border bg-card p-3"
          >
            <div className="font-mono text-sm text-muted-foreground">
              {index + 1}
            </div>
            <div className="flex min-w-0 items-center gap-3">
              <ParticipantCrest participant={participant} size="sm" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {participant.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {participant.fullHits} plenos
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xl font-semibold text-primary">
                {participant.points}
              </div>
              <div className="text-[11px] text-muted-foreground">pts</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
