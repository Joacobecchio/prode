create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as '
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and (
        role::text in (''admin'', ''super_admin'')
        or lower(email) = ''joaquin.becchio99@gmail.com''
      )
  );
';

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as '
  select public.is_super_admin();
';

do '
declare
  super_role text;
begin
  select case
    when exists (
      select 1
      from pg_enum e
      join pg_type t on t.oid = e.enumtypid
      join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = ''public''
        and t.typname = ''app_role''
        and e.enumlabel = ''super_admin''
    )
      then ''super_admin''
    else ''admin''
  end
  into super_role;

  execute format(
    ''update public.profiles set role = %L::public.app_role where lower(email) = %L'',
    super_role,
    ''joaquin.becchio99@gmail.com''
  );
end;
';
