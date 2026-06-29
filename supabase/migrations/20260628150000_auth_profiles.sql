drop policy if exists "users create their own profile" on public.profiles;

create policy "users create their own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_full_name text;
  profile_nickname text;
  profile_email text;
  profile_phone text;
  profile_reminder_channel public.reminder_channel;
  profile_role public.app_role;
begin
  profile_full_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'name', ''),
    'Participante'
  );
  profile_email := nullif(coalesce(new.raw_user_meta_data->>'email', new.email), '');
  profile_phone := nullif(coalesce(new.raw_user_meta_data->>'phone', new.phone), '');
  profile_reminder_channel := coalesce(
    nullif(new.raw_user_meta_data->>'reminder_channel', '')::public.reminder_channel,
    case when profile_phone is not null and profile_email is null then 'sms'::public.reminder_channel else 'email'::public.reminder_channel end
  );
  profile_nickname := coalesce(
    nullif(new.raw_user_meta_data->>'nickname', ''),
    split_part(profile_email, '@', 1),
    profile_phone,
    'jugador'
  );

  if profile_reminder_channel = 'email' then
    profile_phone := null;
  else
    profile_email := null;
  end if;

  profile_role := case
    when lower(coalesce(profile_email, '')) = 'joaquin.becchio99@gmail.com'
      then 'super_admin'::public.app_role
    else 'user'::public.app_role
  end;

  insert into public.profiles (
    id,
    full_name,
    nickname,
    email,
    phone,
    reminder_channel,
    role,
    crest_symbol
  )
  values (
    new.id,
    profile_full_name,
    profile_nickname,
    profile_email,
    profile_phone,
    profile_reminder_channel,
    profile_role,
    upper(left(profile_nickname, 2))
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    nickname = excluded.nickname,
    email = excluded.email,
    phone = excluded.phone,
    reminder_channel = excluded.reminder_channel,
    role = case
      when public.profiles.role = 'super_admin'::public.app_role
        then public.profiles.role
      else excluded.role
    end,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();
