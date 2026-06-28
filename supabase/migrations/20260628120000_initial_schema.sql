create extension if not exists "pgcrypto";

create type public.app_role as enum ('participant', 'admin');
create type public.star_status as enum ('draft', 'active', 'finished');
create type public.round_status as enum ('draft', 'open', 'closed', 'scored');
create type public.match_status as enum ('scheduled', 'live', 'finished', 'postponed');
create type public.reminder_channel as enum ('email', 'sms');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  nickname text not null,
  email text not null unique,
  phone text,
  crest_primary text not null default '#7ad45e',
  crest_secondary text not null default '#10251b',
  crest_symbol text not null default 'PE',
  stars_won integer not null default 0 check (stars_won >= 0),
  role public.app_role not null default 'participant',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create table public.stars (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique check (number > 0),
  name text not null,
  status public.star_status not null default 'draft',
  champion_profile_id uuid references public.profiles(id),
  runner_up_profile_id uuid references public.profiles(id),
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  api_football_id integer unique,
  name text not null,
  short_name text not null,
  crest_url text,
  primary_color text not null default '#ffffff',
  secondary_color text not null default '#111827',
  created_at timestamptz not null default now()
);

create table public.rounds (
  id uuid primary key default gen_random_uuid(),
  star_id uuid not null references public.stars(id) on delete cascade,
  number integer not null check (number > 0),
  competition text not null,
  status public.round_status not null default 'draft',
  starts_at timestamptz not null,
  closes_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (star_id, number)
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  api_football_fixture_id integer unique,
  home_team_id uuid not null references public.teams(id),
  away_team_id uuid not null references public.teams(id),
  venue text,
  kickoff_at timestamptz not null,
  status public.match_status not null default 'scheduled',
  official_home_score integer check (official_home_score >= 0),
  official_away_score integer check (official_away_score >= 0),
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (home_team_id <> away_team_id)
);

create table public.predictions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  home_score integer not null check (home_score >= 0 and home_score <= 20),
  away_score integer not null check (away_score >= 0 and away_score <= 20),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (match_id, profile_id)
);

create table public.match_points (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null default 0 check (points >= 0),
  is_full_hit boolean not null default false,
  reason text not null,
  calculated_at timestamptz not null default now(),
  unique (match_id, profile_id)
);

create table public.star_standings (
  star_id uuid not null references public.stars(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  points integer not null default 0,
  full_hits integer not null default 0,
  best_full_hits_in_round integer not null default 0,
  position integer,
  updated_at timestamptz not null default now(),
  primary key (star_id, profile_id)
);

create table public.reminder_deliveries (
  id uuid primary key default gen_random_uuid(),
  round_id uuid not null references public.rounds(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  channel public.reminder_channel not null,
  reason text not null,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.api_sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'api-football',
  scope text not null,
  status text not null,
  details jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.stars enable row level security;
alter table public.teams enable row level security;
alter table public.rounds enable row level security;
alter table public.matches enable row level security;
alter table public.predictions enable row level security;
alter table public.match_points enable row level security;
alter table public.star_standings enable row level security;
alter table public.reminder_deliveries enable row level security;
alter table public.api_sync_runs enable row level security;

create policy "profiles are visible to signed users"
on public.profiles for select
to authenticated
using (true);

create policy "users update their own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "admins manage profiles"
on public.profiles for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "signed users read tournament data"
on public.stars for select to authenticated using (true);
create policy "signed users read teams"
on public.teams for select to authenticated using (true);
create policy "signed users read rounds"
on public.rounds for select to authenticated using (true);
create policy "signed users read matches"
on public.matches for select to authenticated using (true);
create policy "signed users read standings"
on public.star_standings for select to authenticated using (true);
create policy "signed users read match points"
on public.match_points for select to authenticated using (true);

create policy "admins manage stars"
on public.stars for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage teams"
on public.teams for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage rounds"
on public.rounds for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage matches"
on public.matches for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage scoring"
on public.match_points for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage standings"
on public.star_standings for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage reminders"
on public.reminder_deliveries for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins manage sync runs"
on public.api_sync_runs for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "users read their own predictions"
on public.predictions for select
to authenticated
using (profile_id = auth.uid() or public.is_admin());

create policy "users create their own predictions before lock"
on public.predictions for insert
to authenticated
with check (
  profile_id = auth.uid()
  and exists (
    select 1
    from public.matches m
    where m.id = match_id
      and m.status = 'scheduled'
      and m.kickoff_at > now()
  )
);

create policy "users update their own predictions before lock"
on public.predictions for update
to authenticated
using (
  profile_id = auth.uid()
  and exists (
    select 1
    from public.matches m
    where m.id = match_id
      and m.status = 'scheduled'
      and m.kickoff_at > now()
  )
)
with check (profile_id = auth.uid());

create policy "admins manage predictions"
on public.predictions for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create index matches_round_id_idx on public.matches(round_id);
create index matches_kickoff_at_idx on public.matches(kickoff_at);
create index predictions_profile_id_idx on public.predictions(profile_id);
create index predictions_match_id_idx on public.predictions(match_id);
create index match_points_profile_id_idx on public.match_points(profile_id);
create index standings_star_position_idx on public.star_standings(star_id, position);
