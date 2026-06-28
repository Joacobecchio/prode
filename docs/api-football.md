# Proveedores de futbol

La app ya tiene una integracion server-side con proveedores de futbol. Las keys nunca se exponen al navegador: se usan desde route handlers de Next.js y desde Server Components.

## Proveedor recomendado para prueba gratis

Para probar sin pagar, usar TheSportsDB:

```bash
FOOTBALL_PROVIDER=thesportsdb
THESPORTSDB_API_KEY=123
THESPORTSDB_BASE_URL=https://www.thesportsdb.com/api/v1/json
THESPORTSDB_LEAGUE_ID=4406
THESPORTSDB_SEASON=2026
THESPORTSDB_TIMEZONE=America/Argentina/Cordoba
THESPORTSDB_FROM=
THESPORTSDB_TO=
THESPORTSDB_ROUND_FROM=1
THESPORTSDB_ROUND_TO=16
THESPORTSDB_FIXTURES_TTL_SECONDS=1800
THESPORTSDB_DETAIL_TTL_SECONDS=1800
THESPORTSDB_STATIC_TTL_SECONDS=21600
```

`THESPORTSDB_LEAGUE_ID=4406` corresponde a Argentinian Primera Division / Liga Profesional. La key `123` es la key publica del plan free para pruebas.

La integracion trae:

- fixtures reales por fecha
- resultados reales cuando el partido termino
- escudos de equipos
- estadio
- estado del partido
- tabla de posiciones cuando esta disponible
- ultimos partidos por equipo cuando esta disponible

Limitaciones vistas en free:

- el endpoint de proximos/anteriores devuelve pocos eventos
- para Argentina conviene consultar por ronda con `eventsround.php`
- no hay noticias editoriales
- no hay head-to-head confiable en el plan free

## API-Sports / API Football

Si se quiere volver al proveedor anterior:

```bash
FOOTBALL_PROVIDER=api-football
```

Y configurar:

```bash
API_FOOTBALL_KEY=tu_key
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
API_FOOTBALL_LEAGUE_ID=128
API_FOOTBALL_SEASON=2026
API_FOOTBALL_TIMEZONE=America/Argentina/Cordoba
API_FOOTBALL_FROM=
API_FOOTBALL_TO=
API_FOOTBALL_FIXTURES_TTL_SECONDS=1800
API_FOOTBALL_DETAIL_TTL_SECONDS=1800
API_FOOTBALL_STATIC_TTL_SECONDS=21600
```

`API_FOOTBALL_LEAGUE_ID=128` queda como default para la liga argentina de primera division, pero se puede cambiar sin tocar codigo.

En plan gratis, API Football puede limitar las temporadas disponibles. Si queres probar datos historicos reales, por ejemplo 2024:

```bash
API_FOOTBALL_SEASON=2024
API_FOOTBALL_FROM=2024-01-01
API_FOOTBALL_TO=2024-12-31
```

## Cuidado del plan gratis

API-Sports en plan gratis oficial incluye 100 requests por dia. TheSportsDB free permite probar sin key privada, pero igual conviene cuidar llamadas.

La app cachea:

- fixtures/listado de partidos por 30 minutos
- detalle de partido por 30 minutos
- standings, head-to-head y ultimos partidos por 6 horas

Eso significa que 10 usuarios abriendo la misma pantalla no deberian consumir 10 llamadas externas si el servidor mantiene el cache caliente. Para produccion conviene persistir snapshots en Supabase y sincronizar por jobs programados.

## Endpoints internos

### Fixtures por rango

```text
GET /api/football/fixtures
GET /api/football/fixtures?from=2026-06-01&to=2026-07-31
GET /api/football/fixtures?league=128&season=2026
```

Devuelve rondas normalizadas al dominio de la app:

- fechas/rondas
- partidos
- equipos con logo real si API Football lo provee
- estado
- resultado oficial cuando existe

### Detalle de partido

```text
GET /api/football/fixtures/api-123456
```

Devuelve:

- partido normalizado
- ultimos cinco enfrentamientos
- ultimos cinco partidos de cada equipo
- posicion actual cuando esta disponible

## Fallback

Si falta configuracion, si la API devuelve error o si no hay fixtures para el rango pedido, la app usa datos demo y devuelve un `warning`. Esto mantiene la UX funcionando mientras se configuran credenciales o se ajusta temporada/liga.

## Pantallas conectadas

- `/`
- `/partidos`
- `/partidos/[id]`
