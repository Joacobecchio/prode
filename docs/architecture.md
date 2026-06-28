# Arquitectura inicial

La app queda preparada como una Web App responsive con Next.js App Router. La primera pantalla es el dashboard operativo: tabla general de la Estrella actual, fecha navegable, pronosticos editables antes del inicio, indicadores de puntaje y alerta solo para la proxima fecha pendiente.

## Capas

- `src/app`: rutas publicas de la aplicacion.
- `src/components`: componentes de interfaz, separados por dominio y UI base shadcn-compatible.
- `src/lib`: tipos de dominio, scoring, validaciones, clientes lazy de Supabase y proveedores de futbol.
- `supabase/migrations`: esquema inicial PostgreSQL con RLS.

## Reglas de dominio cubiertas

- El usuario solo puede crear o modificar sus propios pronosticos.
- Los pronosticos quedan bloqueados cuando el partido deja de estar programado o ya comenzo.
- La tabla general se modela como `star_standings` para lectura rapida.
- Los puntajes por partido se guardan en `match_points` para auditoria.
- Los recordatorios se registran en `reminder_deliveries` por fecha, usuario y canal.

## Siguientes integraciones

- Persistir fixtures reales en Supabase desde el proveedor activo de futbol.
- Agregar server actions o route handlers para guardar pronosticos.
- Implementar jobs de sincronizacion API Football y recalculo de puntajes.
- Conectar proveedores de email y SMS para recordatorios dos horas antes del primer partido.

## Proveedores de futbol

La app ya incluye una capa server-side en `src/lib/api-football.ts` y endpoints internos bajo `/api/football`. Puede usar TheSportsDB free o API-Sports/API Football segun `FOOTBALL_PROVIDER`. Ver `docs/api-football.md` para configuracion y uso.
