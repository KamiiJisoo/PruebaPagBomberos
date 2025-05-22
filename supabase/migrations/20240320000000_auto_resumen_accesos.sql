-- Función para crear el resumen mensual
create or replace function generar_resumen_accesos_mensual()
returns void as $$
declare
    mes_actual integer;
    año_actual integer;
    total_accesos integer;
    nombre_tabla text;
begin
    -- Obtener mes y año actual
    mes_actual := extract(month from current_date);
    año_actual := extract(year from current_date);
    nombre_tabla := 'accesos_' || año_actual || '_' || lpad(mes_actual::text, 2, '0');

    -- Contar accesos del mes actual
    select count(*) into total_accesos from accesos;

    -- Crear tabla del mes actual si no existe
    execute format('
        create table if not exists %I (
            id uuid default uuid_generate_v4() primary key,
            ip text not null,
            fecha timestamp with time zone not null,
            created_at timestamp with time zone default now()
        )
    ', nombre_tabla);

    -- Insertar resumen
    insert into resumen_accesos (mes, año, total_accesos, fecha_resumen)
    values (mes_actual, año_actual, total_accesos, current_timestamp);

    -- Limpiar tabla de accesos actual
    delete from accesos;
end;
$$ language plpgsql;

-- Función que se ejecutará al inicio de cada mes
create or replace function check_and_generate_resumen()
returns trigger as $$
begin
    -- Verificar si es el primer día del mes
    if extract(day from current_date) = 1 then
        perform generar_resumen_accesos_mensual();
    end if;
    return new;
end;
$$ language plpgsql;

-- Trigger que se ejecuta cada vez que se inserta un acceso
create trigger trigger_generar_resumen
    after insert on accesos
    for each row
    execute function check_and_generate_resumen(); 