-- Respuestas de la propuesta Vestadium (polmorera.es/vestadium)
-- La tabla no es accesible directamente: solo se lee y escribe con dos funciones
-- que comprueban la clave del enlace de revisión (?k=vst-idbb2yxwsqk18g).

create table if not exists public.vestadium_respuestas (
  id          text primary key,                         -- 'review:v1', 'need:claim'…
  tipo        text not null check (tipo in ('review', 'need')),
  clave       text not null,                            -- v1/v2/v3 o la clave de la pregunta
  estado      text,                                     -- review: 'ok' | 'changes' | null · need: opción elegida | null
  nota        text check (char_length(nota) <= 1000),   -- texto de «Pedir cambios»
  autor       text check (char_length(autor) <= 80),    -- nombre que escribe quien responde
  updated_at  timestamptz not null default now()
);

alter table public.vestadium_respuestas enable row level security;
-- Sin políticas a propósito: anon y authenticated no pueden tocar la tabla directamente.

create or replace function public.vestadium_leer(p_key text)
returns setof public.vestadium_respuestas
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_key is distinct from 'vst-idbb2yxwsqk18g' then
    raise exception 'clave no válida' using errcode = '28000';
  end if;
  return query select * from public.vestadium_respuestas order by id;
end;
$$;

create or replace function public.vestadium_responder(
  p_key text, p_tipo text, p_clave text, p_estado text, p_nota text, p_autor text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_key is distinct from 'vst-idbb2yxwsqk18g' then
    raise exception 'clave no válida' using errcode = '28000';
  end if;
  if p_tipo = 'review' then
    if p_clave not in ('v1', 'v2', 'v3') then raise exception 'vídeo no válido'; end if;
    if p_estado is not null and p_estado not in ('ok', 'changes') then raise exception 'estado no válido'; end if;
  elsif p_tipo = 'need' then
    if p_clave not in ('web', 'movil', 'marca', 'legal', 'claim', 'test', 'calendario') then raise exception 'pregunta no válida'; end if;
    if p_estado is not null and char_length(p_estado) > 60 then raise exception 'respuesta no válida'; end if;
  else
    raise exception 'tipo no válido';
  end if;

  insert into public.vestadium_respuestas as r (id, tipo, clave, estado, nota, autor, updated_at)
  values (p_tipo || ':' || p_clave, p_tipo, p_clave, p_estado, left(coalesce(p_nota, ''), 1000), left(coalesce(p_autor, ''), 80), now())
  on conflict (id) do update
    set estado = excluded.estado, nota = excluded.nota, autor = excluded.autor, updated_at = now();
end;
$$;

revoke all on function public.vestadium_leer(text) from public;
revoke all on function public.vestadium_responder(text, text, text, text, text, text) from public;
grant execute on function public.vestadium_leer(text) to anon, authenticated;
grant execute on function public.vestadium_responder(text, text, text, text, text, text) to anon, authenticated;
